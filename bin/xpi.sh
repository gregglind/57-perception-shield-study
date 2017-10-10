#!/usr/bin/env bash

## Things that will happen.
#
# Create addon/{install.rdf,chrome.manifest} from templates,
#   using data from package.json
# Move all files in 'addon/' to a tmp dir
# Create dist/{$XPI_NAME,linked-addon.xpi}


echo "$@"

set -eu
#set -o xtrace

BASE_DIR="$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")"
TMP_DIR="$(mktemp -d)"
DEST="${TMP_DIR}/addon"
ADDON_VERSION=$(node -p -e "require('./package.json').addon.version");
ADDON_ID=$(node -p -e "require('./package.json').addon.id")
XPI_NAME="${ADDON_ID}-${ADDON_VERSION}".xpi

mkdir -p "${DEST}"

# deletes the temp directory, TRAPPED so it runs on exit
function cleanup {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

# fill templates, could be fancier
mustache='./node_modules/.bin/mustache'
echo 'Filling mustache template files...'
$mustache package.json templates/install.rdf.mustache > addon/install.rdf
$mustache package.json templates/chrome.manifest.mustache > addon/chrome.manifest

echo 'Copying all files in `addon/` into the xpi...'

cp -rp addon/* "${DEST}"

echo 'Zipping files into the XPI (addon)...'

pushd "${DEST}" > /dev/null
zip -r "${DEST}"/"${XPI_NAME}" *
mkdir -p "${BASE_DIR}"/dist

echo 'emptying dist...'
rm -rf "${BASE_DIR}"/dist/*
echo 'Moving the XPI to dist...'
mv "${XPI_NAME}" "${BASE_DIR}"/dist

# also link 'addon.xpi' to it.
cd "${BASE_DIR}"/dist
rm -f linked-addon.xpi
ln -s "${XPI_NAME}" linked-addon.xpi

echo
echo "SUCCESS: xpi at ${BASE_DIR}/dist/${XPI_NAME}"
echo "SUCCESS: symlinked xpi at ${BASE_DIR}/dist/linked-addon.xpi"

ls -alF "${BASE_DIR}"/dist
popd > /dev/null

