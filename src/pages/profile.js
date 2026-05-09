import { products } from '../data/shop.js';
import { productCard } from '../components/cards.js';
import { formatCurrency } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const demoOrders = [
  {
    id: '№12345',
    date: '15.05.2026',
    status: 'Доставлено',
    tone: 'green',
    total: 20596,
    items: ['veloura-artisan-48', 'piping-tips-pro-24', 'pink-gel-color'],
    steps: ['Оформлено', 'Оплачено', 'В дорозі', 'Доставлено'],
    activeStep: 3
  },
  {
    id: '№12344',
    date: '10.05.2026',
    status: 'Очікує оплату',
    tone: 'yellow',
    total: 1799,
    items: ['softbake-molds-set', 'kraftbox-dessert-set'],
    steps: ['Оформлено', 'Оплата', 'Комплектація', 'Відправка'],
    activeStep: 1
  },
  {
    id: '№12343',
    date: '05.05.2026',
    status: 'Скасовано',
    tone: 'red',
    total: 699,
    items: ['piping-tips-pro-24'],
    steps: ['Оформлено', 'Скасовано'],
    activeStep: 1
  }
];

const addresses = [
  ['Нова Пошта', 'Київ, відділення №12', 'Основна адреса'],
  ['Нова Пошта', 'Львів, вул. Зелена 42', 'Адресна доставка']
];

const bonusHistory = [
  ['+420', 'За замовлення №12345', '15.05.2026'],
  ['-150', 'Оплата бонусами', '10.05.2026'],
  ['+80', 'За відгук про товар', '06.05.2026']
];

const recommendedProducts = products
  .filter((product) =>
    ['veloura-pro-xl-62', 'belgian-chocolate-drops', 'offset-spatula-set', 'course-macarons-start'].includes(product.slug)
  )
  .slice(0, 4);

const statusClass = {
  green: 'bg-emerald-50 text-emerald-700',
  yellow: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700'
};

const field = (label, type, placeholder, name) => `
  <label class="block">
    <span class="mb-2 block text-xs font-bold text-veloura-muted">${label}</span>
    <input
      class="h-11 w-full rounded-md border border-veloura-line px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-veloura-rose focus:ring-4 focus:ring-rose-100"
      type="${type}"
      placeholder="${placeholder}"
      name="${name}"
      autocomplete="off"
    />
  </label>
`;

const getProduct = (slug) => products.find((product) => product.slug === slug);

const orderThumbs = (items) => `
  <div class="flex -space-x-3">
    ${items
      .map(getProduct)
      .filter(Boolean)
      .slice(0, 3)
      .map(
        (product) => `
          <img
            class="h-11 w-11 rounded-md border-2 border-white bg-rose-50 object-cover"
            src="${product.image}"
            style="object-position:${product.thumbPosition}"
            alt="${product.shortTitle}"
          />
        `
      )
      .join('')}
  </div>
`;

const orderProducts = (items) => `
  <div class="mt-4 flex flex-wrap gap-2">
    ${items
      .map(getProduct)
      .filter(Boolean)
      .map(
        (product) => `
          <a
            class="inline-flex h-9 items-center gap-2 rounded-full border border-veloura-line bg-white px-3 text-xs font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry"
            href="#/product/${product.slug}"
          >
            ${product.shortTitle}
          </a>
        `
      )
      .join('')}
  </div>
`;

