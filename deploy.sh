#!/bin/bash

# Hearts4Horses Deployment Script for AWS Lightsail
# This script automates the deployment process on Ubuntu 22.04

set -e  # Exit on any error

echo "🐎 Starting Hearts4Horses deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
print_status "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install NGINX
print_status "Installing NGINX..."
sudo apt install -y nginx

# Install PM2
print_status "Installing PM2..."
sudo npm install -g pm2

# Install Certbot for SSL
print_status "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p /var/www/hearts4horses
sudo chown $USER:$USER /var/www/hearts4horses

# Clone repository (you'll need to update this URL)
print_status "Cloning repository..."
cd /var/www/hearts4horses
# git clone <your-repository-url> .

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build applications
print_status "Building applications..."
npm run build

# Set up environment files
print_status "Setting up environment files..."
if [ ! -f apps/api/.env ]; then
    cp apps/api/env.example apps/api/.env
    print_warning "Please edit apps/api/.env with your actual configuration"
fi

if [ ! -f apps/web/.env.local ]; then
    cp apps/web/.env.example apps/web/.env.local
    print_warning "Please edit apps/web/.env.local with your actual configuration"
fi

# Set up database
print_status "Setting up database..."
npm run db:generate
npm run db:migrate
npm run db:seed

# Start applications with PM2
print_status "Starting applications with PM2..."

# Start API
cd apps/api
pm2 start "npm run start" --name hearts-api -- --port 4000

# Start Web
cd ../web
pm2 start "npm run start" --name hearts-web -- --port 3000

# Save PM2 configuration
pm2 save
pm2 startup

# Configure NGINX
print_status "Configuring NGINX..."
sudo tee /etc/nginx/sites-available/hearts4horses > /dev/null <<EOF
server {
    listen 80;
    server_name hearts4horses.com www.hearts4horses.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 80;
    server_name api.hearts4horses.com;

    client_max_body_size 25M;
    
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/hearts4horses /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test NGINX configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx

print_status "Deployment completed successfully!"
print_status "Your applications are now running:"
print_status "- Frontend: http://localhost:3000"
print_status "- Backend: http://localhost:4000"
print_status "- PM2 Status: pm2 status"
print_status "- NGINX Status: sudo systemctl status nginx"

print_warning "Next steps:"
print_warning "1. Update your DNS to point hearts4horses.com to this server's IP"
print_warning "2. Edit environment files with your actual configuration"
print_warning "3. Run SSL certificate setup:"
print_warning "   sudo certbot --nginx -d hearts4horses.com -d www.hearts4horses.com"
print_warning "   sudo certbot --nginx -d api.hearts4horses.com"

print_status "🐎 Hearts4Horses is ready to ride!"
