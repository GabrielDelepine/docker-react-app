#!/usr/bin/env bash

if [ "$1" != "prod-tlv-next" ] && \
  [ "$1" != "preprod-tlv-next" ] && \
  [ "$1" != "dev-tlv-next" ]
then
  echo "Error: invalid tag name"
  exit 1;
fi

if [ "$2" != '' ] && [ "$2" != '--force-with-lease' ]; then
  echo "Error: 2e arg must be --force-with-lease when given"
  exit 1
fi

git push origin :refs/tags/$1
git tag -f $1
git config push.default current
if [ "$2" == '--force-with-lease' ] ; then
  echo "Force push"
  git push origin --force-with-lease
else
  git push origin
fi
git push origin $1
