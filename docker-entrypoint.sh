#!/bin/sh
set -e

# Sync database schema on container startup without regenerating client
echo "==> Sinkronisasi database Prisma..."
prisma db push --skip-generate --accept-data-loss

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
