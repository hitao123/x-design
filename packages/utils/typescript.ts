// TypeScript utility types

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Arrayable<T> = T | T[];

export type Awaitable<T> = T | Promise<T>;
