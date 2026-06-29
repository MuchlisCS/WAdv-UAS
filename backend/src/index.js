// backend/src/index.js
// P10 Demo — Product Catalog API
// Express + Prisma + CORS (wajib untuk diakses dari React frontend)

const express = require("express");
const cors    = require("cors");
const { PrismaClient } = require("@prisma/client");

const app    = express();
const prisma = new PrismaClient();
const PORT   = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());          // izinkan request dari frontend (localhost:5173)
app.use(express.json());

// ════════════════════════════════════════════════════════════
//  CATEGORIES
// ════════════════════════════════════════════════════════════

// GET /categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ════════════════════════════════════════════════════════════
//  PRODUCTS
// ════════════════════════════════════════════════════════════

// GET /products
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /products/:id
app.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "id harus angka" });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /products
app.post("/products", async (req, res) => {
  try {
    const { name, price, stock, categoryId, imageUrl } = req.body;

    if (!name || price === undefined || !categoryId)
      return res.status(400).json({ error: "name, price, dan categoryId wajib diisi" });
    if (price < 0)
      return res.status(400).json({ error: "price tidak boleh negatif" });

    const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
    if (!category) return res.status(404).json({ error: "Category tidak ditemukan" });

    const product = await prisma.product.create({
      data: { name: name.trim(), price, stock: stock ?? 0, categoryId: parseInt(categoryId), imageUrl: imageUrl || null },
      include: { category: true },
    });
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /products/:id
app.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "id harus angka" });

    const { name, price, stock, categoryId } = req.body;
    if (name === undefined && price === undefined && stock === undefined && categoryId === undefined)
      return res.status(400).json({ error: "Kirim minimal satu field" });

    const data = {};
    if (name       !== undefined) data.name       = name.trim();
    if (price      !== undefined) data.price      = price;
    if (stock      !== undefined) data.stock      = stock;
    if (categoryId !== undefined) data.categoryId = parseInt(categoryId);

    const product = await prisma.product.update({
      where: { id }, data,
      include: { category: true },
    });
    res.json(product);
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.status(500).json({ error: e.message });
  }
});

// DELETE /products/:id
app.delete("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "id harus angka" });

    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.status(500).json({ error: e.message });
  }
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend running  →  http://localhost:${PORT}`);
  console.log(`   GET    /categories`);
  console.log(`   GET    /products`);
  console.log(`   POST   /products`);
  console.log(`   PUT    /products/:id`);
  console.log(`   DELETE /products/:id`);
});
