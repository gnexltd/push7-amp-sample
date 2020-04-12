#!/bin/bash
if [ -z ${NETLIFY} ]; then
  echo "Run this script on Netlify" >&2
  exit 1
fi

if [ ${CONTEXT} = "production" ]; then
  # build for production
  BUILD_URL=$URL
else
  # use DEPLOY_PRIME_URL for other contexts
  BUILD_URL=$DEPLOY_PRIME_URL
fi

if [[ ${BUILD_URL} =~ https:\/\/(.*) ]]; then
   HOST=${BASH_REMATCH[1]}
else
  echo "Failed to parse URL" >&2
  exit 1
fi

node build.js --host ${HOST} --appno ${appno} --sw-url ${sw_url}
