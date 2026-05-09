import { assets, benefits, categories, products } from '../data/shop.js';
import { benefitCard, categoryCard, productCard } from '../components/cards.js';

export const homePage = () => {
  const featuredProducts = products.slice(0, 8);

  return `
    <section class="hero-shell reveal relative overflow-hidden rounded-lg bg-veloura-blush shadow-soft">
      <img
        class="absolute inset-0 h-full w-full object-cover object-center"
        src="${assets.heroMixer}"
        alt="Пастельно-рожевий планетарний міксер із капкейками"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/92 via-white/52 to-white/0"></div>
      <div class="relative flex min-h-[390px] max-w-xl flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
        <p class="mb-4 text-sm font-bold uppercase text-veloura-berry">Veloura collection</p>
        <h1 class="max-w-[540px] text-4xl font-extrabold leading-tight text-veloura-ink sm:text-5xl">
          Професійна техніка для ваших солодких шедеврів
        </h1>
        <p class="mt-5 max-w-md text-base leading-7 text-veloura-muted">
          Обирайте міксери, форми, інвентар та інгредієнти для домашньої і професійної кондитерської кухні.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            class="inline-flex h-12 items-center justify-center rounded-md bg-veloura-rose px-7 text-sm font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-veloura-berry"
            href="#/catalog"
          >
            Перейти до каталогу
          </a>
          <a class="inline-flex h-12 items-center justify-center rounded-md px-4 text-sm font-bold text-veloura-ink transition hover:bg-white/70" href="#/product/veloura-artisan-48">
            Дивитись міксер
          </a>
        </div>
        <div class="mt-10 flex items-center gap-2" aria-label="Слайдер промо">
          <button class="h-2.5 w-6 rounded-full bg-veloura-lilac" type="button" aria-label="Слайд 1"></button>
          <button class="h-2.5 w-2.5 rounded-full bg-white/80" type="button" aria-label="Слайд 2"></button>
          <button class="h-2.5 w-2.5 rounded-full bg-white/80" type="button" aria-label="Слайд 3"></button>
        </div>
      </div>
    </section>

    <section class="grid gap-3 py-8 sm:grid-cols-2 xl:grid-cols-4">
      ${benefits.map(benefitCard).join('')}
    </section>

    <section class="py-4">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-veloura-berry">Каталог Veloura</p>
          <h2 class="mt-1 text-2xl font-extrabold text-veloura-ink">Популярні категорії</h2>
        </div>
        <a class="hidden text-sm font-bold text-veloura-lilac transition hover:text-veloura-berry sm:block" href="#/catalog">
          Дивитись усі
        </a>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        ${categories.map(categoryCard).join('')}
      </div>
    </section>

    <section class="py-9">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-veloura-berry">Обрано кондитерами</p>
          <h2 class="mt-1 text-2xl font-extrabold text-veloura-ink">Хіти тижня</h2>
        </div>
        <a class="rounded-md border border-veloura-line px-4 py-2 text-sm font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry" href="#/catalog?category=new">
          Новинки
        </a>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        ${featuredProducts.map(productCard).join('')}
      </div>
    </section>
  `;
};
