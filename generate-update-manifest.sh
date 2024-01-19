#!/bin/bash
xpi_file_path=$(find web-ext-artifacts -mindepth 1 -name "*.xpi" | head -n 1)
hash=$(sha256sum "$xpi_file_path" | awk '{print $1}')

xpi_file_name=$(basename "$xpi_file_path" .xpi)
version=${xpi_file_name##*-}

cat <<EOF >web-ext-artifacts/updates.json 
{
  "addons": {
    "smarks@apps.anasta.si": {
      "updates": [
        {
          "version": "$version",
          "update_link": "https://smarks.apps.anasta.si/$xpi_file_name.xpi",
          "update_hash": "sha256:$hash"
        }
      ]
    }
  }
}
EOF