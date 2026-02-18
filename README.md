# Pet Shop Prochet

Site institucional e catálogo para pet shop, com foco em cachorros e gatos, atendimento via WhatsApp e retirada de produtos na loja.

## Stack

- Node.js + Express + EJS
- SQLite (`better-sqlite3`)
- CSS custom responsivo (mobile-first)

## Funcionalidades implementadas

- Catálogo com categorias, variações, estoque, avaliações e produtos relacionados.
- Busca inteligente com autocomplete e filtros avançados.
- Compra online desativada: produtos com consulta via WhatsApp e retirada na loja.
- Agendamento e contato direto via WhatsApp.
- Atendimento exclusivo para cachorros e gatos.
- Botão flutuante do WhatsApp com ícone.
- SEO básico (meta tags), seções LGPD e estrutura pronta para SSL em produção.

## Executar

```bash
npm install
npm run seed
npm run dev
```

Acesse: `http://localhost:3000`

## Contato da loja

- Endereço: `Av. Harry Prochet, 700 - Jardim São Jorge, Londrina - PR, 86047-040`
- WhatsApp: `(43) 99607-4153`
- Telefone: `(43) 3039-4077`
- Instagram: `https://www.instagram.com/pet_prochet/`

## Estrutura

- `src/server.js` - bootstrap da aplicação
- `src/db.js` - schema e helpers do banco
- `src/routes/public.js` - rotas públicas + endpoint de autocomplete
- `views/` - templates EJS
- `public/` - CSS e assets estáticos
- `data/petshop.db` - banco SQLite local
