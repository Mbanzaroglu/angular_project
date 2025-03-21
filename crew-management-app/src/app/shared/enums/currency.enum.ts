export enum Currency {
  USD = 1,
  EUR = 2,
}

export interface CurrencyDetail {
  id: Currency;
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCY_DETAILS: CurrencyDetail[] = [
  { id: Currency.USD, code: 'USD', name: 'US Dollar', symbol: '$' },
  { id: Currency.EUR, code: 'EUR', name: 'Euro', symbol: '€' },
];

export function getCurrencyDetailById(id: Currency): CurrencyDetail {
  return CURRENCY_DETAILS.find(currency => currency.id === id) || CURRENCY_DETAILS[0]; // Varsayılan olarak USD
}

export function getCurrencyCodeById(id: Currency): string {
  return getCurrencyDetailById(id).code;
}