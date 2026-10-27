#!/usr/bin/env bash
# ==============================================================================
# WedInvites Production Deployment Script
# Target: Ubuntu KVM2 VPS (/var/www/wedinvites)
# ==============================================================================

set -euo pipefail

# Ensure NVM and Node binaries are in PATH for non-interactive shells
export NVM_DIR="${HOME}/.nvm"
if [ -s "${NVM_DIR}/nvm.sh" ]; then
  # shellcheck source=/dev/null
  \. "${NVM_DIR}/nvm.sh"
fi

main() {
  APP_DIR="/var/www/wedinvites"
  LOG_DIR="/var/log/wedinvites"

  echo "=================================================="
  echo "🚀 Starting WedInvites Deployment: $(date)"
  echo "=================================================="

  # Ensure log directory exists (created during initial setup, no sudo required)
  mkdir -p "${LOG_DIR}" 2>/dev/null || true

  cd "${APP_DIR}"

  echo "📥 1. Pulling latest code from origin/main..."
  git fetch origin main
  git reset --hard origin/main

  echo "📦 2. Installing dependencies..."
  npm ci --prefer-offline --no-audit

  echo "🗄️ 3. Generating Prisma Client and syncing database..."
  npx prisma generate
  npx prisma db push

  echo "🏗️ 4. Building Next.js production bundle..."
  NODE_OPTIONS="--max-old-space-size=2048" npm run build

  echo "🔄 5. Reloading PM2 with zero downtime..."
  if pm2 describe wedinvites > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js --update-env
  else
    pm2 start ecosystem.config.js
  fi

  pm2 save

  echo "🩺 6. Verifying application health..."
  sleep 3
  if curl -s -f http://127.0.0.1:3000 > /dev/null; then
    echo "✅ Application health check passed! WedInvites is live on http://127.0.0.1:3000"
  else
    echo "⚠️ Warning: Local health check did not return HTTP 200. Check 'pm2 logs wedinvites'"
  fi

  echo "=================================================="
  echo "🎉 Deployment successfully completed: $(date)"
  echo "=================================================="
}

main "$@"