const orderCard = (order, index) => `
  <article class="rounded-md border border-veloura-line bg-white p-4">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="flex gap-4">
        ${orderThumbs(order.items)}
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-base font-extrabold text-veloura-ink">${order.id}</h3>
            <span class="rounded-full px-3 py-1 text-xs font-extrabold ${statusClass[order.tone]}">${order.status}</span>
          </div>
          <p class="mt-1 text-sm text-veloura-muted">${order.date} · ${order.items.length} товари · ${formatCurrency(order.total)}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex h-10 items-center justify-center rounded-md border border-veloura-line px-4 text-sm font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry"
          type="button"
          data-profile-demo="Деталі замовлення відкриваються в демо-режимі"
        >
          Деталі
        </button>
        <button
          class="inline-flex h-10 items-center justify-center rounded-md bg-veloura-rose px-4 text-sm font-bold text-white transition hover:bg-veloura-berry"
          type="button"
          data-repeat-order="${order.items.join(',')}"
        >
          Повторити
        </button>
      </div>
    </div>
    <div class="order-progress mt-4 grid gap-2" style="--order-steps:${Math.min(order.steps.length, 4)}">
      ${order.steps
        .map(
          (step, stepIndex) => `
            <div class="rounded-md px-3 py-2 text-xs font-bold ${
              stepIndex <= order.activeStep ? 'bg-rose-50 text-veloura-berry' : 'bg-slate-50 text-slate-400'
            }">
              <span class="mb-1 block h-1.5 rounded-full ${stepIndex <= order.activeStep ? 'bg-veloura-rose' : 'bg-slate-200'}"></span>
              ${step}
            </div>
          `
        )
        .join('')}
    </div>
    ${orderProducts(order.items)}
  </article>
`;

const favoritePreview = (favorites) => {
  const favoriteProducts = products.filter((product) => favorites.has(product.slug)).slice(0, 4);

  if (!favoriteProducts.length) {
    return `
      <div class="rounded-md border border-dashed border-veloura-line bg-rose-50/40 p-5 text-sm text-veloura-muted">
        Поки немає вподобаних товарів. Натисніть сердечко в каталозі або на сторінці товару.
      </div>
    `;
  }

  return `
    <div class="grid gap-3 sm:grid-cols-2">
      ${favoriteProducts
        .map(
          (product) => `
            <a class="flex gap-3 rounded-md border border-veloura-line bg-white p-3 transition hover:border-veloura-rose" href="#/product/${product.slug}">
              <img class="h-16 w-16 rounded-md bg-rose-50 object-cover" src="${product.image}" style="object-position:${product.thumbPosition}" alt="${product.shortTitle}" />
              <span class="min-w-0">
                <span class="line-clamp-2 text-sm font-extrabold text-veloura-ink">${product.shortTitle}</span>
                <span class="mt-1 block text-sm font-bold text-veloura-berry">${formatCurrency(product.price)}</span>
              </span>
            </a>
          `
        )
        .join('')}
    </div>
  `;
};

