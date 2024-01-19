#!/bin/bash
set -euo pipefail

ARTIFACTS_DIR=web-ext-artifacts

main() {
    local version versioned_xpi_file status_code

    mkdir -p "$ARTIFACTS_DIR"
    version=$(grep '"version"' dist/manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
    versioned_xpi_file=s_marks-$version.xpi
    status_code=$(download_xpi "$versioned_xpi_file")
    
    case "$status_code" in
    200) echo "Version $version already signed. Skipping signing" ;;
    404) sign_and_download "$versioned_xpi_file" ;;
    *) 
        echo "Error checking existing version: $status_code"
        exit 1 
        ;;
    esac

    generate_update_manifest "$versioned_xpi_file" "$version"
}

download_xpi() {
    curl --silent -o "$ARTIFACTS_DIR/$1" -w '%{http_code}' "https://smarks.apps.anasta.si/$1"
}

sign_and_download() {
    web-ext sign --use-submission-api --channel unlisted --disable-progress-bar
    mv -v "$(find "$ARTIFACTS_DIR" -mindepth 1 -name "*.xpi" | head -n 1)" "$ARTIFACTS_DIR/$1"
}

generate_update_manifest() {
    local file version hash

    file=$1
    version=$2
    hash=$(sha256sum "$ARTIFACTS_DIR/$file" | awk '{print $1}')

    cat <<EOF >"$ARTIFACTS_DIR/updates.json" 
{
"addons": {
    "smarks@apps.anasta.si": {
    "updates": [
        {
        "version": "$version",
        "update_link": "https://smarks.apps.anasta.si/$file",
        "update_hash": "sha256:$hash"
        }
    ]
    }
}
}
EOF
}

main
