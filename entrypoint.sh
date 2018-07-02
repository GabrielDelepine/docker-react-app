#!/bin/sh

env

serverNbFiles=$(find ./dist/server -type f | wc -l)
serverDU=$(du -sh dist/server)
printf '\n\nserver-side: %s file(s) taking %s (including source map)\n' "$serverNbFiles" "$serverDU"

webNbFiles=$(find ./dist/web -type f | wc -l)
webDU=$(du -sh dist/web)
printf 'browser-side: %s file(s) taking %s (including source map)\n\n\n' "$webNbFiles" "$webDU"

npm start
