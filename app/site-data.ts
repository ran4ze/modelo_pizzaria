export type Category = "tradicionais" | "doces" | "porcoes" | "bebidas";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  featured?: boolean;
  badge?: string;
  image?: string;
};

// Conteúdo demonstrativo: substitua os dados abaixo antes de publicar para um cliente.
export const siteConfig = {
  brandPrimary: "FATIA",
  brandSecondary: "& FOGO",
  fullName: "Fatia & Fogo",
  whatsapp: "",
  whatsappLabel: "(00) 00000-0000",
  instagramLabel: "@fatiaefogo",
  instagramUrl: "https://www.instagram.com/",
  location: "Delivery e retirada",
  address: "Personalize com seu endereço",
  city: "Sua cidade",
  schedule: "Terça a domingo · 18h às 23h",
  hero: {
    eyebrow: "PIZZA, DO NOSSO JEITO",
    title: "Massa leve.",
    accent: "Sabor sem atalho.",
    description:
      "Tradicionais, doces e combinações montadas por você. Escolha, adicione ao pedido e envie tudo pelo WhatsApp.",
  },
  footerDescription:
    "Um modelo de cardápio digital para pizzarias, lanchonetes e negócios gastronômicos.",
  seo: {
    title: "Fatia & Fogo | Pizzaria artesanal",
    description:
      "Escolha pizzas tradicionais, monte seu próprio sabor e peça acompanhamentos em poucos passos.",
  },
};

export const products: Product[] = [
  {
    id: 1,
    name: "Margherita da Casa",
    description: "Molho de tomate, mozzarella, manjericão e azeite.",
    price: 44.9,
    category: "tradicionais",
    featured: true,
    badge: "Clássica",
    image: "/images/pizza-margherita.webp",
  },
  {
    id: 2,
    name: "Calabresa Artesanal",
    description: "Mozzarella, calabresa, cebola roxa e orégano.",
    price: 46.9,
    category: "tradicionais",
    featured: true,
    badge: "Mais pedida",
    image: "/images/pizza-calabresa.webp",
  },
  {
    id: 3,
    name: "Frango Cremoso",
    description: "Frango temperado, queijo cremoso, milho e mozzarella.",
    price: 49.9,
    category: "tradicionais",
    image: "/images/pizza-frango-cremoso.webp",
  },
  {
    id: 4,
    name: "Portuguesa",
    description: "Presunto, ovos, cebola, azeitona, mozzarella e orégano.",
    price: 52.9,
    category: "tradicionais",
    image: "/images/pizza-portuguesa.webp",
  },
  {
    id: 5,
    name: "Chocolate & Morango",
    description: "Chocolate cremoso, morangos e raspas de chocolate.",
    price: 47.9,
    category: "doces",
    featured: true,
    badge: "Para dividir",
    image: "/images/pizza-chocolate.webp",
  },
  {
    id: 6,
    name: "Banana com Canela",
    description: "Banana, açúcar, canela e um toque de leite condensado.",
    price: 42.9,
    category: "doces",
    image: "/images/pizza-banana-canela.webp",
  },
  {
    id: 7,
    name: "Fritas Clássicas",
    description: "Batatas crocantes com sal e molho da casa.",
    price: 18.9,
    category: "porcoes",
    image: "/images/fritas-classicas.webp",
  },
  {
    id: 8,
    name: "Fritas com Cheddar",
    description: "Batatas, cheddar cremoso, bacon e cebolinha.",
    price: 26.9,
    category: "porcoes",
    badge: "Boa pedida",
    image: "/images/fritas-cheddar.webp",
  },
  {
    id: 9,
    name: "Coxinhas · 6 unidades",
    description: "Massa leve, recheio cremoso e casquinha crocante.",
    price: 19.9,
    category: "porcoes",
    image: "/images/coxinhas.webp",
  },
  {
    id: 10,
    name: "Coxinhas · 12 unidades",
    description: "Porção para compartilhar, servida com molho da casa.",
    price: 34.9,
    category: "porcoes",
    image: "/images/coxinhas.webp",
  },
  {
    id: 11,
    name: "Refrigerante · 1 litro",
    description: "Consulte os sabores disponíveis no atendimento.",
    price: 12,
    category: "bebidas",
    image: "/images/refrigerante-cola.webp",
  },
];

export const categories: { id: "todos" | Category; label: string }[] = [
  { id: "todos", label: "Tudo" },
  { id: "tradicionais", label: "Pizzas tradicionais" },
  { id: "doces", label: "Pizzas doces" },
  { id: "porcoes", label: "Fritas e coxinhas" },
  { id: "bebidas", label: "Bebidas" },
];

export const customPizza = {
  sizes: [
    { id: "media", label: "Média · 6 fatias", price: 44.9 },
    { id: "grande", label: "Grande · 8 fatias", price: 57.9 },
  ],
  flavors: [
    { id: "margherita", label: "Margherita", image: "/images/pizza-margherita.webp" },
    { id: "calabresa", label: "Calabresa", image: "/images/pizza-calabresa.webp" },
    { id: "frango-cremoso", label: "Frango cremoso", image: "/images/pizza-frango-cremoso.webp" },
    { id: "portuguesa", label: "Portuguesa", image: "/images/pizza-portuguesa.webp" },
    { id: "quatro-queijos", label: "Quatro queijos", image: "/images/pizza-quatro-queijos.webp" },
  ],
  borders: [
    { id: "sem-borda", label: "Sem borda recheada", price: 0 },
    { id: "catupiry", label: "Borda de queijo cremoso", price: 8 },
    { id: "cheddar", label: "Borda de cheddar", price: 8 },
  ],
};
