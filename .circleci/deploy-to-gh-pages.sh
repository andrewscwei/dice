#!/bin/bash

set -e

source .circleci/get-opts.sh

# Publish docs to gh-pages branch.
echo "Publishing to gh-pages branch..."

if [ `git branch | grep gh-pages` ]
then
  git branch -D gh-pages
fi
git checkout -b gh-pages

# Move public to root and delete everything else.
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name 'public' ! -name '.git' ! -name '.gitignore' -exec rm -rf {} \;
mv public/* .
rm -R public/

# Push to gh-pages.
git config user.name "$CIRCLE_PROJECT_USERNAME"
git config user.email "$CIRCLE_PROJECT_USERNAME@users.noreply.github.com"
git add -fA
git commit --allow-empty -m "[Skip CI] $(git log -1 --pretty=%B)"
git push -f $GIT_ORIGIN_URL gh-pages

echo -e "\nSuccessfuly deployed to GitHub pages"
