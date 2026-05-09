export const formatCurrency = (value) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0
  })
    .format(value)
    .replace('₴', 'грн');

export const getDiscount = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) {
    return null;
  }

  return `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
};

export const plural = (count, one, few, many) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }

  return many;
};
