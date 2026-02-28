export const StorageKey = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export type StorageKey = typeof StorageKey[keyof typeof StorageKey];

