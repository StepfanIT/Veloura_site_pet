import { categories, navigationItems, products } from '../data/shop.js';
import { emptyState, productCard } from '../components/cards.js';
import { formatCurrency } from '../lib/format.js';
import { icon } from '../lib/icons.js';
import { searchProducts } from '../lib/products.js';

const sortLabels = {
  popular: 'Популярні',
  'price-asc': 'Спочатку дешевші',
  'price-desc': 'Спочатку дорожчі'
};

const allBrands = [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b, 'uk'));
const minCatalogPrice = Math.min(...products.map((product) => product.price));
const maxCatalogPrice = Math.max(...products.map((product) => product.price));

const getCategoryTitle = (slug) =>
  slug === 'all'
    ? 'Каталог товарів'
    :
  categories.find((category) => category.slug === slug)?.title ??
  navigationItems.find((item) => item.slug === slug)?.label ??
  'Каталог';

const getCategoryProducts = (slug) => {
  if (!slug || slug === 'all') {
    return products;
  }

  if (slug === 'new') {
    return products.filter((product) => product.badge === 'New');
  }

  if (slug === 'sale') {
    return products.filter((product) => product.oldPrice);
  }

  return slug ? products.filter((product) => product.categorySlug === slug) : products;
};

const sortProducts = (items, sort) => {
  if (sort === 'price-asc') {
    return [...items].sort((a, b) => a.price - b.price);
  }

  if (sort === 'price-desc') {
    return [...items].sort((a, b) => b.price - a.price);
  }

  return [...items].sort((a, b) => b.reviews - a.reviews);
};

