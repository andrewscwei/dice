#!/bin/bash

set -e

source .circleci/get-opts.sh

mkdir -p package
zip -r package/$PACKAGE_FILE.zip public
