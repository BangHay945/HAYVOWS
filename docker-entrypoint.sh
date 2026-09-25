#!/bin/sh
set -e

# Sync database schema on container startup without regenerating client
echo "==> Sinkronisasi database Prisma..."
prisma db push --skip-generate --accept-data-loss

echo "==> Menjalankan Hayvows di port ${PORT:-3000}..."
exec node server.js
