#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Always deploy to this app's project, regardless of any per-directory `firebase use` state
PROJECT="gen-lang-client-0330602361"

echo "🚀 Building project..."
npm run build


echo "🔥 Deploying to Firebase ($PROJECT)..."
# `npx firebase` resolves to the `firebase` client SDK in node_modules, which has no CLI binary,
# so use the installed CLI, or fetch firebase-tools if it's missing.
if command -v firebase >/dev/null 2>&1; then
  firebase deploy --project "$PROJECT"
else
  npx --yes firebase-tools deploy --project "$PROJECT"
fi

echo "✅ Deployment complete!"
