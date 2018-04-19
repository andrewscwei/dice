#!/bin/bash

set -e

source .circleci/get-opts.sh

wget https://cli-assets.heroku.com/branches/stable/heroku-linux-amd64.tar.gz
mkdir -p /usr/local/lib /usr/local/bin
tar -xvzf heroku-linux-amd64.tar.gz -C /usr/local/lib
ln -s /usr/local/lib/heroku/bin/heroku /usr/local/bin/heroku

cat > ~/.netrc << EOF
machine api.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
machine git.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
EOF

# Add heroku.com to the list of known hosts
ssh-keyscan -H heroku.com >> ~/.ssh/known_hosts

# Isolate built files.
npm pack
tar -xzf *.tgz
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name 'package' ! -name '.git' ! -name '.gitignore' -exec rm -rf {} \;
mv package/* .
rm -R package/
sed -i -e '/public/d' .gitignore

# Commit and push to Heroku master.
git config user.name "$CIRCLE_PROJECT_USERNAME"
git config user.email "$CIRCLE_PROJECT_USERNAME@users.noreply.github.com"
git add -fA
git commit --allow-empty -m "[Skip CI] $(git log -1 --pretty=%B)"
git push -f git@heroku.com:$PACKAGE_NAME.git ${CIRCLE_BRANCH}:master

echo
echo "Successfuly deployed to Heroku"
