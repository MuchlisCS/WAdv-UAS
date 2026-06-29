// backend/prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const electronics = await prisma.category.create({ data: { name: "Electronics" } });
  const fashion     = await prisma.category.create({ data: { name: "Fashion" } });
  const food        = await prisma.category.create({ data: { name: "Food & Beverage" } });

  await prisma.product.createMany({
    data: [
      { name: "iPhone 15 Pro",        price: 19999000, stock: 25, categoryId: electronics.id },
      { name: "Samsung Galaxy S24",   price: 14999000, stock: 30, categoryId: electronics.id },
      { name: "MacBook Air M3",       price: 21999000, stock: 10, categoryId: electronics.id },
      { name: "Xiaomi Redmi Note 13", price:  2999000, stock: 5,  categoryId: electronics.id },
      { name: "Kemeja Oxford Putih",  price:   299000, stock: 50, categoryId: fashion.id },
      { name: "Celana Chino Navy",    price:   349000, stock: 40, categoryId: fashion.id },
      { name: "Sepatu Sneakers",      price:   599000, stock: 8,  categoryId: fashion.id },
      { name: "Kopi Arabika 250g",    price:    89000, stock: 200, categoryId: food.id },
      { name: "Granola Bar Coklat",   price:    45000, stock: 3,  categoryId: food.id },
    ],
  });

  console.log("✅ Seed selesai! 3 kategori, 9 produk.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
