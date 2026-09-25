#!/bin/sh
set -e

# Sync database schema on container startup using locked Prisma 6
echo "==> Sinkronisasi database Prisma..."
prisma db push --accept-data-loss

echo "==> Menjalankan Hayvows di port ${PORT:-3000}..."
exec node server.js
