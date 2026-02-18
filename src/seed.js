const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const { db, initDb, nowSql } = require("./db");

initDb();

function seedCategories() {
  const categories = [
    ["Cães", "caes"],
    ["Gatos", "gatos"],
    ["Pássaros", "passaros"],
    ["Peixes", "peixes"],
    ["Roedores", "roedores"],
    ["Farmácia Pet", "farmacia-pet"],
    ["Higiene e Beleza", "higiene-beleza"],
    ["Rações", "racoes"],
    ["Brinquedos", "brinquedos"],
    ["Camas e Acessórios", "camas-acessorios"],
  ];

  const insert = db.prepare(
    "INSERT OR IGNORE INTO categories (name, slug, created_at) VALUES (?, ?, ?)"
  );

  categories.forEach(([name, slug]) => insert.run(name, slug, nowSql()));
}

function categoryIdBySlug(slug) {
  const row = db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug);
  return row ? row.id : null;
}

function seedProducts() {
  const products = [
    {
      name: "Ração Super Premium Cães Adultos",
      slug: "racao-super-premium-caes-adultos",
      categorySlug: "racoes",
      description:
        "Ração balanceada com proteínas nobres e prebióticos para cães adultos de porte médio.",
      brand: "ProPet",
      petType: "Cachorro",
      petAge: "Adulto",
      petSize: "Médio",
      price: 189.9,
      promoPrice: 169.9,
      stock: 44,
      rating: 4.8,
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["peso", "3kg", 0, 22],
        ["peso", "10kg", 120, 12],
        ["sabor", "Frango", 0, 28],
      ],
    },
    {
      name: "Ração Gatos Castrados Salmão",
      slug: "racao-gatos-castrados-salmao",
      categorySlug: "gatos",
      description: "Controle de peso, trato urinário saudável e sabor irresistível de salmão.",
      brand: "FeliCare",
      petType: "Gato",
      petAge: "Adulto",
      petSize: "Pequeno",
      price: 129.9,
      promoPrice: 115.9,
      stock: 35,
      rating: 4.7,
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["peso", "1kg", 0, 20],
        ["peso", "7kg", 90, 15],
      ],
    },
    {
      name: "Areia Higiênica Ultra Absorvente",
      slug: "areia-higienica-ultra-absorvente",
      categorySlug: "higiene-beleza",
      description: "Controle de odor por 30 dias, grãos finos e baixo rastreamento.",
      brand: "CleanPaw",
      petType: "Gato",
      petAge: "Todas",
      petSize: "Todos",
      price: 52.9,
      promoPrice: 44.9,
      stock: 60,
      rating: 4.6,
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["peso", "4kg", 0, 40],
        ["peso", "12kg", 35, 20],
      ],
    },
    {
      name: "Shampoo Hipoalergênico para Pets",
      slug: "shampoo-hipoalergenico-pets",
      categorySlug: "higiene-beleza",
      description: "Limpeza suave, pH equilibrado e fragrância leve para peles sensíveis.",
      brand: "SoftPet",
      petType: "Cachorro",
      petAge: "Todas",
      petSize: "Todos",
      price: 39.9,
      promoPrice: null,
      stock: 52,
      rating: 4.5,
      featured: 0,
      images: [
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["volume", "500ml", 0, 30],
        ["volume", "1L", 18, 22],
      ],
    },
    {
      name: "Brinquedo Mordedor Dental",
      slug: "brinquedo-mordedor-dental",
      categorySlug: "brinquedos",
      description: "Ajuda na limpeza dos dentes e reduz ansiedade em cães de porte pequeno e médio.",
      brand: "PlayBite",
      petType: "Cachorro",
      petAge: "Filhote",
      petSize: "Médio",
      price: 34.9,
      promoPrice: 29.9,
      stock: 70,
      rating: 4.4,
      featured: 0,
      images: [
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["cor", "Laranja", 0, 35],
        ["cor", "Azul", 0, 35],
      ],
    },
    {
      name: "Cama Ortopédica Confort Plus",
      slug: "cama-ortopedica-confort-plus",
      categorySlug: "camas-acessorios",
      description: "Espuma de alta densidade para alívio de pressão e descanso profundo.",
      brand: "NapPet",
      petType: "Cachorro",
      petAge: "Senior",
      petSize: "Grande",
      price: 229.9,
      promoPrice: 199.9,
      stock: 20,
      rating: 4.9,
      featured: 1,
      images: [
        "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["tamanho", "M", 0, 10],
        ["tamanho", "G", 40, 10],
      ],
    },
    {
      name: "Suplemento Articular Pet",
      slug: "suplemento-articular-pet",
      categorySlug: "farmacia-pet",
      description: "Condroitina e glucosamina para suporte de articulações e mobilidade.",
      brand: "VitaPet",
      petType: "Cachorro",
      petAge: "Senior",
      petSize: "Todos",
      price: 89.9,
      promoPrice: 79.9,
      stock: 33,
      rating: 4.5,
      featured: 0,
      images: [
        "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["quantidade", "60 cápsulas", 0, 33],
      ],
    },
    {
      name: "Kit Aquário Inicial 30L",
      slug: "kit-aquario-inicial-30l",
      categorySlug: "peixes",
      description: "Aquário com filtro e iluminação LED ideal para iniciantes.",
      brand: "AquaLife",
      petType: "Peixe",
      petAge: "Todas",
      petSize: "Pequeno",
      price: 349.9,
      promoPrice: 319.9,
      stock: 12,
      rating: 4.3,
      featured: 0,
      images: [
        "https://images.unsplash.com/photo-1520302630591-fd1c66edcb07?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [
        ["cor", "Preto", 0, 6],
        ["cor", "Branco", 0, 6],
      ],
    },
    {
      name: "Ração para Calopsitas Frutas",
      slug: "racao-calopsitas-frutas",
      categorySlug: "passaros",
      description: "Mistura enriquecida com vitaminas e minerais para aves ornamentais.",
      brand: "BirdJoy",
      petType: "Pássaro",
      petAge: "Todas",
      petSize: "Pequeno",
      price: 27.9,
      promoPrice: null,
      stock: 50,
      rating: 4.4,
      featured: 0,
      images: [
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [["peso", "500g", 0, 50]],
    },
    {
      name: "Feno Premium para Coelhos",
      slug: "feno-premium-coelhos",
      categorySlug: "roedores",
      description: "Fibras longas essenciais para digestão e desgaste dental saudável.",
      brand: "RodentCare",
      petType: "Roedor",
      petAge: "Todas",
      petSize: "Pequeno",
      price: 31.5,
      promoPrice: 27.9,
      stock: 41,
      rating: 4.7,
      featured: 0,
      images: [
        "https://images.unsplash.com/photo-1595433707802-4d9e0f4b0af4?auto=format&fit=crop&w=900&q=80",
      ],
      variants: [["peso", "1kg", 0, 41]],
    },
  ];

  const insertProduct = db.prepare(
    `INSERT OR IGNORE INTO products
      (category_id, name, slug, description, brand, pet_type, pet_age, pet_size, price, promo_price, stock, rating, images_json, is_featured, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertVariant = db.prepare(
    `INSERT INTO product_variants (product_id, variant_type, variant_value, extra_price, stock)
     VALUES (?, ?, ?, ?, ?)`
  );

  products.forEach((product) => {
    const categoryId = categoryIdBySlug(product.categorySlug);
    if (!categoryId) {
      return;
    }

    insertProduct.run(
      categoryId,
      product.name,
      product.slug,
      product.description,
      product.brand,
      product.petType,
      product.petAge,
      product.petSize,
      product.price,
      product.promoPrice,
      product.stock,
      product.rating,
      JSON.stringify(product.images),
      product.featured,
      nowSql()
    );

    const dbProduct = db.prepare("SELECT id FROM products WHERE slug = ?").get(product.slug);
    if (!dbProduct) {
      return;
    }

    const variantCount = db
      .prepare("SELECT COUNT(*) as count FROM product_variants WHERE product_id = ?")
      .get(dbProduct.id).count;

    if (variantCount === 0) {
      product.variants.forEach(([variantType, variantValue, extraPrice, stock]) => {
        insertVariant.run(dbProduct.id, variantType, variantValue, extraPrice, stock);
      });
    }
  });
}

function seedUsers() {
  const users = [
    {
      name: "Administrador Prochet",
      email: "admin@prochet.com",
      password: "Admin@123",
      role: "admin",
      phone: "(43) 3039-4077",
    },
    {
      name: "Cliente Exemplo",
      email: "cliente@prochet.com",
      password: "Cliente@123",
      role: "customer",
      phone: "(43) 99607-4153",
    },
  ];

  users.forEach((user) => {
    const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(user.email);
    if (exists) {
      return;
    }
    const hash = bcrypt.hashSync(user.password, 10);
    db.prepare(
      "INSERT INTO users (name, email, password_hash, phone, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(user.name, user.email, hash, user.phone, user.role, nowSql());
  });
}

function seedCustomerProfile() {
  const customer = db.prepare("SELECT * FROM users WHERE email = ?").get("cliente@prochet.com");
  if (!customer) {
    return;
  }

  const hasAddress = db
    .prepare("SELECT COUNT(*) as count FROM addresses WHERE user_id = ?")
    .get(customer.id).count;
  if (!hasAddress) {
    db.prepare(
      `INSERT INTO addresses (user_id, label, street, number, district, city, state, zip, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      customer.id,
      "Casa",
      "Av. Harry Prochet",
      "700",
      "Jardim São Jorge",
      "Londrina",
      "PR",
      "86047040",
      1
    );
  }

  const hasPet = db.prepare("SELECT COUNT(*) as count FROM pets WHERE user_id = ?").get(customer.id)
    .count;

  if (!hasPet) {
    db.prepare(
      `INSERT INTO pets (user_id, name, species, breed, age, weight, photo_url, vaccination_card, service_history, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      customer.id,
      "Thor",
      "Cachorro",
      "Golden Retriever",
      4,
      28.4,
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80",
      "V10, Antirrábica e Giardia em dia",
      "Banho mensal e tosa higiênica a cada 45 dias",
      nowSql()
    );
  }
}

function seedCoupons() {
  const coupons = [
    ["BEMVINDO10", "percent", 10, 99, dayjs().add(180, "day").toISOString()],
    ["PROCHET20", "fixed", 20, 150, dayjs().add(120, "day").toISOString()],
    ["ASSINA15", "percent", 15, 80, dayjs().add(365, "day").toISOString()],
  ];

  const insert = db.prepare(
    `INSERT OR IGNORE INTO coupons (code, discount_type, discount_value, min_total, active, expires_at)
     VALUES (?, ?, ?, ?, 1, ?)`
  );

  coupons.forEach((coupon) => insert.run(...coupon));
}

function seedMarketing() {
  const banners = [
    [
      "Clube de Assinatura Prochet",
      "Economize até 15% em produtos recorrentes para seu pet.",
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=1200&q=80",
      "Assinar agora",
      "/assinaturas",
    ],
    [
      "Banho e Tosa com carinho",
      "Agende online e receba lembretes por WhatsApp.",
      "https://images.unsplash.com/photo-1516734212186-65266f59f7dc?auto=format&fit=crop&w=1200&q=80",
      "Agendar serviço",
      "/agendamento",
    ],
  ];

  const insertBanner = db.prepare(
    `INSERT OR IGNORE INTO banners (title, subtitle, image_url, cta_text, cta_link, active, created_at)
     VALUES (?, ?, ?, ?, ?, 1, ?)`
  );

  banners.forEach((banner) => insertBanner.run(...banner, nowSql()));

  const testimonials = [
    ["Marina Lopes", "Entrega rápida e meu gato adorou a ração nova.", 5, "Mingau"],
    ["Eduardo Lima", "Atendimento no WhatsApp impecável, equipe muito atenciosa.", 5, "Mel"],
    ["Patrícia Nunes", "Assinatura mensal facilita demais minha rotina.", 4, "Nina"],
  ];

  const insertTestimonial = db.prepare(
    `INSERT OR IGNORE INTO testimonials (name, content, rating, pet_name, verified, created_at)
     VALUES (?, ?, ?, ?, 1, ?)`
  );

  testimonials.forEach((testimonial) => insertTestimonial.run(...testimonial, nowSql()));
}

function seedReviews() {
  const customer = db.prepare("SELECT * FROM users WHERE email = ?").get("cliente@prochet.com");
  if (!customer) {
    return;
  }

  const product = db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .get("racao-super-premium-caes-adultos");
  if (!product) {
    return;
  }

  const exists = db
    .prepare("SELECT id FROM reviews WHERE user_id = ? AND product_id = ?")
    .get(customer.id, product.id);

  if (!exists) {
    db.prepare(
      `INSERT INTO reviews (user_id, product_id, rating, comment, photo_url, verified, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?)`
    ).run(
      customer.id,
      product.id,
      5,
      "Meu cachorro se adaptou super bem. Pelagem ficou mais brilhante em poucas semanas.",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      nowSql()
    );
  }
}

function seedSubscriptionsAndAppointments() {
  const customer = db.prepare("SELECT * FROM users WHERE email = ?").get("cliente@prochet.com");
  if (!customer) {
    return;
  }

  const product = db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .get("areia-higienica-ultra-absorvente");

  if (product) {
    const exists = db
      .prepare("SELECT id FROM subscriptions WHERE user_id = ? AND product_id = ?")
      .get(customer.id, product.id);

    if (!exists) {
      db.prepare(
        `INSERT INTO subscriptions (user_id, product_id, frequency_days, status, discount_percent, next_charge_at, created_at)
         VALUES (?, ?, ?, 'active', 12, ?, ?)`
      ).run(customer.id, product.id, 30, dayjs().add(20, "day").toISOString(), nowSql());
    }
  }

  const pet = db.prepare("SELECT * FROM pets WHERE user_id = ? LIMIT 1").get(customer.id);
  if (pet) {
    const hasAppointment = db
      .prepare("SELECT COUNT(*) as count FROM appointments WHERE user_id = ?")
      .get(customer.id).count;

    if (!hasAppointment) {
      db.prepare(
        `INSERT INTO appointments (user_id, pet_id, service_type, appointment_date, appointment_time, status, notes, created_at)
         VALUES (?, ?, ?, ?, ?, 'confirmado', ?, ?)`
      ).run(
        customer.id,
        pet.id,
        "Banho",
        dayjs().add(7, "day").format("YYYY-MM-DD"),
        "10:30",
        "Usar shampoo hipoalergênico",
        nowSql()
      );
    }
  }
}

function runSeed() {
  seedCategories();
  seedProducts();
  seedUsers();
  seedCustomerProfile();
  seedCoupons();
  seedMarketing();
  seedReviews();
  seedSubscriptionsAndAppointments();

  console.log("Seed concluído com sucesso.");
  console.log("Admin: admin@prochet.com / Admin@123");
  console.log("Cliente: cliente@prochet.com / Cliente@123");
}

if (require.main === module) {
  runSeed();
}

module.exports = {
  runSeed,
};

