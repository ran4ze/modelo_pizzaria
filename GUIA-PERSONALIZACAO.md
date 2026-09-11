# Guia de personalização — Fatia & Fogo

## 1. Marca, contato e textos

Abra `app/site-data.ts`. O objeto `siteConfig` concentra os dados que normalmente mudam de um cliente para outro:

```ts
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
};
```

- Em `whatsapp`, informe DDI + DDD + número, somente dígitos. Exemplo fictício: `5511999999999`.
- `whatsappLabel` é apenas o texto legível mostrado no rodapé.
- `instagramUrl` precisa receber a URL completa do perfil.
- `hero`, `footerDescription` e `seo` controlam a comunicação da página.

Enquanto `whatsapp` estiver vazio, os botões abrem o compartilhamento genérico do WhatsApp sem direcionar o usuário para um número desconhecido.

## 2. Cardápio e preços

O array `products`, em `app/site-data.ts`, representa o cardápio:

```ts
{
  id: 1,
  name: "Margherita da Casa",
  description: "Molho de tomate, mozzarella, manjericão e azeite.",
  price: 44.9,
  category: "tradicionais",
  featured: true,
  badge: "Clássica",
  image: "/images/pizza-margherita.png",
}
```

- `id` deve ser único.
- `price` é numérico; use `44.9`, não `"R$ 44,90"`.
- `category` precisa existir no array `categories`.
- `image` é opcional. Sem ela, o produto usa o card editorial compacto.
- `badge` e `featured` são opcionais.

O objeto `customPizza` controla tamanhos, sabores e bordas disponíveis no montador. O preço final é o valor do tamanho somado ao adicional da borda.

## 3. Imagens e favicon

As três imagens demonstrativas estão em `public/images`:

| Arquivo | Uso |
| --- | --- |
| `pizza-margherita.webp` | Hero, card e montador |
| `pizza-calabresa.webp` | Hero e card |
| `pizza-chocolate.webp` | Hero e card doce |
| `pizza-frango-cremoso.webp` | Card e montador |
| `pizza-portuguesa.webp` | Card e montador |
| `pizza-quatro-queijos.webp` | Montador |
| `pizza-banana-canela.webp` | Card doce |
| `fritas-classicas.webp` | Card de fritas clássicas |
| `fritas-cheddar.webp` | Card de fritas com cheddar |
| `coxinhas.webp` | Cards de porções de coxinha |
| `refrigerante-cola.webp` | Card de refrigerante |

As imagens têm fundo transparente e enquadramento superior. Para substituí-las sem editar o React, mantenha os nomes e use imagens quadradas, centralizadas e preferencialmente otimizadas em WebP ou AVIF.

O favicon vetorial está em `public/favicon.svg` e é referenciado por `app/layout.tsx`.

## 4. Animação das pizzas

O componente `PizzaDisc`, em `app/page.tsx`, reconstrói visualmente cada pizza com oito máscaras de fatia. Três fatias se afastam do centro:

- desktop: abre ao passar o mouse e fecha ao retirar;
- toque: um toque abre e o próximo fecha;
- teclado: Enter ou Espaço alterna o estado;
- movimento reduzido: a duração e o deslocamento são removidos.

Para mudar a distância, ajuste o valor `25` nesta linha:

```ts
const distance = expanded && highlighted && !reduceMotion ? 25 : 0;
```

Para escolher outras três fatias, altere os índices desta condição:

```ts
const highlighted = index === 7 || index === 0 || index === 1;
```

GSAP cuida da expansão e dos reveals. Lenis fornece a rolagem suave; a integração usa um único ciclo de animação e atualiza o ScrollTrigger sem criar dois `requestAnimationFrame` concorrentes.

No montador, cada item de `customPizza.flavors` contém `id`, `label` e `image`. A imagem da primeira seleção ocupa a metade esquerda; a segunda ocupa a metade direita. O componente `BuilderPizzaHalf` usa GSAP para fazer a troca com escala, desfoque e opacidade suaves.

## 5. Carrinho e navegação

- `Adicionar` inclui o item e vira um controle de quantidade.
- O montador adiciona uma linha única para cada combinação.
- O carrinho permite aumentar, diminuir ou remover produtos.
- Com carrinho vazio, `Ver cardápio` fecha o painel e leva à seção correta.
- No mobile, a barra inferior leva ao cardápio quando vazia e abre o pedido quando há itens.
- O botão final abre o WhatsApp com itens, quantidades, detalhes, subtotal e forma de recebimento.

## 6. Cores, tipografia e responsividade

As variáveis principais ficam no início de `app/globals.css`: `--ink`, `--tomato`, `--gold`, `--olive`, `--cream` e `--paper`.

O layout tem ajustes específicos em 1000 px, 820 px e 650 px. Antes de publicar, confira ao menos 320, 375, 768, 1024 e 1440 px. Preserve áreas de toque, foco visível e a regra `prefers-reduced-motion`.

## 7. Rodar e validar

```bash
npm install
npm run dev
```

Antes do deploy:

```bash
npm run lint
npm test
```

Também confirme telefone, perfil social, endereço, horário, valores, taxa de entrega e disponibilidade dos sabores com o negócio.
