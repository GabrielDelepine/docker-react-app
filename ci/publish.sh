if [[ "$TRAVIS_BRANCH" != "$TRAVIS_TAG" ]]; then
  echo "Skip docker build: this current build is not a TAG build"
  exit 0;
fi

if [ "$TRAVIS_BRANCH" != "prod-tlv-next" ] && \
  [ "$TRAVIS_BRANCH" != "preprod-tlv-next" ] && \
  [ "$TRAVIS_BRANCH" != "dev-tlv-next" ]
then
  echo "Invalid tag name"
  exit 1;
fi

#PROJECT_NAME=$(echo $TRAVIS_REPO_SLUG | cut -f2 -d/)
# TMP: FORCE THE PROJECT_NAME TO BE ABLE TO USE ARIANNE (MIM-ON-DEMAND)
PROJECT_NAME="mim"

GIT_COMMIT=$(git rev-parse --short HEAD)
sudo start-docker-daemon
echo "logging into docker registry containers.schibsted.io"
docker login -u $ARTIFACTORY_USER -p $ARTIFACTORY_PWD containers.schibsted.io
IMAGE=containers.schibsted.io/$PROJECT_NAME:$GIT_COMMIT

echo "building docker image $IMAGE"
docker build --pull=true --rm -t $IMAGE .
docker push $IMAGE
docker tag $IMAGE containers.schibsted.io/$PROJECT_NAME:$TRAVIS_BRANCH
echo "image tagged with $TRAVIS_BRANCH"
docker push containers.schibsted.io/$PROJECT_NAME:$TRAVIS_BRANCH
echo "image pushed"

ENV="${TRAVIS_BRANCH/-tlv-next/}"
if [ "$ENV" == "prod" ] ; then
  NODE_ENV='production'
elif [ "$ENV" == "preprod" ] ; then
  NODE_ENV='production'
elif [ "$ENV" == "dev" ] ; then
  NODE_ENV='development'
fi
echo "NODE_ENV = $NODE_ENV"

echo "mim on demand request"
bodyMimOnDemand=$(cat << EOF
{"mim": { "version": "$TRAVIS_BRANCH", "envs": { "NODE_ENV":"$NODE_ENV", "ENV":"$ENV" } }, "github": { "pull_request": null }}
EOF
)
urlMimOnDemand=$(curl --silent https://deploy.mim.proctool.leboncoin.io/api/v1/instances/ -d "$bodyMimOnDemand" | jq -r '.url')
echo "mim-on-demand url: $urlMimOnDemand"
