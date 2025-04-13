#!/bin/bash

# Define paths
PROJECT_DIR="/var/www/4P02-course-project"
FRONTEND_DIR="$PROJECT_DIR/wishify"
BACKEND_DIR="$PROJECT_DIR/backend"

# Step 1: Pull the latest changes from GitHub
echo "Pulling latest changes from GitHub..."
cd $PROJECT_DIR || exit
git reset --hard origin/main
git pull origin main
chmod 770 deploy.sh
chmod 770 backend/pytest/run_API_Tests.sh

# Step 2: Install dependencies & build frontend
echo "Installing frontend dependencies..."
cd $FRONTEND_DIR || exit
npm install
npm run build

echo "creating sym link..."
ln -s /var/www/4P02-course-project/backend/uploads /var/www/4P02-course-project/wishify/dist/uploads

# Step 3: Install backend dependencies
echo "Installing backend dependencies..."
cd $BACKEND_DIR || exit
npm install

# Step 4: Restart the backend API with PM2 (might change to reload instead of restart)
echo "Restarting wishify-api..."
pm2 reload wishify-api || pm2 restart wishify-api  

# Step 5: Reload Nginx (since static files are updated)
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Deployment completed successfully!"
