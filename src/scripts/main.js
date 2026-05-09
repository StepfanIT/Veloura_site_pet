import '../styles/tailwind.css';
import { navigationItems, products } from '../data/shop.js';
import { cartItem, cartSummary, cartTitle, emptyCart, getCartTotals, loadCart, saveCart } from '../components/cart.js';
import { icon, mountStaticIcons } from '../lib/icons.js';
import { checkoutPage } from '../pages/checkout.js';
import { catalogPage } from '../pages/catalog.js';
import { homePage } from '../pages/home.js';
import { productPage } from '../pages/product.js';
import { profilePage } from '../pages/profile.js';

const app = document.querySelector('#app');
const nav = document.querySelector('#category-nav');
const panel = document.querySelector('[data-catalog-panel]');
const menuBackdrop = document.querySelector('[data-menu-backdrop]');
const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartBackdrop = document.querySelector('[data-cart-backdrop]');
const cartItemsRoot = document.querySelector('[data-cart-items]');
const cartSummaryRoot = document.querySelector('[data-cart-summary]');
const cartCountRoot = document.querySelector('[data-cart-count]');
const cartTitleCountRoot = document.querySelector('[data-cart-title-count]');
const favoriteCountRoot = document.querySelector('[data-favorite-count]');
const toast = document.querySelector('[data-toast]');
const searchInputs = [...document.querySelectorAll('[data-search], [data-search-mobile]')];

const state = {
  cart: loadCart(),
  favorites: new Set(),
  search: '',
  productQty: 1,
  sort: 'popular',
  filters: {
    minPrice: '',
    maxPrice: '',
    brands: []
  },
  deliveryId: 'nova-branch',
  payment: 'card'
};

let toastTimer;
let observer;
let pendingRouteOptions = null;

const parseRoute = () => {
  const hash = window.location.hash || '#/';
  const [path = '/', query = ''] = hash.slice(1).split('?');
  const segments = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query);

  if (!segments.length) {
    return { name: 'home', params };
  }

  if (segments[0] === 'catalog') {
    return { name: 'catalog', params };
  }

  if (segments[0] === 'product') {
    return { name: 'product', slug: segments[1], params };
  }

  if (segments[0] === 'checkout') {
    return { name: 'checkout', params };
  }

  if (segments[0] === 'profile') {
    return { name: 'profile', params };
  }

  return { name: 'home', params };
};

const setMenu = (isOpen) => {
  panel.classList.toggle('-translate-x-full', !isOpen);
  menuBackdrop.classList.toggle('hidden', !isOpen);
  document.body.classList.toggle('overflow-hidden', isOpen || cartDrawer.dataset.open === 'true');
};

const setCartDrawer = (isOpen) => {
  cartDrawer.dataset.open = String(isOpen);
  cartDrawer.classList.toggle('translate-x-full', !isOpen);
  cartBackdrop.classList.toggle('hidden', !isOpen);
  document.body.classList.toggle('overflow-hidden', isOpen || !menuBackdrop.classList.contains('hidden'));
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.remove('pointer-events-none', 'translate-y-5', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.add('pointer-events-none', 'translate-y-5', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 1800);
};

const renderNavigation = () => {
  nav.innerHTML = navigationItems
    .map(
      (item) => `
        <a
          class="group flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-veloura-muted transition hover:bg-rose-50 hover:text-veloura-berry"
          href="#/catalog?category=${item.slug}"
          data-nav-link
        >
          <span class="grid h-9 w-9 place-items-center rounded-md border border-veloura-line text-veloura-berry transition group-hover:border-rose-100 group-hover:bg-white">
            ${icon(item.icon, 'h-[18px] w-[18px]')}
          </span>
          <span class="min-w-0 flex-1">${item.label}</span>
          <span class="text-slate-300">${icon('chevron-right', 'h-4 w-4')}</span>
        </a>
      `
    )
    .join('');
};

const renderCart = () => {
  const totals = getCartTotals(state.cart, state.deliveryId);

  cartCountRoot.textContent = totals.items;
  cartTitleCountRoot.textContent = cartTitle(totals.items);
  cartItemsRoot.innerHTML = totals.lines.length ? `<div class="space-y-3">${totals.lines.map(cartItem).join('')}</div>` : emptyCart();
  cartSummaryRoot.innerHTML = cartSummary(totals);
  saveCart(state.cart);
};

const updateFavoriteButtons = () => {
  const count = state.favorites.size;

  favoriteCountRoot.textContent = count;
  favoriteCountRoot.classList.toggle('hidden', count === 0);
  favoriteCountRoot.classList.toggle('flex', count > 0);

  document.querySelectorAll('[data-favorite][data-product]').forEach((button) => {
    const active = state.favorites.has(button.dataset.product);
    button.classList.toggle('is-favorite', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Прибрати з обраного' : 'Додати в обране');
  });
};

const addToCart = (slug, qty = 1) => {
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return;
  }

  const existing = state.cart.find((item) => item.slug === slug);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ slug, qty });
  }

  renderCart();
  showToast(`Додано: ${product.shortTitle}`);
};

