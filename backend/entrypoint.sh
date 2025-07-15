#!/bin/sh
set -e

# Start importFeeds.js asynchronously (in background)
node importFeeds.js &

# Start main app immediately
exec node src/index.js
