#!/bin/bash

set -e

source .circleci/get-opts.sh

mkdir -p build
zip -r build/$PACKAGE_FILE public
