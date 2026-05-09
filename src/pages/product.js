import { products } from '../data/shop.js';
import { productCard } from '../components/cards.js';
import { formatCurrency } from '../lib/format.js';
import { icon } from '../lib/icons.js';
import { findProduct } from '../lib/products.js';

const colorNames = {
  '#111111': 'Чорний',
  '#222222': 'Графіт',
  '#c62538': 'Червоний',
  '#f3b8c4': 'Пудровий рожевий',
  '#b9dfd0': 'Мʼятний',
  '#d8d8d8': 'Сріблястий',
  '#eeeeee': 'Білий',
  '#514039': 'Какао',
  '#f64f83': 'Рожевий',
  '#8f74d7': 'Лавандовий',
  '#cfe9dd': 'Ніжна мʼята',
  '#caa46d': 'Крафт',
  '#ffffff': 'Білий'
};

const colorLabel = (color, index) => colorNames[color.toLowerCase()] ?? `Варіант ${index + 1}`;

export const productPage = (slug) => {
  const product = findProduct(slug);
  const related = products.filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug).slice(0, 4);
  const defaultColorIndex = Math.max(0, product.colors.findIndex((color) => color.toLowerCase() === '#f3b8c4'));
  const selectedColor = product.colors[defaultColorIndex] ?? product.colors[0];
  const gallery = [
    product.imagePosition,
    product.categorySlug === 'equipment' ? '65% 50%' : product.imagePosition,
    product.categorySlug === 'equipment' ? '82% 64%' : product.imagePosition
  ];

  return `
    <section class="page-enter">
      <nav class="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-veloura-muted">
        <a class="transition hover:text-veloura-berry" href="#/">Головна</a>
        <span>/</span>
        <a class="transition hover:text-veloura-berry" href="#/catalog?category=${product.categorySlug}">${product.category}</a>
        <span>/</span>
        <span>${product.shortTitle}</span>
      </nav>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(380px,0.8fr)]">
        <div class="grid gap-4 md:grid-cols-[76px_minmax(0,1fr)]">
          <div class="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
            ${gallery
              .map(
                (position, index) => `
                  <button
                    class="gallery-thumb grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-md border ${index === 0 ? 'border-veloura-rose' : 'border-veloura-line'} bg-rose-50 transition hover:border-veloura-rose"
                    type="button"
                    data-gallery-position="${position}"
                    aria-label="Фото товару ${index + 1}"
                  >
                    <img class="h-full w-full object-cover" src="${product.image}" style="object-position:${position}" alt="" />
                  </button>
                `
              )
              .join('')}
          </div>
          <div class="product-image-stage order-1 relative overflow-hidden rounded-md border border-veloura-line bg-white md:order-2">
            <img
              class="product-main-image h-[430px] w-full bg-rose-50 object-cover transition duration-500 md:h-[560px]"
              src="${product.image}"
              style="object-position:${product.imagePosition}"
              alt="${product.title}"
              data-product-main-image
            />
            <span
              class="product-color-tint"
              style="background:${selectedColor}; opacity:${selectedColor.toLowerCase() === '#ffffff' ? '0.08' : '0.24'}"
              data-product-color-tint
            ></span>
          </div>
        </div>

        <div class="reveal">
          <div class="rounded-md border border-veloura-line bg-white p-5 lg:p-7">
            <div class="mb-4 flex flex-wrap items-center gap-3">
              <span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-veloura-berry">${product.stock}</span>
              <span class="text-xs font-semibold text-veloura-muted">Код товару: ${product.sku}</span>
            </div>
            <h1 class="text-3xl font-extrabold leading-tight text-veloura-ink">${product.title}</h1>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <span class="flex items-center gap-1 text-sm font-bold text-amber-500">
                ${Array.from({ length: 5 }).map(() => icon('star', 'h-4 w-4 fill-current')).join('')}
              </span>
              <span class="text-sm font-semibold text-veloura-muted">(${product.reviews} відгуків)</span>
            </div>

            <div class="mt-6 flex flex-wrap items-baseline gap-3">
              <span class="text-3xl font-extrabold text-veloura-ink">${formatCurrency(product.price)}</span>
              ${product.oldPrice ? `<span class="text-base font-semibold text-slate-400 line-through">${formatCurrency(product.oldPrice)}</span>` : ''}
            </div>
            ${product.oldPrice ? `<p class="mt-1 text-sm font-bold text-veloura-rose">Економія ${formatCurrency(product.oldPrice - product.price)}</p>` : ''}

            <div class="mt-6">
              <p class="mb-3 text-sm font-extrabold text-veloura-ink">Колір: <span class="text-veloura-muted" data-color-label>${colorLabel(selectedColor, defaultColorIndex)}</span></p>
              <div class="flex flex-wrap gap-2">
                ${product.colors
                  .map(
                    (color, index) => `
                      <button
                        class="color-swatch h-10 w-10 rounded-md border ${index === defaultColorIndex ? 'is-selected border-veloura-rose ring-4 ring-rose-100' : 'border-veloura-line'}"
                        type="button"
                        style="background:${color}"
                        data-color-swatch
                        data-color-value="${color}"
                        data-color-label="${colorLabel(color, index)}"
                        aria-label="${colorLabel(color, index)}"
                      ></button>
                    `
                  )
                  .join('')}
              </div>
            </div>

            <div class="mt-7 grid gap-3 sm:grid-cols-[112px_minmax(0,1fr)_52px]">
              <div class="inline-flex h-12 items-center rounded-md border border-veloura-line">
                <button class="grid h-12 w-10 place-items-center text-veloura-muted" type="button" data-product-qty="dec">${icon('minus', 'h-4 w-4')}</button>
                <span class="w-8 text-center text-sm font-bold" data-product-qty-value>1</span>
                <button class="grid h-12 w-10 place-items-center text-veloura-muted" type="button" data-product-qty="inc">${icon('plus', 'h-4 w-4')}</button>
              </div>
              <button
                class="inline-flex h-12 items-center justify-center rounded-md bg-veloura-rose px-6 text-sm font-bold text-white transition hover:bg-veloura-berry"
                type="button"
                data-add-to-cart
                data-product="${product.slug}"
                data-with-qty
              >
                Додати в кошик
              </button>
              <button
                class="grid h-12 place-items-center rounded-md border border-veloura-line text-veloura-berry transition hover:bg-rose-50"
                type="button"
                aria-label="Додати в обране"
                data-favorite
                data-product="${product.slug}"
              >
                ${icon('heart')}
              </button>
            </div>
            <button
              class="mt-3 inline-flex h-12 w-full items-center justify-center rounded-md bg-veloura-lilac text-sm font-bold text-white transition hover:bg-[#7b62c5]"
              type="button"
              data-open-cart
              data-add-to-cart
              data-product="${product.slug}"
              data-with-qty
            >
              Купити в один клік
            </button>
          </div>

          <div class="mt-5 rounded-md border border-veloura-line bg-white p-5">
            <div class="flex gap-6 overflow-x-auto border-b border-veloura-line text-sm font-bold">
              <button class="product-tab is-active shrink-0 border-b-2 border-veloura-rose pb-3 text-veloura-ink" type="button" data-product-tab="description">Опис</button>
              <button class="product-tab shrink-0 border-b-2 border-transparent pb-3 text-veloura-muted" type="button" data-product-tab="specs">Характеристики</button>
              <button class="product-tab shrink-0 border-b-2 border-transparent pb-3 text-veloura-muted" type="button" data-product-tab="delivery">Доставка та оплата</button>
            </div>
            <div class="product-panel mt-5" data-product-panel="description">
              <p class="text-sm leading-7 text-veloura-muted">${product.description}</p>
              <ul class="mt-4 space-y-2 text-sm text-veloura-muted">
                ${product.details.map((detail) => `<li class="flex gap-2"><span class="text-veloura-rose">•</span>${detail}</li>`).join('')}
              </ul>
            </div>
            <div class="product-panel mt-5 hidden" data-product-panel="specs">
              <dl class="grid gap-3 sm:grid-cols-2">
                ${product.specs
                  .map(
                    ([name, value]) => `
                      <div class="rounded-md bg-slate-50 px-4 py-3">
                        <dt class="text-xs font-bold text-veloura-muted">${name}</dt>
                        <dd class="mt-1 text-sm font-extrabold text-veloura-ink">${value}</dd>
                      </div>
                    `
                  )
                  .join('')}
              </dl>
            </div>
            <div class="product-panel mt-5 hidden" data-product-panel="delivery">
              <div class="grid gap-3 sm:grid-cols-3">
                ${[
                  ['truck', 'Нова Пошта', 'від 70 грн'],
                  ['map-pin', 'Укрпошта', 'від 50 грн'],
                  ['credit', 'Оплата', 'карткою або післяплата']
                ]
                  .map(
                    ([itemIcon, title, text]) => `
                      <div class="rounded-md border border-veloura-line p-4">
                        <span class="text-veloura-rose">${icon(itemIcon)}</span>
                        <h3 class="mt-3 text-sm font-extrabold text-veloura-ink">${title}</h3>
                        <p class="mt-1 text-xs leading-5 text-veloura-muted">${text}</p>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-10">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-veloura-berry">Може сподобатись</p>
            <h2 class="mt-1 text-2xl font-extrabold text-veloura-ink">Схожі товари</h2>
          </div>
          <a class="text-sm font-bold text-veloura-lilac transition hover:text-veloura-berry" href="#/catalog?category=${product.categorySlug}">Усі в категорії</a>
        </div>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          ${related.map(productCard).join('')}
        </div>
      </section>
    </section>
  `;
};
