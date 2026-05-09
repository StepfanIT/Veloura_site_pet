const iconPaths = {
  search: '<path d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>',
  heart: '<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6a5 5 0 0 1 7.5 6.6Z"/>',
  cart: '<path d="M7 8h13l-1.4 7.2a2 2 0 0 1-2 1.6H9.3a2 2 0 0 1-2-1.6L6 4H3"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  mixer: '<path d="M4 17h13a3 3 0 0 0 3-3v-4H7a3 3 0 0 0-3 3v4Z"/><path d="M8 17v2h7v-2M13 10V6a3 3 0 0 1 3-3h2"/><path d="M9 13h3"/>',
  bowl: '<path d="M5 10h14c-.4 5-3.1 8-7 8s-6.6-3-7-8Z"/><path d="M8 7c1.4-1 2.7-1 4 0s2.6 1 4 0"/>',
  sparkle: '<path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/><path d="m19 4 .7 2.3L22 7l-2.3.7L19 10l-.7-2.3L16 7l2.3-.7L19 4Z"/>',
  mold: '<path d="M5 8h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z"/><path d="M8 8V5h8v3M9 12h.01M12 12h.01M15 12h.01M9 15h.01M12 15h.01M15 15h.01"/>',
  whisk: '<path d="M13 3c3 3 3 7 0 10s-7 3-10 0c3-3 7-3 10 0"/><path d="m14 14 7 7"/><path d="M4 12c2-2 5-2 7 0"/>',
  bag: '<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  book: '<path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4V4Z"/><path d="M5 16V4"/>',
  gift: '<path d="M20 12v8H4v-8M3 8h18v4H3V8Z"/><path d="M12 8v12"/><path d="M12 8H8.5a2 2 0 1 1 2-2c0 2-2 2-2 2M12 8h3.5a2 2 0 1 0-2-2c0 2 2 2 2 2"/>',
  star: '<path d="m12 3 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9L12 3Z"/>',
  tag: '<path d="M20 12 12 20 4 12V4h8l8 8Z"/><path d="M8.5 8.5h.01"/>',
  truck: '<path d="M3 7h11v9H3V7Z"/><path d="M14 10h4l3 3v3h-7v-6Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H4v-5ZM17 14h3v5h-3v-5Z"/><path d="M17 19c0 1.2-1.6 2-4 2h-1"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z"/><path d="m8.5 12 2.3 2.3 4.8-5"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  'map-pin': '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  credit: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
  mail: '<path d="M4 6h16v12H4V6Z"/><path d="m4 7 8 6 8-6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  package: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 8 7.5 4.2L19.5 8M12 21v-8.8"/>'
};

export const icon = (name, className = 'h-5 w-5') => `
  <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${iconPaths[name] ?? iconPaths.sparkle}
  </svg>
`;

export const mountStaticIcons = () => {
  document.querySelectorAll('[data-icon]').forEach((target) => {
    target.innerHTML = icon(target.dataset.icon, 'h-[18px] w-[18px]');
  });

  document.querySelectorAll('[data-icon-button]').forEach((button) => {
    if (button.dataset.iconMounted) {
      return;
    }

    const badge = button.querySelector('[data-cart-count]');
    button.insertAdjacentHTML('afterbegin', icon(button.dataset.iconButton, 'h-5 w-5'));
    if (badge) {
      button.appendChild(badge);
    }
    button.dataset.iconMounted = 'true';
  });

  document.querySelectorAll('[data-menu-close], [data-close-cart]').forEach((button) => {
    button.innerHTML = icon('close', 'h-5 w-5');
  });
};
