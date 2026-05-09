import { assets, benefits, categories, products } from '../data/shop.js';
import { benefitCard, categoryCard, productCard } from '../components/cards.js';

const heroSlides = [
  {
    eyebrow: 'Veloura collection',
    title: 'Професійна техніка для ваших солодких шедеврів',
    text: 'Обирайте міксери, форми, інвентар та інгредієнти для домашньої і професійної кондитерської кухні.',
    image: assets.heroMixer,
    imagePosition: '68% center',
    accent: 'primary',
    alt: 'Пастельно-рожевий планетарний міксер із капкейками',
    primaryLabel: 'Перейти до каталогу',
    primaryHref: '#/catalog',
    secondaryLabel: 'Дивитись міксер',
    secondaryHref: '#/product/veloura-artisan-48'
  },
  {
    eyebrow: 'Новинки сезону',
    title: 'Форми, декор і насадки для акуратної подачі',
    text: 'Зберіть робочий набір для капкейків, тортів, макаронс і десертних боксів в одному каталозі.',
    image: assets.categoryStrip,
    imagePosition: '58% center',
    accent: 'strip',
    alt: 'Кондитерський інвентар, форми та десерти у пастельній палітрі',
    primaryLabel: 'Дивитись новинки',
    primaryHref: '#/catalog?category=new',
    secondaryLabel: 'Форми для випічки',
    secondaryHref: '#/catalog?category=molds'
  },
  {
    eyebrow: 'Для майстерні',
    title: 'Інгредієнти та інвентар для стабільного результату',
    text: 'Підберіть базу для щоденної роботи: шоколад, борошно, шпателі, мішки та пакування.',
    image: assets.categoryStrip,
    imagePosition: '24% center',
    accent: 'strip',
    alt: 'Інгредієнти та кондитерський інвентар для професійної кухні',
    primaryLabel: 'Обрати інгредієнти',
    primaryHref: '#/catalog?category=ingredients',
    secondaryLabel: 'Інвентар',
    secondaryHref: '#/catalog?category=tools'
  }
];

export const homePage = () => {
  const featuredProducts = products.slice(0, 8);
  const heroMarkup = heroSlides
    .map(
      (slide, index) => `
        <article
          class="hero-slide absolute inset-0 ${index === 0 ? 'is-active' : ''}"
          data-hero-slide="${index}"
          data-hero-accent="${slide.accent}"
          aria-hidden="${index === 0 ? 'false' : 'true'}"
          ${index === 0 ? '' : 'inert'}
        >
          <img
            class="absolute inset-0 h-full w-full object-cover"
            src="${slide.image}"
            style="object-position: ${slide.imagePosition};"
            alt="${slide.alt}"
          />
          <div class="hero-overlay absolute inset-0"></div>
          <div class="hero-copy relative z-10 flex min-h-[560px] w-full max-w-[22rem] flex-col justify-center px-6 pb-24 pt-10 sm:min-h-[430px] sm:max-w-xl sm:px-10 sm:pb-24 lg:min-h-[500px] lg:px-16">
            <p class="mb-4 text-sm font-bold uppercase text-veloura-berry">${slide.eyebrow}</p>
            <h1 class="max-w-[18rem] break-words text-3xl font-extrabold leading-tight text-veloura-ink sm:max-w-[540px] sm:text-5xl">
              ${slide.title}
            </h1>
            <p class="mt-5 max-w-md text-base leading-7 text-veloura-muted">
              ${slide.text}
            </p>
            <div class="mt-8 flex flex-wrap items-center gap-3">
              <a
                class="inline-flex h-12 items-center justify-center rounded-md bg-veloura-rose px-7 text-sm font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-veloura-berry"
                href="${slide.primaryHref}"
              >
                ${slide.primaryLabel}
              </a>
              <a class="inline-flex h-12 items-center justify-center rounded-md px-4 text-sm font-bold text-veloura-ink transition hover:bg-white/70" href="${slide.secondaryHref}">
                ${slide.secondaryLabel}
              </a>
            </div>
            <div class="hero-dots mt-8 flex items-center gap-2" aria-label="Слайдер промо">
              ${heroSlides
                .map(
                  (_, dotIndex) => `
                    <button
                      class="hero-dot ${dotIndex === index ? 'is-active' : ''}"
                      type="button"
                      data-hero-dot="${dotIndex}"
                      aria-label="Слайд ${dotIndex + 1}"
                      ${dotIndex === index ? 'aria-current="true"' : ''}
                    ></button>
                  `
                )
                .join('')}
            </div>
          </div>
        </article>
      `
    )
    .join('');

  return `
    <section class="hero-shell relative overflow-hidden rounded-lg bg-veloura-blush shadow-soft" data-hero-carousel>
      <div class="relative min-h-[560px] sm:min-h-[430px] lg:min-h-[500px]" data-hero-track>
        ${heroMarkup}
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
