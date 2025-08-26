import { type ClassDictionary, type ClassValue as ClsxClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type ClassValue = ClassValue[] | ClassDictionary | string;

export function cn(...inputs: ClsxClassValue[]) {
  return twMerge(clsx(inputs));
}
