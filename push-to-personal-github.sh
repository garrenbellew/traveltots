#!/bin/bash

echo "🚀 Pushing to GitHub (garrenbellew/traveltots)"
echo ""
echo "You'll be prompted for credentials:"
echo "  Username: garrenbellew"
echo "  Password: [Use your Personal Access Token]"
echo ""
echo "Don't have a token? Get one at: https://github.com/settings/tokens"
echo ""
echo "Starting push..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://vercel.com/new"
    echo "2. Click 'Add New' → 'Project'"
    echo "3. Search for 'traveltots'"
    echo "4. Click 'Import'"
    echo "5. Add Environment Variables:"
    echo "   - DATABASE_URL = file:./prisma/dev.db"
    echo "   - NODE_ENV = production"
    echo "6. Click 'Deploy'"
else
    echo ""
    echo "❌ Push failed. Please check your credentials."
fi
