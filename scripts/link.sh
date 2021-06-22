#!/bin/bash

SCOPE_TO_LINK=$1
LINK_TARGET_DIR=$2
ORIGINAL_VERSION=$(node -p "require('./lerna.json').version")
echo "Linking $SCOPE_TO_LINK to $LINK_TARGET_DIR. Original version is $ORIGINAL_VERSION"

cd "$LINK_TARGET_DIR" || exit

# Fetch a list of versions on $LINK_TARGET_DIR
KIE_TOOLING_CORE_VERSION=$(npx syncpack list | grep "$SCOPE_TO_LINK/" | cut -d' ' -f3 | sort | uniq)

# Check if all packages have the same version
if [ "1" != "$(echo "$KIE_TOOLING_CORE_VERSION" | wc -l | tr -d ' ')" ]; then
  echo "Not all packages have the same version" &&
  npx syncpack list | grep "$SCOPE_TO_LINK/" &&
  exit 1
fi

echo "Packages of scope $SCOPE_TO_LINK have version $KIE_TOOLING_CORE_VERSION on $LINK_TARGET_DIR"
cd - || exit


# Remove carat from version
EXACT_KIE_TOOLING_CORE_VERSION=$(echo "$KIE_TOOLING_CORE_VERSION" | sed -r 's/[\^]//g')

# Update version to the same one used on $LINK_TARGET_DIR
yarn update-version-to "$EXACT_KIE_TOOLING_CORE_VERSION"

# Pack the packages to be linked
lerna exec 'yarn pack' --stream --no-private

# Install those packages on $LINK_TARGET_DIR
npm --prefix "$LINK_TARGET_DIR" install ./packages/*/*.tgz --no-save --package-lock=false

# Erase the tarballs generated during the process
rm ./packages/*/*.tgz

# Restore the original version of the linked packages
yarn update-version-to "$ORIGINAL_VERSION"