const clampPrice = (value, fallback) => {
  if (value === '' || value === null || value === undefined) {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

const filterProducts = (items, filters) => {
  const minPrice = clampPrice(filters.minPrice, minCatalogPrice);
  const maxPrice = clampPrice(filters.maxPrice, maxCatalogPrice);
  const low = Math.min(minPrice, maxPrice);
  const high = Math.max(minPrice, maxPrice);
  const selectedBrands = new Set(filters.brands ?? []);

  return items.filter((product) => {
    const inPrice = product.price >= low && product.price <= high;
    const inBrand = !selectedBrands.size || selectedBrands.has(product.brand);
    return inPrice && inBrand;
  });
};

const countByCategory = (slug, filters, search) => {
  const categoryProducts = getCategoryProducts(slug);
  const searched = searchProducts(
    search,
    search && slug !== 'all' ? products.filter((product) => product.categorySlug === slug) : categoryProducts
  );
  return filterProducts(searched, { ...filters, brands: filters.brands }).length;
};

const brandCount = (brand, source, filters) =>
  filterProducts(source, { ...filters, brands: [] }).filter((product) => product.brand === brand).length;

const activeFilterChips = ({ filters, category, search }) => {
  const chips = [];

  if (search) {
    chips.push(['Пошук', search]);
  }

  if (category && category !== 'all') {
    chips.push(['Категорія', getCategoryTitle(category)]);
  }

  if (filters.minPrice !== '' || filters.maxPrice !== '') {
    chips.push([
      'Ціна',
      `${filters.minPrice || minCatalogPrice} - ${filters.maxPrice || maxCatalogPrice} грн`
    ]);
  }

  (filters.brands ?? []).forEach((brand) => chips.push(['Бренд', brand]));

  if (!chips.length) {
    return '';
  }

  return `
    <div class="mb-4 flex flex-wrap items-center gap-2">
      ${chips
        .map(
          ([label, value]) => `
            <span class="inline-flex h-9 items-center rounded-full bg-rose-50 px-3 text-xs font-bold text-veloura-berry">
              ${label}: ${value}
            </span>
          `
        )
        .join('')}
      <button class="inline-flex h-9 items-center rounded-full border border-veloura-line px-3 text-xs font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry" type="button" data-clear-filters>
        Очистити
      </button>
    </div>
  `;
};

export const catalogPage = ({ category = 'all', search = '', sort = 'popular', filters = {} } = {}) => {
  const normalizedFilters = {
    minPrice: filters.minPrice ?? '',
    maxPrice: filters.maxPrice ?? '',
    brands: filters.brands ?? []
  };
  const source = getCategoryProducts(category);
  const searchedProducts = searchProducts(search, source);
  const filteredProducts = filterProducts(searchedProducts, normalizedFilters);
  const visibleProducts = sortProducts(filteredProducts, sort);
  const title = search ? `Пошук: ${search}` : getCategoryTitle(category);
  const minPrice = normalizedFilters.minPrice || '';
  const maxPrice = normalizedFilters.maxPrice || '';
  const priceLow = clampPrice(minPrice, minCatalogPrice);
  const priceHigh = clampPrice(maxPrice, maxCatalogPrice);
  const progressStart = Math.max(0, ((Math.min(priceLow, priceHigh) - minCatalogPrice) / (maxCatalogPrice - minCatalogPrice)) * 100);
  const progressEnd = Math.min(100, ((Math.max(priceLow, priceHigh) - minCatalogPrice) / (maxCatalogPrice - minCatalogPrice)) * 100);

  return `
    <section class="page-enter">
      <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <nav class="mb-3 flex items-center gap-2 text-xs font-semibold text-veloura-muted">
            <a class="transition hover:text-veloura-berry" href="#/">Головна</a>
            <span>/</span>
            <span>Каталог</span>
          </nav>
          <h1 class="text-3xl font-extrabold text-veloura-ink">${title}</h1>
          <p class="mt-2 text-sm text-veloura-muted">
            Знайдено ${visibleProducts.length} з ${searchedProducts.length} товарів. Фільтри застосовуються до ціни, бренду, категорії та пошуку.
          </p>
        </div>
        <div class="custom-select relative w-full sm:w-auto" data-sort-select>
          <button
            class="inline-flex h-11 w-full items-center justify-between gap-4 rounded-md border border-veloura-line bg-white px-4 text-sm font-semibold text-veloura-muted transition hover:border-veloura-rose sm:min-w-[250px]"
            type="button"
            data-sort-trigger
            aria-expanded="false"
          >
            <span>Сортування: <span class="text-veloura-ink" data-sort-label>${sortLabels[sort]}</span></span>
            ${icon('chevron-down', 'h-4 w-4 text-veloura-muted')}
          </button>
          <div
            class="custom-select-menu absolute right-0 top-[calc(100%+8px)] z-30 hidden w-full overflow-hidden rounded-md border border-veloura-line bg-white p-1 shadow-card sm:w-[250px]"
            data-sort-menu
          >
            ${Object.entries(sortLabels)
              .map(
                ([value, label]) => `
                  <button
                    class="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-semibold transition ${
                      value === sort ? 'bg-rose-50 text-veloura-berry' : 'text-veloura-muted hover:bg-rose-50 hover:text-veloura-berry'
                    }"
                    type="button"
                    data-sort-value="${value}"
                  >
                    ${label}
                    ${value === sort ? icon('check', 'h-4 w-4') : ''}
                  </button>
                `
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]">
        <aside class="reveal rounded-md border border-veloura-line bg-white p-5">
          <div class="mb-5 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-sm font-extrabold text-veloura-ink">
              ${icon('sliders', 'h-5 w-5 text-veloura-rose')}
              Фільтр
            </div>
            <button class="text-xs font-extrabold text-veloura-lilac transition hover:text-veloura-berry" type="button" data-clear-filters>
              Скинути
            </button>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="mb-3 text-xs font-extrabold uppercase text-veloura-muted">Категорія</h3>
              <div class="space-y-1">
                <a class="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                  category === 'all' ? 'bg-rose-50 text-veloura-berry' : 'text-veloura-muted hover:bg-rose-50 hover:text-veloura-berry'
                }" href="#/catalog" data-filter-category="all">
                  <span>Всі товари</span>
                  <span class="text-xs">${filterProducts(searchProducts(search, products), normalizedFilters).length}</span>
                </a>
                ${categories
                  .map((item) => {
                    const count = countByCategory(item.slug, normalizedFilters, search);
                    return `
                      <a class="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                        item.slug === category ? 'bg-rose-50 text-veloura-berry' : 'text-veloura-muted hover:bg-rose-50 hover:text-veloura-berry'
                      }" href="#/catalog?category=${item.slug}" data-filter-category="${item.slug}">
                        <span>${item.title}</span>
                        <span class="text-xs">${count}</span>
                      </a>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <div>
              <div class="mb-3 flex items-center justify-between gap-3">
                <h3 class="text-xs font-extrabold uppercase text-veloura-muted">Ціна</h3>
                <span class="text-[11px] font-bold text-slate-400">${formatCurrency(minCatalogPrice)} - ${formatCurrency(maxCatalogPrice)}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <label>
                  <span class="sr-only">Мінімальна ціна</span>
                  <input
                    class="h-11 w-full rounded-md border border-veloura-line px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-veloura-rose focus:ring-4 focus:ring-rose-100"
                    inputmode="numeric"
                    min="${minCatalogPrice}"
                    max="${maxCatalogPrice}"
                    placeholder="від ${minCatalogPrice}"
                    value="${minPrice}"
                    data-price-min
                  />
                </label>
                <label>
                  <span class="sr-only">Максимальна ціна</span>
                  <input
                    class="h-11 w-full rounded-md border border-veloura-line px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-veloura-rose focus:ring-4 focus:ring-rose-100"
                    inputmode="numeric"
                    min="${minCatalogPrice}"
                    max="${maxCatalogPrice}"
                    placeholder="до ${maxCatalogPrice}"
                    value="${maxPrice}"
                    data-price-max
                  />
                </label>
              </div>
              <div class="relative mt-4 h-1.5 rounded-full bg-rose-100">
                <span
                  class="absolute h-full rounded-full bg-veloura-rose"
                  style="left:${progressStart}%; right:${100 - progressEnd}%"
                ></span>
              </div>
              <button class="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md bg-veloura-rose text-sm font-bold text-white transition hover:bg-veloura-berry" type="button" data-apply-price>
                Застосувати ціну
              </button>
            </div>

            <div>
              <h3 class="mb-3 text-xs font-extrabold uppercase text-veloura-muted">Бренди</h3>
              <div class="space-y-2">
                ${allBrands
                  .map((brand) => {
                    const count = brandCount(brand, searchedProducts, normalizedFilters);
                    const checked = normalizedFilters.brands.includes(brand);
                    return `
                      <label class="filter-check flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 text-sm font-semibold transition hover:bg-rose-50">
                        <span class="flex min-w-0 items-center gap-2 text-veloura-muted">
                          <input class="accent-veloura-rose" type="checkbox" value="${brand}" data-brand-filter ${checked ? 'checked' : ''} />
                          <span class="truncate">${brand}</span>
                        </span>
                        <span class="text-xs font-bold text-slate-400">${count}</span>
                      </label>
                    `;
                  })
                  .join('')}
              </div>
            </div>
          </div>
        </aside>

        <div class="min-w-0">
          <div class="mb-4 flex gap-2 overflow-x-auto pb-1">
            <a class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
              category === 'all' ? 'border-veloura-rose bg-rose-50 text-veloura-berry' : 'border-veloura-line text-veloura-muted hover:border-veloura-rose hover:text-veloura-berry'
            }" href="#/catalog">
              Всі товари
            </a>
            ${categories
              .slice(0, 6)
              .map(
                (item) => `
                  <a class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                    item.slug === category ? 'border-veloura-rose bg-rose-50 text-veloura-berry' : 'border-veloura-line text-veloura-muted hover:border-veloura-rose hover:text-veloura-berry'
                  }" href="#/catalog?category=${item.slug}">
                    ${item.title}
                  </a>
                `
              )
              .join('')}
          </div>

          ${activeFilterChips({ filters: normalizedFilters, category, search })}

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" data-catalog-grid>
            ${
              visibleProducts.length
                ? visibleProducts.map(productCard).join('')
                : emptyState('Нічого не знайшли', 'Спробуйте скинути бренд або розширити ціновий діапазон.')
            }
          </div>
        </div>
      </div>
    </section>
  `;
};
