#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Building project..."
npm run build


echo "🔥 Deploying to Firebase..."
npx firebase deploy

echo "✅ Deployment complete!"