const changeCartLine = (slug, action) => {
  const line = state.cart.find((item) => item.slug === slug);

  if (!line) {
    return;
  }

  if (action === 'inc') {
    line.qty += 1;
  }

  if (action === 'dec') {
    line.qty -= 1;
  }

  if (action === 'remove' || line.qty <= 0) {
    state.cart = state.cart.filter((item) => item.slug !== slug);
  }

  renderCart();

  if (parseRoute().name === 'checkout') {
    renderRoute(false, { animate: false });
  }
};

const syncSearchInputs = () => {
  searchInputs.forEach((input) => {
    input.value = state.search;
  });
};

const hydrateReveal = ({ animate = true } = {}) => {
  if (observer) {
    observer.disconnect();
  }

  const targets = [...document.querySelectorAll('.reveal')];

  if (!animate) {
    targets.forEach((target) => {
      target.classList.add('reveal-static', 'is-visible');
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
};

const renderRoute = (scroll = true, { animate = true } = {}) => {
  const route = parseRoute();
  const category = route.params.get('category') || 'all';

  document.body.dataset.route = route.name;
  state.productQty = 1;

  if (route.name === 'catalog') {
    app.innerHTML = catalogPage({ category, search: state.search, sort: state.sort, filters: state.filters });
  } else if (route.name === 'product') {
    app.innerHTML = productPage(route.slug);
  } else if (route.name === 'checkout') {
    app.innerHTML = checkoutPage(state.cart, { deliveryId: state.deliveryId, payment: state.payment });
  } else if (route.name === 'profile') {
    app.innerHTML = profilePage({ favorites: state.favorites });
  } else {
    app.innerHTML = homePage();
  }

  if (!animate) {
    app.querySelectorAll('.page-enter').forEach((page) => page.classList.add('page-static'));
  }

  hydrateReveal({ animate });
  syncSearchInputs();
  updateFavoriteButtons();

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const updateProductQty = (action) => {
  state.productQty = action === 'inc' ? state.productQty + 1 : Math.max(1, state.productQty - 1);
  const qtyRoot = document.querySelector('[data-product-qty-value]');
  if (qtyRoot) {
    qtyRoot.textContent = state.productQty;
  }
};

const setSortMenu = (isOpen) => {
  const trigger = document.querySelector('[data-sort-trigger]');
  const menu = document.querySelector('[data-sort-menu]');

  if (!trigger || !menu) {
    return;
  }

  trigger.setAttribute('aria-expanded', String(isOpen));
  menu.classList.toggle('hidden', !isOpen);
};

const getPriceFilterValues = () => {
  const minInput = document.querySelector('[data-price-min]');
  const maxInput = document.querySelector('[data-price-max]');
  const clean = (value) => value.replace(/[^\d]/g, '');

  return {
    minPrice: minInput ? clean(minInput.value) : '',
    maxPrice: maxInput ? clean(maxInput.value) : ''
  };
};

const applyPriceFilters = () => {
  const { minPrice, maxPrice } = getPriceFilterValues();
  state.filters = { ...state.filters, minPrice, maxPrice };
  renderRoute(false, { animate: false });
};

const setBrandFilter = (brand, checked) => {
  const brands = new Set(state.filters.brands);

  if (checked) {
    brands.add(brand);
  } else {
    brands.delete(brand);
  }

  state.filters = { ...state.filters, brands: [...brands] };
  renderRoute(false, { animate: false });
};

const clearCatalogFilters = () => {
  state.search = '';
  state.filters = { minPrice: '', maxPrice: '', brands: [] };
  syncSearchInputs();

  if (parseRoute().name === 'catalog') {
    if (window.location.hash === '#/catalog') {
      renderRoute(false, { animate: false });
    } else {
      pendingRouteOptions = { scroll: false, animate: false };
      window.location.hash = '#/catalog';
    }
  }
};

const toggleFavorite = (slug) => {
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return;
  }

  if (state.favorites.has(slug)) {
    state.favorites.delete(slug);
    showToast(`Прибрано з обраного: ${product.shortTitle}`);
  } else {
    state.favorites.add(slug);
    showToast(`Вподобано: ${product.shortTitle}`);
  }

  updateFavoriteButtons();

  if (parseRoute().name === 'profile') {
    renderRoute(false, { animate: false });
  }
};

const repeatOrder = (rawSlugs) => {
  const slugs = rawSlugs.split(',').filter(Boolean);

  slugs.forEach((slug) => {
    const product = products.find((item) => item.slug === slug);

    if (!product) {
      return;
    }

    const existing = state.cart.find((item) => item.slug === slug);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ slug, qty: 1 });
    }
  });

  renderCart();
  setCartDrawer(true);
  showToast('Товари із замовлення додано в кошик');
};

