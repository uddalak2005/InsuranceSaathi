import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cookie utility functions
export const cookieUtils = {
  // Get all cookies as an object
  getAll: () => {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  },

  // Get a specific cookie
  get: (name: string): string | null => {
    const cookies = cookieUtils.getAll();
    return cookies[name] || null;
  },

  // Set a cookie
  set: (name: string, value: string, options: {
    expires?: number; // days
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  } = {}) => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    }
    
    if (options.path) cookieString += `; path=${options.path}`;
    if (options.domain) cookieString += `; domain=${options.domain}`;
    if (options.secure) cookieString += '; secure';
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
    
    document.cookie = cookieString;
  },

  // Delete a cookie
  delete: (name: string, options: { path?: string; domain?: string } = {}) => {
    cookieUtils.set(name, '', { ...options, expires: -1 });
  },

  // Log all cookies for debugging
  logAll: () => {
    console.log('All cookies:', cookieUtils.getAll());
    console.log('Raw cookie string:', document.cookie);
  }
};
