#!/bin/sh
set -e

# Import feeds to mongo
node importFeeds.js

# After import completes, start the main app
exec node src/index.js
