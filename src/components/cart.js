import { defaultCart, deliveryMethods, products } from '../data/shop.js';
import { formatCurrency, plural } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const normalizeCart = (items) =>
  items
    .map((item) => {
      const product = products.find((candidate) => candidate.slug === item.slug);
      return product ? { slug: item.slug, qty: Math.max(1, Number(item.qty) || 1) } : null;
    })
    .filter(Boolean);

export const loadCart = () => {
  return normalizeCart(defaultCart);
};

export const saveCart = () => {};

export const getCartLines = (cart) =>
  cart
    .map((item) => {
      const product = products.find((candidate) => candidate.slug === item.slug);
      return product ? { ...item, product, lineTotal: product.price * item.qty } : null;
    })
    .filter(Boolean);

export const getCartTotals = (cart, deliveryId = 'nova-branch') => {
  const lines = getCartLines(cart);
  const items = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const selectedDelivery = deliveryMethods.find((method) => method.id === deliveryId) ?? deliveryMethods[0];
  const delivery = subtotal === 0 || subtotal >= 20000 ? 0 : selectedDelivery.price;
  const total = subtotal + delivery;
  const freeLeft = Math.max(0, 20000 - subtotal);

  return { lines, items, subtotal, delivery, total, freeLeft, deliveryId: selectedDelivery.id };
};

export const cartItem = (line) => `
  <article class="cart-line grid grid-cols-[72px_minmax(0,1fr)] gap-4 rounded-md border border-veloura-line bg-white p-3">
    <img
      class="h-[72px] w-[72px] rounded-md bg-rose-50 object-cover"
      src="${line.product.image}"
      style="object-position: ${line.product.thumbPosition};"
      alt="${line.product.shortTitle}"
    />
    <div class="min-w-0">
      <div class="flex items-start justify-between gap-3">
        <div>
          <a class="line-clamp-2 text-sm font-extrabold leading-5 text-veloura-ink transition hover:text-veloura-berry" href="#/product/${line.product.slug}" data-close-cart-link>
            ${line.product.shortTitle}
          </a>
          <p class="mt-1 text-xs text-veloura-muted">${line.product.category}</p>
        </div>
        <button class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-veloura-berry" type="button" aria-label="Видалити товар" data-cart-action="remove" data-product="${line.slug}">
          ${icon('trash', 'h-4 w-4')}
        </button>
      </div>
      <div class="mt-3 flex items-center justify-between gap-3">
        <div class="inline-flex h-9 items-center rounded-md border border-veloura-line">
          <button class="grid h-9 w-9 place-items-center text-veloura-muted transition hover:text-veloura-berry" type="button" aria-label="Зменшити кількість" data-cart-action="dec" data-product="${line.slug}">
            ${icon('minus', 'h-4 w-4')}
          </button>
          <span class="w-8 text-center text-sm font-bold">${line.qty}</span>
          <button class="grid h-9 w-9 place-items-center text-veloura-muted transition hover:text-veloura-berry" type="button" aria-label="Збільшити кількість" data-cart-action="inc" data-product="${line.slug}">
            ${icon('plus', 'h-4 w-4')}
          </button>
        </div>
        <span class="text-sm font-extrabold text-veloura-ink">${formatCurrency(line.lineTotal)}</span>
      </div>
    </div>
  </article>
`;

export const cartSummary = (totals) => `
  <div class="space-y-3 text-sm">
    <div class="flex justify-between text-veloura-muted">
      <span>Товари (${totals.items})</span>
      <span>${formatCurrency(totals.subtotal)}</span>
    </div>
    <div class="flex justify-between text-veloura-muted">
      <span>Доставка</span>
      <span>${totals.subtotal === 0 ? formatCurrency(0) : totals.delivery ? formatCurrency(totals.delivery) : 'безкоштовно'}</span>
    </div>
    <div class="flex justify-between border-t border-veloura-line pt-4 text-base font-extrabold text-veloura-ink">
      <span>Всього</span>
      <span>${formatCurrency(totals.total)}</span>
    </div>
  </div>
  <button
    class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-veloura-rose text-sm font-bold text-white transition hover:bg-veloura-berry disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
    type="button"
    data-go-checkout
    ${totals.items ? '' : 'disabled'}
  >
    Оформити замовлення
  </button>
  <div class="${totals.items ? 'mt-5' : 'hidden'} rounded-md bg-rose-50 px-4 py-3 text-xs font-semibold text-veloura-muted">
    ${
      totals.freeLeft
        ? `Вам залишилось ${formatCurrency(totals.freeLeft)} до безкоштовної доставки.`
        : 'Безкоштовна доставка вже у кошику.'
    }
    <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
      <span class="block h-full rounded-full bg-veloura-rose" style="width: ${Math.min(100, (totals.subtotal / 20000) * 100)}%"></span>
    </div>
  </div>
`;

export const emptyCart = () => `
  <div class="grid h-full place-items-center text-center">
    <div>
      <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-veloura-rose">${icon('cart', 'h-7 w-7')}</span>
      <h3 class="mt-4 text-lg font-extrabold text-veloura-ink">Кошик порожній</h3>
      <p class="mt-2 text-sm text-veloura-muted">Додайте товари з каталогу, і вони зʼявляться тут.</p>
      <a class="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-veloura-rose px-5 text-sm font-bold text-white" href="#/catalog" data-close-cart-link>
        До каталогу
      </a>
    </div>
  </div>
`;

export const cartTitle = (count) => `(${count} ${plural(count, 'товар', 'товари', 'товарів')})`;
