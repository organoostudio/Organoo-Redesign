#!/bin/sh
# Rebuilds index.html (self-hosted page) from src/. Run: sh build.sh
cd "$(dirname "$0")"
{ printf '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n'; cat src/head.html; printf '\n<script>\n'; cat src/qr.js; printf '\n'; cat src/app.js; printf '\n'; printf '</script>\n</body></html>\n'; } > index.html
echo "built index.html"
