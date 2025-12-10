#!/bin/bash

# Script de Deploy Cloudflare - macOS/Linux
# Uso: chmod +x deploy.sh && ./deploy.sh

set -e  # Exit on error

echo "🚀 Iniciando deploy para Cloudflare..."
echo ""

# Step 1: Build
echo -e "\033[34m📦 Construindo aplicação...\033[0m"
npm run build:cloudflare
echo -e "\033[32m✅ Build concluído!\033[0m"
echo ""

# Step 2: Deploy Worker (Backend)
echo -e "\033[34m🔧 Fazendo deploy do Worker (Backend)...\033[0m"
wrangler deploy
echo -e "\033[32m✅ Worker deployado!\033[0m"
echo ""

# Step 3: Deploy Pages (Frontend)
# Temporary rename wrangler.toml to avoid conflicts
echo -e "\033[34m🎨 Fazendo deploy do Pages (Frontend)...\033[0m"
echo -e "\033[33mAguarde... (este passo pode levar alguns minutos)\033[0m"

# Backup the main config
if [ -f "wrangler.toml" ]; then
    mv wrangler.toml wrangler.toml.bak
fi

# Deploy
wrangler pages deploy dist/spa --project-name barreiro360

# Restore the config
if [ -f "wrangler.toml.bak" ]; then
    mv wrangler.toml.bak wrangler.toml
fi

echo -e "\033[32m✅ Pages deployado!\033[0m"
echo ""

echo -e "\033[32m🎉 Deploy completado com sucesso!\033[0m"
echo ""
echo -e "\033[36mURLs:\033[0m"
echo -e "\033[36m  Frontend:  https://barreiro360.pages.dev\033[0m"
echo -e "\033[36m  Backend:   https://barreiro360-api.workers.dev\033[0m"
echo -e "\033[36m  API:       https://barreiro360-api.workers.dev/api/\033[0m"
echo ""
