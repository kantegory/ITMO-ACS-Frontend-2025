export const PROPERTY_TYPES = {
  apartment: 'Квартира',
  house: 'Дом',
  room: 'Комната',
  studio: 'Студия',
} as const;

export const RENTAL_STATUS = {
  pending: 'Ожидает подтверждения',
  active: 'Активна',
  completed: 'Завершена',
  cancelled: 'Отменена',
} as const;

export const CURRENCY = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
} as const;

export const PERIOD = {
  day: 'день',
  month: 'месяц',
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  properties: '/properties',
  property: (id: string) => `/properties/${id}`,
  profile: '/profile',
  messages: '/messages',
} as const;
