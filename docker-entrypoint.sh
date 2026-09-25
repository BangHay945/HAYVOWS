#!/bin/sh
set -e

# Sync database schema on container startup
echo "==> Sinkronisasi database Prisma..."
npx prisma db push --accept-data-loss

echo "==> Menjalankan Hayvows di port ${PORT:-3000}..."
exec node server.js
