# P10 Demo — React + Express Monorepo
## Web Advanced Development — Product Catalog

```
p10-monorepo/
├── backend/      ← Express + Prisma (port 3000)
├── frontend/     ← React + Vite (port 5173)
└── package.json  ← root scripts
```

## Quick Start

```bash
# 1. Install semua dependencies
npm run install:all

# 2. Setup backend
cp backend/.env.example backend/.env
# Edit backend/.env → isi DATABASE_URL

# 3. Migrate & seed database
npm run db:migrate
npm run db:seed

# 4. Jalankan keduanya (terminal terpisah)
npm run dev:be    # terminal 1 → http://localhost:3000
npm run dev:fe    # terminal 2 → http://localhost:5173
```

## Endpoints Backend

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /categories | List semua kategori |
| GET | /products | List semua produk + kategori |
| POST | /products | Tambah produk baru |
| PUT | /products/:id | Update produk |
| DELETE | /products/:id | Hapus produk |