const selectColor = (button) => {
  document.querySelectorAll('[data-color-swatch]').forEach((swatch) => {
    swatch.classList.remove('is-selected', 'border-veloura-rose', 'ring-4', 'ring-rose-100');
    swatch.classList.add('border-veloura-line');
  });

  button.classList.add('is-selected', 'border-veloura-rose', 'ring-4', 'ring-rose-100');
  button.classList.remove('border-veloura-line');

  const label = document.querySelector('[data-color-label]');
  if (label) {
    label.textContent = button.dataset.colorLabel;
  }

  const tint = document.querySelector('[data-product-color-tint]');
  if (tint) {
    tint.style.backgroundColor = button.dataset.colorValue;
    tint.style.opacity = button.dataset.colorValue.toLowerCase() === '#ffffff' ? '0.08' : '0.26';
  }
};

const setProductTab = (tabName) => {
  document.querySelectorAll('[data-product-tab]').forEach((tab) => {
    const active = tab.dataset.productTab === tabName;
    tab.classList.toggle('is-active', active);
    tab.classList.toggle('border-veloura-rose', active);
    tab.classList.toggle('border-transparent', !active);
    tab.classList.toggle('text-veloura-ink', active);
    tab.classList.toggle('text-veloura-muted', !active);
  });

  document.querySelectorAll('[data-product-panel]').forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.productPanel !== tabName);
  });
};

const setAuthTab = (tabName) => {
  document.querySelectorAll('[data-auth-tab]').forEach((tab) => {
    const active = tab.dataset.authTab === tabName;
    tab.classList.toggle('is-active', active);
    tab.classList.toggle('bg-white', active);
    tab.classList.toggle('text-veloura-berry', active);
    tab.classList.toggle('text-veloura-muted', !active);
    tab.classList.toggle('shadow-card', active);
  });

  document.querySelectorAll('[data-auth-panel]').forEach((panel) => {
    const active = panel.dataset.authPanel === tabName;
    panel.classList.toggle('hidden', !active);
    panel.classList.toggle('grid', active);
  });
};

renderNavigation();
mountStaticIcons();
renderCart();
renderRoute(false);

window.addEventListener('hashchange', () => {
  setMenu(false);
  const options = pendingRouteOptions ?? { scroll: true, animate: true };
  pendingRouteOptions = null;
  renderRoute(options.scroll, { animate: options.animate });
});

document.querySelector('[data-menu-toggle]').addEventListener('click', () => setMenu(true));
document.querySelector('[data-menu-close]').addEventListener('click', () => setMenu(false));
menuBackdrop.addEventListener('click', () => setMenu(false));
cartBackdrop.addEventListener('click', () => setCartDrawer(false));

