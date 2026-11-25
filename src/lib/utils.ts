import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 조건부 className을 합치고 충돌하는 Tailwind 유틸리티를 정리한다. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
