#!/bin/bash

# Push to GitHub Script
# This script will push the Travel Tots code to GitHub

echo "Ready to push to GitHub!"
echo ""
echo "You'll be prompted for your GitHub credentials:"
echo "  - Username: gbellew_sfemu"
echo "  - Password: Use a Personal Access Token (not your GitHub password)"
echo ""
echo "To create a token: https://github.com/settings/tokens"
echo "Select 'repo' permissions"
echo ""
echo "Starting push..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo "Your code is now at: https://github.com/gbellew_sfemu/TravelTots"
else
  echo ""
  echo "❌ Push failed. Please check the error above."
fi

