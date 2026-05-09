import { deliveryMethods } from '../data/shop.js';
import { cartItem, getCartLines, getCartTotals } from '../components/cart.js';
import { formatCurrency } from '../lib/format.js';
import { icon } from '../lib/icons.js';

export const checkoutPage = (cart, { deliveryId = 'nova-branch', payment = 'card' } = {}) => {
  const totals = getCartTotals(cart, deliveryId);
  const lines = getCartLines(cart);
  const paymentMethods = [
    ['card', 'credit', 'Карткою онлайн', 'Visa / Mastercard'],
    ['cod', 'check', 'Післяплата', 'при отриманні'],
    ['bonus', 'gift', 'Бонусами', 'часткова оплата']
  ];

  return `
    <section class="page-enter">
      <div class="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav class="mb-3 flex items-center gap-2 text-xs font-semibold text-veloura-muted">
            <a class="transition hover:text-veloura-berry" href="#/">Головна</a>
            <span>/</span>
            <span>Оформлення замовлення</span>
          </nav>
          <h1 class="text-3xl font-extrabold text-veloura-ink">Оформлення замовлення</h1>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs font-bold text-veloura-muted">
          ${['Кошик', 'Доставка', 'Оплата', 'Підтвердження']
            .map(
              (step, index) => `
                <span class="inline-flex items-center gap-2">
                  <span class="grid h-8 w-8 place-items-center rounded-full ${index === 0 ? 'bg-veloura-rose text-white' : 'bg-slate-100 text-slate-400'}">${index + 1}</span>
                  ${step}
                </span>
              `
            )
            .join('')}
        </div>
      </div>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_370px]">
        <div class="grid gap-5 lg:grid-cols-2">
          <section class="reveal rounded-md border border-veloura-line bg-white p-5">
            <h2 class="mb-5 text-lg font-extrabold text-veloura-ink">Контактні дані</h2>
            <div class="grid gap-4">
              ${[
                ['Імʼя', 'Марія'],
                ['Прізвище', 'Шевченко'],
                ['Телефон', '+380 (50) 123 45 67'],
                ['Email', 'mariia@example.com']
              ]
                .map(
                  ([label, value]) => `
                    <label class="block">
                      <span class="mb-2 block text-xs font-bold text-veloura-muted">${label}</span>
                      <input class="h-11 w-full rounded-md border border-veloura-line px-4 text-sm outline-none transition focus:border-veloura-rose focus:ring-4 focus:ring-rose-100" value="${value}" />
                    </label>
                  `
                )
                .join('')}
            </div>
          </section>

          <section class="reveal rounded-md border border-veloura-line bg-white p-5" style="--reveal-delay: 80ms">
            <h2 class="mb-5 text-lg font-extrabold text-veloura-ink">Доставка</h2>
            <div class="space-y-3">
              ${deliveryMethods
                .map(
                  (method) => `
                    <label class="flex cursor-pointer items-center gap-4 rounded-md border p-4 transition ${
                      method.id === deliveryId ? 'border-veloura-rose bg-rose-50/50' : 'border-veloura-line hover:border-veloura-rose'
                    }">
                      <input class="accent-veloura-rose" type="radio" name="delivery" value="${method.id}" data-delivery-method ${method.id === deliveryId ? 'checked' : ''} />
                      <span class="grid h-10 w-10 place-items-center rounded-md bg-white text-veloura-rose">${icon(method.icon)}</span>
                      <span class="min-w-0 flex-1">
                        <span class="block text-sm font-extrabold text-veloura-ink">${method.title}</span>
                        <span class="mt-1 block text-xs text-veloura-muted">${method.text}</span>
                      </span>
                      <span class="text-sm font-bold text-veloura-muted">від ${formatCurrency(method.price)}</span>
                    </label>
                  `
                )
                .join('')}
            </div>
            <p class="mt-4 text-xs leading-5 text-veloura-muted">Доставка замовлень від 1 до 3 робочих днів.</p>
          </section>

          <section class="reveal rounded-md border border-veloura-line bg-white p-5 lg:col-span-2" style="--reveal-delay: 120ms">
            <h2 class="mb-5 text-lg font-extrabold text-veloura-ink">Оплата</h2>
            <div class="grid gap-3 md:grid-cols-3">
              ${paymentMethods
                .map(
                  ([id, itemIcon, title, text]) => `
                    <label class="flex cursor-pointer items-center gap-3 rounded-md border ${id === payment ? 'border-veloura-rose bg-rose-50/50' : 'border-veloura-line'} p-4">
                      <input class="accent-veloura-rose" type="radio" name="payment" value="${id}" data-payment-method ${id === payment ? 'checked' : ''} />
                      <span class="text-veloura-rose">${icon(itemIcon)}</span>
                      <span>
                        <span class="block text-sm font-extrabold text-veloura-ink">${title}</span>
                        <span class="block text-xs text-veloura-muted">${text}</span>
                      </span>
                    </label>
                  `
                )
                .join('')}
            </div>
          </section>
        </div>

        <aside class="reveal rounded-md border border-veloura-line bg-white p-5 xl:sticky xl:top-[104px]" style="--reveal-delay: 140ms">
          <h2 class="text-lg font-extrabold text-veloura-ink">Ваше замовлення (${totals.items})</h2>
          <div class="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-1">
            ${
              lines.length
                ? lines.map(cartItem).join('')
                : '<div class="rounded-md border border-dashed border-veloura-line bg-rose-50/40 p-5 text-sm text-veloura-muted">Кошик порожній. Додайте товари перед оформленням.</div>'
            }
          </div>
          <div class="mt-5 space-y-3 border-t border-veloura-line pt-5 text-sm">
            <div class="flex justify-between text-veloura-muted">
              <span>Товари</span>
              <span>${formatCurrency(totals.subtotal)}</span>
            </div>
            <div class="flex justify-between text-veloura-muted">
              <span>Доставка</span>
              <span>${totals.subtotal === 0 ? formatCurrency(0) : totals.delivery ? formatCurrency(totals.delivery) : 'безкоштовно'}</span>
            </div>
            <div class="flex justify-between text-base font-extrabold text-veloura-ink">
              <span>Всього</span>
              <span>${formatCurrency(totals.total)}</span>
            </div>
          </div>
          <button class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-veloura-rose text-sm font-bold text-white transition hover:bg-veloura-berry disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400" type="button" ${totals.items ? '' : 'disabled'}>
            Продовжити
          </button>
          <a class="mt-4 inline-flex text-sm font-bold text-veloura-lilac transition hover:text-veloura-berry" href="#/catalog">
            Назад до покупок
          </a>
        </aside>
      </div>
    </section>
  `;
};
