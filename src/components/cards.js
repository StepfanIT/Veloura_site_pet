import { icon } from '../lib/icons.js';
import { formatCurrency } from '../lib/format.js';
import { assets } from '../data/shop.js';

export const categoryCard = (category, index = 0) => `
  <a
    class="reveal group block overflow-hidden rounded-md border border-veloura-line bg-white transition duration-300 hover:-translate-y-1 hover:border-rose-100 hover:shadow-card"
    href="#/catalog?category=${category.slug}"
    style="--reveal-delay: ${index * 55}ms"
  >
    <div
      class="category-thumb"
      style="--thumb-image: url('${assets.categoryStrip}'); --thumb-position: ${category.thumbPosition};"
      role="img"
      aria-label="${category.title}"
    ></div>
    <div class="px-4 py-4">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-sm font-extrabold text-veloura-ink">${category.title}</h3>
        <span class="text-xs font-bold text-veloura-lilac">${category.count}</span>
      </div>
      <p class="mt-1 text-xs leading-5 text-veloura-muted">${category.text}</p>
    </div>
  </a>
`;

export const benefitCard = (item, index = 0) => `
  <article
    class="reveal flex items-center gap-4 rounded-md border border-veloura-line bg-white px-4 py-4"
    style="--reveal-delay: ${index * 65}ms"
  >
    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-rose-50 text-veloura-rose">
      ${icon(item.icon)}
    </span>
    <div>
      <h3 class="text-sm font-extrabold text-veloura-ink">${item.title}</h3>
      <p class="mt-1 text-xs leading-5 text-veloura-muted">${item.text}</p>
    </div>
  </article>
`;

export const productCard = (product, index = 0) => `
  <article
    class="reveal product-card group overflow-hidden rounded-md border border-veloura-line bg-white transition duration-300 hover:-translate-y-1 hover:border-rose-100 hover:shadow-card"
    style="--reveal-delay: ${index * 60}ms"
  >
    <div class="relative h-56 overflow-hidden bg-rose-50">
      <a class="block h-full" href="#/product/${product.slug}">
        <img
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src="${product.image}"
          style="object-position: ${product.imagePosition};"
          alt="${product.title}"
        />
      </a>
      <span class="absolute left-3 top-3 rounded-md bg-veloura-rose px-3 py-1 text-xs font-extrabold text-white">${product.badge}</span>
      <button
        class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-veloura-berry shadow-card transition hover:bg-rose-50"
        type="button"
        aria-label="Додати в обране"
        data-favorite
        data-product="${product.slug}"
      >
        ${icon('heart', 'h-4 w-4')}
      </button>
    </div>
    <div class="p-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs font-semibold text-veloura-muted">${product.category}</p>
        <span class="flex items-center gap-1 text-xs font-bold text-amber-500">${icon('star', 'h-3.5 w-3.5')} ${product.rating}</span>
      </div>
      <a class="mt-2 block min-h-[44px] text-sm font-extrabold leading-5 text-veloura-ink transition hover:text-veloura-berry" href="#/product/${product.slug}">
        ${product.shortTitle}
      </a>
      <div class="mt-4 flex items-baseline gap-2">
        <span class="text-base font-extrabold text-veloura-ink">${formatCurrency(product.price)}</span>
        ${product.oldPrice ? `<span class="text-xs font-semibold text-slate-400 line-through">${formatCurrency(product.oldPrice)}</span>` : ''}
      </div>
      <div class="mt-4 flex gap-2">
        <button
          class="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-veloura-rose text-sm font-bold text-white transition hover:bg-veloura-berry"
          type="button"
          data-add-to-cart
          data-product="${product.slug}"
        >
          Додати в кошик
        </button>
        <a
          class="grid h-11 w-11 place-items-center rounded-md border border-veloura-line text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry"
          href="#/product/${product.slug}"
          aria-label="Детальніше"
        >
          ${icon('chevron-right')}
        </a>
      </div>
    </div>
  </article>
`;

export const emptyState = (title, text = 'Спробуйте змінити пошук або фільтр.') => `
  <div class="col-span-full rounded-md border border-dashed border-veloura-line bg-rose-50/40 px-5 py-10 text-center">
    <h3 class="text-base font-extrabold text-veloura-ink">${title}</h3>
    <p class="mt-2 text-sm text-veloura-muted">${text}</p>
  </div>
`;
