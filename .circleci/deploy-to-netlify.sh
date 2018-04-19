#!/bin/bash

set -e

source .circleci/get-opts.sh

NETLIFY_API=https://api.netlify.com/api/v1
SITE_ID=""

if [ -f .circleci/netlify ]; then
  SITE_ID=$(cat .circleci/netlify)
  echo "Existing site ID ($SITE_ID) found in repo, verifying that site exists..."
  RESULT=$(curl -H "User-Agent: $CIRCLE_PROJECT_USERNAME ($CIRCLE_PROJECT_USERNAME@users.noreply.github.com)" $NETLIFY_API/sites/$SITE_ID?access_token=$NETLIFY_KEY)
  echo $RESULT
  RESPONSE_CODE=$(echo $RESULT | jq -r ".code")

  # Site not found.
  if [[ $RESPONSE_CODE == "404" ]]; then
    SITE_ID=""
  fi
fi

if [[ $SITE_ID == "" ]]; then
  echo "No netlify file detected or site is not found, creating a new site on Netlify..."

  RESULT=$(curl -H "Content-Type: application/zip" -H "Authorization: Bearer $NETLIFY_KEY" --data-binary "@build/$PACKAGE_FILE" $NETLIFY_API/sites)
  SITE_ID=$(echo $RESULT | jq -r ".id")
  SITE_NAME=$(echo $RESULT | jq -r ".subdomain")
  SITE_URL=https://$SITE_NAME.netlify.com

  echo "$SITE_ID" > .circleci/netlify

  git config user.name "$CIRCLE_PROJECT_USERNAME"
  git config user.email "$CIRCLE_PROJECT_USERNAME@users.noreply.github.com"
  git add ./.circleci/netlify
  git commit -m "[Skip CI] Adding generated netlify file"
  git push -f $GIT_ORIGIN_URL

  echo -e "\nDone! Your site URL is:"
  echo $SITE_URL
else
  echo "Deploying to site ${SITE_ID}..."

  TITLE=$(git log --oneline --format=%B -n 1 HEAD | head -n 1)
  RESULT=$(curl -H "Content-Type: application/zip" -H "Authorization: Bearer $NETLIFY_KEY" --data-binary "@build/$PACKAGE_FILE" $NETLIFY_API/sites/$SITE_ID/deploys?title=$TITLE)
  SITE_URL=$(echo $RESULT | jq -r ".url")

  echo $RESULT
  echo -e "\nDone! Your site URL is:"
  echo $SITE_URL
fi