searchInputs.forEach((input) => {
  input.addEventListener('input', (event) => {
    state.search = event.target.value;
    syncSearchInputs();

    if (parseRoute().name !== 'catalog') {
      window.location.hash = '#/catalog';
      return;
    }

    renderRoute(false, { animate: false });
  });
});

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-brand-filter]')) {
    setBrandFilter(event.target.value, event.target.checked);
  }

  if (event.target.matches('[data-delivery-method]')) {
    state.deliveryId = event.target.value;
    renderCart();
    renderRoute(false, { animate: false });
  }

  if (event.target.matches('[data-payment-method]')) {
    state.payment = event.target.value;
    renderRoute(false, { animate: false });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.target.matches('[data-price-min], [data-price-max]')) {
    event.preventDefault();
    applyPriceFilters();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-auth-form]');

  if (!form) {
    return;
  }

  event.preventDefault();
  showToast(form.dataset.authForm === 'register' ? 'Реєстрація показана в демо-режимі, дані не збережені' : 'Вхід показаний в демо-режимі');
  form.reset();
});

document.addEventListener('click', (event) => {
  const catalogLink = event.target.closest('a[href^="#/catalog"]');
  if (catalogLink && parseRoute().name === 'catalog') {
    pendingRouteOptions = { scroll: false, animate: false };
  }

  const menuLink = event.target.closest('[data-nav-link]');
  if (menuLink) {
    setMenu(false);
  }

  const openCart = event.target.closest('[data-open-cart]');
  if (openCart) {
    setCartDrawer(true);
  }

  const openFavorites = event.target.closest('[data-open-favorites]');
  if (openFavorites) {
    window.location.hash = '#/profile';
  }

  const sortTrigger = event.target.closest('[data-sort-trigger]');
  if (sortTrigger) {
    const isOpen = sortTrigger.getAttribute('aria-expanded') === 'true';
    setSortMenu(!isOpen);
  } else if (!event.target.closest('[data-sort-select]')) {
    setSortMenu(false);
  }

  const sortValue = event.target.closest('[data-sort-value]');
  if (sortValue) {
    state.sort = sortValue.dataset.sortValue;
    setSortMenu(false);
    renderRoute(false, { animate: false });
  }

  const applyPriceButton = event.target.closest('[data-apply-price]');
  if (applyPriceButton) {
    applyPriceFilters();
  }

  const clearFiltersButton = event.target.closest('[data-clear-filters]');
  if (clearFiltersButton) {
    clearCatalogFilters();
  }

  const closeCart = event.target.closest('[data-close-cart], [data-close-cart-link]');
  if (closeCart) {
    setCartDrawer(false);
  }

  const checkoutButton = event.target.closest('[data-go-checkout]');
  if (checkoutButton) {
    setCartDrawer(false);
    window.location.hash = '#/checkout';
  }

  const addButton = event.target.closest('[data-add-to-cart]');
  if (addButton) {
    const qty = addButton.hasAttribute('data-with-qty') ? state.productQty : 1;
    addToCart(addButton.dataset.product, qty);
  }

  const cartAction = event.target.closest('[data-cart-action]');
  if (cartAction) {
    changeCartLine(cartAction.dataset.product, cartAction.dataset.cartAction);
  }

  const qtyButton = event.target.closest('[data-product-qty]');
  if (qtyButton) {
    updateProductQty(qtyButton.dataset.productQty);
  }

  const galleryButton = event.target.closest('[data-gallery-position]');
  if (galleryButton) {
    const image = document.querySelector('[data-product-main-image]');
    if (image) {
      image.style.objectPosition = galleryButton.dataset.galleryPosition;
    }

    document.querySelectorAll('.gallery-thumb').forEach((button) => {
      button.classList.remove('border-veloura-rose');
      button.classList.add('border-veloura-line');
    });
    galleryButton.classList.add('border-veloura-rose');
    galleryButton.classList.remove('border-veloura-line');
  }

  const favoriteButton = event.target.closest('[data-favorite][data-product]');
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.product);
  }

  const repeatOrderButton = event.target.closest('[data-repeat-order]');
  if (repeatOrderButton) {
    repeatOrder(repeatOrderButton.dataset.repeatOrder);
  }

  const profileDemoButton = event.target.closest('[data-profile-demo]');
  if (profileDemoButton) {
    showToast(profileDemoButton.dataset.profileDemo);
  }

  const colorButton = event.target.closest('[data-color-swatch]');
  if (colorButton) {
    selectColor(colorButton);
  }

  const productTab = event.target.closest('[data-product-tab]');
  if (productTab) {
    setProductTab(productTab.dataset.productTab);
  }

  const authTab = event.target.closest('[data-auth-tab]');
  if (authTab) {
    setAuthTab(authTab.dataset.authTab);
  }
});
