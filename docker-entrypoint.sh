#!/bin/sh
set -e

# Salin schema Prisma terbaru dari build image ke direktori volume /app/prisma
if [ -f "./prisma_schema/schema.prisma" ]; then
  echo "==> Sinkronisasi file schema Prisma terbaru..."
  cp -f ./prisma_schema/schema.prisma ./prisma/schema.prisma 2>/dev/null || true
fi

# Sync database schema on container startup without regenerating client
echo "==> Sinkronisasi database Prisma..."
prisma db push --skip-generate --accept-data-loss || true

# Auto seed database jika seed.js tersedia
if [ -f "./seed.js" ]; then
  echo "==> Menjalankan database seed..."
  node ./seed.js || true
elif [ -f "./prisma/seed.js" ]; then
  echo "==> Menjalankan database seed..."
  node ./prisma/seed.js || true
fi

echo "==> Menjalankan Hayvows di port ${PORT:-3000}..."
exec node server.js