export const profilePage = ({ favorites = new Set() } = {}) => `
  <section class="page-enter">
    <nav class="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-veloura-muted">
      <a class="transition hover:text-veloura-berry" href="#/">Головна</a>
      <span>/</span>
      <span>Профіль</span>
    </nav>

    <div class="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
      <aside class="reveal rounded-md border border-veloura-line bg-white p-5">
        <div class="flex items-center gap-4">
          <span class="grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-veloura-rose">${icon('user', 'h-7 w-7')}</span>
          <div>
            <p class="text-sm font-semibold text-veloura-berry">Особистий кабінет</p>
            <h1 class="text-2xl font-extrabold text-veloura-ink">Профіль Veloura</h1>
          </div>
        </div>
        <div class="mt-5 rounded-md bg-slate-50 p-4 text-sm leading-6 text-veloura-muted">
          Реєстрація та вхід працюють у демо-режимі: інтерфейс реагує, але дані не зберігаються після перезавантаження.
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <a class="inline-flex h-11 items-center justify-center rounded-md bg-veloura-rose px-4 text-sm font-bold text-white transition hover:bg-veloura-berry" href="#/">
            На головну
          </a>
          <a class="inline-flex h-11 items-center justify-center rounded-md border border-veloura-line px-4 text-sm font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry" href="#/catalog">
            У каталог
          </a>
        </div>
        <div class="mt-5 grid gap-2 text-sm font-bold">
          ${[
            ['user', 'Особисті дані'],
            ['package', 'Ваші замовлення'],
            ['map-pin', 'Адреси доставки'],
            ['heart', 'Вподобані товари'],
            ['gift', 'Бонуси']
          ]
            .map(
              ([itemIcon, title], index) => `
                <a class="flex items-center gap-3 rounded-md px-3 py-3 transition ${index === 0 ? 'bg-rose-50 text-veloura-berry' : 'text-veloura-muted hover:bg-rose-50 hover:text-veloura-berry'}" href="#/profile">
                  ${icon(itemIcon, 'h-5 w-5')}
                  ${title}
                </a>
              `
            )
            .join('')}
        </div>
      </aside>

      <div class="grid gap-5">
        <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 60ms">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-semibold text-veloura-berry">Продовжити покупки</p>
              <h2 class="mt-1 text-2xl font-extrabold text-veloura-ink">Повернутися до товарів</h2>
              <p class="mt-2 text-sm leading-6 text-veloura-muted">
                Швидко відкрийте головну, весь каталог або новинки без зайвих кліків із кабінету.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <a class="inline-flex h-11 items-center justify-center rounded-md bg-veloura-rose px-5 text-sm font-bold text-white transition hover:bg-veloura-berry" href="#/">
                Головна сторінка
              </a>
              <a class="inline-flex h-11 items-center justify-center rounded-md border border-veloura-line px-5 text-sm font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry" href="#/catalog">
                Всі товари
              </a>
              <a class="inline-flex h-11 items-center justify-center rounded-md border border-veloura-line px-5 text-sm font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry" href="#/catalog?category=new">
                Новинки
              </a>
            </div>
          </div>
        </section>

        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
          <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 80ms">
            <div class="mb-5 inline-flex rounded-md bg-rose-50 p-1">
              <button class="auth-tab is-active rounded-md bg-white px-4 py-2 text-sm font-extrabold text-veloura-berry shadow-card" type="button" data-auth-tab="login">Вхід</button>
              <button class="auth-tab rounded-md px-4 py-2 text-sm font-extrabold text-veloura-muted" type="button" data-auth-tab="register">Реєстрація</button>
            </div>

            <form class="auth-panel grid gap-4" data-auth-panel="login" data-auth-form="login">
              <div class="grid gap-4 sm:grid-cols-2">
                ${field('Email', 'email', 'mariia@example.com', 'email')}
                ${field('Пароль', 'password', '••••••••', 'password')}
              </div>
              <label class="flex items-center gap-2 text-sm text-veloura-muted">
                <input class="accent-veloura-rose" type="checkbox" />
                Запамʼятати мене в цьому сеансі
              </label>
              <button class="inline-flex h-12 items-center justify-center rounded-md bg-veloura-rose px-6 text-sm font-bold text-white transition hover:bg-veloura-berry sm:w-max" type="submit">
                Увійти
              </button>
            </form>

            <form class="auth-panel hidden gap-4" data-auth-panel="register" data-auth-form="register">
              <div class="grid gap-4 sm:grid-cols-2">
                ${field('Імʼя', 'text', 'Марія', 'firstName')}
                ${field('Прізвище', 'text', 'Шевченко', 'lastName')}
                ${field('Email', 'email', 'mariia@example.com', 'email')}
                ${field('Телефон', 'tel', '+380 (__) ___ __ __', 'phone')}
                ${field('Пароль', 'password', 'мінімум 8 символів', 'password')}
                ${field('Повторіть пароль', 'password', 'ще раз пароль', 'passwordConfirm')}
              </div>
              <label class="flex items-start gap-2 text-sm leading-6 text-veloura-muted">
                <input class="mt-1 accent-veloura-rose" type="checkbox" />
                Я погоджуюсь з умовами магазину Veloura
              </label>
              <button class="inline-flex h-12 items-center justify-center rounded-md bg-veloura-rose px-6 text-sm font-bold text-white transition hover:bg-veloura-berry sm:w-max" type="submit">
                Зареєструватися
              </button>
            </form>
          </section>

          <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 120ms">
            <h2 class="text-lg font-extrabold text-veloura-ink">Швидка статистика</h2>
            <div class="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              ${[
                ['package', '3', 'замовлення'],
                ['heart', String(favorites.size), 'вподобано'],
                ['gift', '1 250', 'бонусів']
              ]
                .map(
                  ([itemIcon, value, label]) => `
                    <div class="flex items-center gap-3 rounded-md border border-veloura-line px-4 py-3">
                      <span class="grid h-10 w-10 place-items-center rounded-md bg-rose-50 text-veloura-rose">${icon(itemIcon)}</span>
                      <span>
                        <span class="block text-xl font-extrabold text-veloura-ink">${value}</span>
                        <span class="block text-xs font-bold text-veloura-muted">${label}</span>
                      </span>
                    </div>
                  `
                )
                .join('')}
            </div>
          </section>
        </div>

        <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 160ms">
          <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-semibold text-veloura-berry">Історія покупок</p>
              <h2 class="text-xl font-extrabold text-veloura-ink">Ваші замовлення</h2>
            </div>
            <button class="h-10 rounded-md border border-veloura-line px-4 text-sm font-bold text-veloura-muted transition hover:border-veloura-rose hover:text-veloura-berry" type="button" data-profile-demo="Фільтр замовлень буде підключено на бекенді">
              Фільтр
            </button>
          </div>
          <div class="grid gap-3">
            ${demoOrders.map(orderCard).join('')}
          </div>
        </section>

        <div class="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 200ms">
            <div class="mb-5 flex items-end justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-veloura-berry">Доставка</p>
                <h2 class="text-xl font-extrabold text-veloura-ink">Адреси</h2>
              </div>
              <button class="text-sm font-bold text-veloura-lilac transition hover:text-veloura-berry" type="button" data-profile-demo="Додавання адреси у демо не зберігається">Додати</button>
            </div>
            <div class="grid gap-3">
              ${addresses
                .map(
                  ([service, address, label]) => `
                    <article class="rounded-md border border-veloura-line p-4">
                      <div class="flex items-start gap-3">
                        <span class="grid h-10 w-10 place-items-center rounded-md bg-rose-50 text-veloura-rose">${icon('map-pin')}</span>
                        <div class="min-w-0">
                          <h3 class="text-sm font-extrabold text-veloura-ink">${service}</h3>
                          <p class="mt-1 text-sm text-veloura-muted">${address}</p>
                          <p class="mt-2 text-xs font-bold text-veloura-lilac">${label}</p>
                        </div>
                      </div>
                    </article>
                  `
                )
                .join('')}
            </div>
          </section>

          <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 240ms">
            <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-sm font-semibold text-veloura-berry">Ваш вибір</p>
                <h2 class="text-xl font-extrabold text-veloura-ink">Вподобані товари</h2>
              </div>
              <a class="text-sm font-bold text-veloura-lilac transition hover:text-veloura-berry" href="#/catalog">До каталогу</a>
            </div>
            ${favoritePreview(favorites)}
          </section>
        </div>

        <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 280ms">
          <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-semibold text-veloura-berry">Лояльність</p>
              <h2 class="text-xl font-extrabold text-veloura-ink">Бонусний рахунок</h2>
            </div>
            <span class="text-3xl font-extrabold text-veloura-lilac">1 250</span>
          </div>
          <div class="grid gap-3 md:grid-cols-3">
            ${bonusHistory
              .map(
                ([amount, title, date]) => `
                  <article class="rounded-md bg-rose-50/60 p-4">
                    <p class="text-xl font-extrabold ${amount.startsWith('+') ? 'text-emerald-700' : 'text-veloura-berry'}">${amount}</p>
                    <h3 class="mt-2 text-sm font-extrabold text-veloura-ink">${title}</h3>
                    <p class="mt-1 text-xs font-bold text-veloura-muted">${date}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:p-6" style="--reveal-delay: 320ms">
          <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-semibold text-veloura-berry">Підібрано для вас</p>
              <h2 class="text-xl font-extrabold text-veloura-ink">Рекомендовані товари</h2>
            </div>
            <a class="text-sm font-bold text-veloura-lilac transition hover:text-veloura-berry" href="#/catalog">
              Більше товарів
            </a>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            ${recommendedProducts.map(productCard).join('')}
          </div>
        </section>
      </div>
    </div>
  </section>
`;
