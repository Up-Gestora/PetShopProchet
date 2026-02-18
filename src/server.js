const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { db, initDb } = require("./db");
const { runSeed } = require("./seed");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

initDb();

const hasSeed = db.prepare("SELECT COUNT(*) AS count FROM products").get().count > 0;
if (!hasSeed) {
  runSeed();
}

// Regra de negócio atual: somente cães e gatos.
db.prepare("DELETE FROM products WHERE pet_type NOT IN ('Cachorro', 'Gato')").run();
db.prepare("DELETE FROM pets WHERE species NOT IN ('Cachorro', 'Gato')").run();
db.prepare(
  `DELETE FROM categories
   WHERE id NOT IN (
     SELECT DISTINCT category_id FROM products
   )`
).run();

// Dados institucionais atualizados.
db.prepare("UPDATE users SET phone = ? WHERE email = 'admin@prochet.com'").run("(43) 3039-4077");
db.prepare("UPDATE users SET phone = ? WHERE email = 'cliente@prochet.com'").run("(43) 99607-4153");
const seededCustomer = db.prepare("SELECT id FROM users WHERE email = 'cliente@prochet.com'").get();
if (seededCustomer) {
  db.prepare(
    `UPDATE addresses
     SET street = ?, number = ?, district = ?, city = ?, state = ?, zip = ?
     WHERE user_id = ?`
  ).run(
    "Av. Harry Prochet",
    "700",
    "Jardim São Jorge",
    "Londrina",
    "PR",
    "86047040",
    seededCustomer.id
  );
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
  res.locals.flash = null;
  res.locals.currentUser = null;
  res.locals.siteName = "Pet Shop Prochet";
  res.locals.slogan = "Seu animalzinho é a nossa paixão.";
  res.locals.cartCount = 0;
  next();
});

app.use((req, res, next) => {
  const categories = db
    .prepare(
      `SELECT c.*
       FROM categories c
       WHERE EXISTS (
         SELECT 1
         FROM products p
         WHERE p.category_id = c.id
           AND p.pet_type IN ('Cachorro', 'Gato')
       )
       ORDER BY c.name ASC`
    )
    .all();
  res.locals.navCategories = categories;
  next();
});

app.use((req, res, next) => {
  const pathName = String(req.path || "").toLowerCase();

  if (pathName.includes("/agendamento")) {
    return res.redirect(
      "https://wa.me/5543996074153?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20servi%C3%A7o%20para%20meu%20pet."
    );
  }

  if (
    pathName.includes("/carrinho") ||
    pathName.includes("/checkout") ||
    pathName.includes("/assinaturas")
  ) {
    return res.redirect("/produtos");
  }

  return next();
});

app.use("/", require("./routes/public"));

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Página não encontrada",
    statusCode: 404,
    message: "A página que você tentou acessar não existe.",
    error: null,
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error", {
    title: "Erro interno",
    statusCode: 500,
    message: "Ocorreu um erro interno.",
    error,
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Pet Shop Prochet no ar: http://localhost:${port}`);
  });
}

module.exports = app;
