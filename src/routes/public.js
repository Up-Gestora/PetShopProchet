const express = require("express");
const { db } = require("../db");

const router = express.Router();

function parseImages(imagesJson) {
  try {
    const parsed = JSON.parse(imagesJson || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function productUnitPrice(product) {
  return product.promo_price && product.promo_price > 0 ? product.promo_price : product.price;
}

function getAllProductsWithCategory() {
  return db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.pet_type IN ('Cachorro', 'Gato')`
    )
    .all()
    .map((product) => ({
      ...product,
      images: parseImages(product.images_json),
      unitPrice: productUnitPrice(product),
    }));
}

function applyProductFilters(products, query) {
  const q = (query.q || "").trim().toLowerCase();
  const category = (query.category || "").trim().toLowerCase();
  const brand = (query.brand || "").trim().toLowerCase();
  const petType = (query.petType || "").trim().toLowerCase();
  const petAge = (query.petAge || "").trim().toLowerCase();
  const petSize = (query.petSize || "").trim().toLowerCase();
  const rating = Number(query.rating || 0);
  const promo = query.promo === "1";
  const min = Number(query.min || 0);
  const max = Number(query.max || 999999);
  const sort = query.sort || "launch";

  const filtered = products.filter((product) => {
    const text = `${product.name} ${product.description} ${product.brand || ""}`.toLowerCase();
    const price = product.unitPrice;

    return (
      (!q || text.includes(q)) &&
      (!category || product.category_slug.toLowerCase() === category) &&
      (!brand || (product.brand || "").toLowerCase() === brand) &&
      (!petType || (product.pet_type || "").toLowerCase() === petType) &&
      (!petAge || (product.pet_age || "").toLowerCase() === petAge) &&
      (!petSize || (product.pet_size || "").toLowerCase() === petSize) &&
      (!rating || Number(product.rating) >= rating) &&
      (!promo || Number(product.promo_price || 0) > 0) &&
      price >= min &&
      price <= max
    );
  });

  if (sort === "price_asc") filtered.sort((a, b) => a.unitPrice - b.unitPrice);
  if (sort === "price_desc") filtered.sort((a, b) => b.unitPrice - a.unitPrice);
  if (sort === "best_sellers") filtered.sort((a, b) => b.stock - a.stock);
  if (sort === "top_rated") filtered.sort((a, b) => b.rating - a.rating);
  if (sort === "launch") filtered.sort((a, b) => b.id - a.id);

  return filtered;
}

router.get("/api/search/suggestions", (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const rows = db
    .prepare(
      `SELECT id, name, slug
       FROM products
       WHERE (name LIKE ? OR description LIKE ?)
         AND pet_type IN ('Cachorro', 'Gato')
       ORDER BY rating DESC
       LIMIT 8`
    )
    .all(`%${q}%`, `%${q}%`);

  return res.json(rows);
});

router.get("/", (req, res) => {
  const featuredProducts = db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.is_featured = 1
         AND p.pet_type IN ('Cachorro', 'Gato')
       ORDER BY p.rating DESC
       LIMIT 8`
    )
    .all()
    .map((item) => ({
      ...item,
      images: parseImages(item.images_json),
      unitPrice: productUnitPrice(item),
    }));

  res.render("home", {
    title: "Pet Shop Prochet - Cuidado profissional para cães e gatos",
    featuredProducts,
  });
});

router.get("/produtos", (req, res) => {
  const allProducts = getAllProductsWithCategory();
  const filteredProducts = applyProductFilters(allProducts, req.query);

  const brands = [...new Set(allProducts.map((item) => item.brand).filter(Boolean))].sort();
  const petTypes = [...new Set(allProducts.map((item) => item.pet_type).filter(Boolean))].sort();
  const petAges = [...new Set(allProducts.map((item) => item.pet_age).filter(Boolean))].sort();
  const petSizes = [...new Set(allProducts.map((item) => item.pet_size).filter(Boolean))].sort();

  res.render("products", {
    title: "Catálogo de produtos",
    products: filteredProducts,
    options: { brands, petTypes, petAges, petSizes },
    filters: req.query,
  });
});

router.get("/produtos/:slug", (req, res) => {
  const product = db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ?
         AND p.pet_type IN ('Cachorro', 'Gato')`
    )
    .get(req.params.slug);

  if (!product) {
    return res.status(404).render("error", {
      title: "Produto não encontrado",
      statusCode: 404,
      message: "O produto que você tentou acessar não existe.",
      error: null,
    });
  }

  const variants = db.prepare("SELECT * FROM product_variants WHERE product_id = ?").all(product.id);
  const reviews = db
    .prepare(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ?
       ORDER BY r.id DESC`
    )
    .all(product.id);

  const related = db
    .prepare(
      `SELECT * FROM products
       WHERE category_id = ?
         AND id <> ?
         AND pet_type IN ('Cachorro', 'Gato')
       ORDER BY rating DESC
       LIMIT 4`
    )
    .all(product.category_id, product.id)
    .map((item) => ({
      ...item,
      images: parseImages(item.images_json),
      unitPrice: productUnitPrice(item),
    }));

  res.render("product-detail", {
    title: product.name,
    product: {
      ...product,
      images: parseImages(product.images_json),
      unitPrice: productUnitPrice(product),
    },
    variants,
    related,
    reviews,
  });
});

module.exports = router;
