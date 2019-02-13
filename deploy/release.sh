#!/bin/bash

set -e

CURRENT_GIT_REF="$(git symbolic-ref HEAD)"
CURRENT_BRANCH=${CURRENT_GIT_REF##*/}

if [ -z "$(git status --porcelain)" ];
    then
    # Working directory clean
    if [ "$CURRENT_BRANCH" == "master" ];
        then
            # pull the latest changes from repository
            echo "########## Pulling latest changes from repository ##########"
            git pull origin "$CURRENT_BRANCH"
            git fetch --tags

            # create a new npm version (patch, minor, major)
            npm version "$1" --no-git-tag-version
            PACKAGE_VERSION="$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')"
            echo "########## Created new version: $PACKAGE_VERSION ##########"

            # update marathon.json
            echo "########## Updating marathon config ##########"
            node ./deploy/updateMarathonJson.js

            # git related stuff
            echo "########## Going to push release to repository ##########"
            git add .
            git commit -m "New release: $PACKAGE_VERSION"
            git tag v$PACKAGE_VERSION
            git push origin "$CURRENT_BRANCH" --tags

            # pipeline
            echo "########## Watch the CI pipeline! ##########"
            open "insert git pipeline here "
        else
            echo "########## Releasing the Api-docs is only allowed from master branch! ##########"
    fi
else
  # Uncommitted changes
  echo "########## Please commit and push all your changes before you release a new version! ##########"
  exit 1
fi

