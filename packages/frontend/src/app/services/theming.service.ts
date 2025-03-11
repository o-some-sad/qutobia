import { Injectable } from '@angular/core';

const THEMES = {
  system: null,
  dark: 'dracula',
  light: 'lofi',
};

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  constructor() {
    this.applyTheme();
  }

  currentTheme!: keyof typeof THEMES;
  setTheme(theme: keyof typeof THEMES) {
    window.localStorage.setItem('theme', theme);
    this.applyTheme();
  }
  private applyTheme() {
    let currentTheme = localStorage.getItem('theme') || 'system';
    if (!(currentTheme in THEMES)) currentTheme = 'system';
    this.currentTheme = currentTheme as keyof typeof THEMES;
    if (THEMES[currentTheme as keyof typeof THEMES])
      document.documentElement.setAttribute(
        'data-theme',
        THEMES[currentTheme as keyof typeof THEMES]!
      );
    else document.documentElement.removeAttribute('data-theme');
  }
}
