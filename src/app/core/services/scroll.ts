/* import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  //  memoria por URL
  private scrollPositions = new Map<string, number>();

  // =========================
  // 1. SCROLL GLOBAL (HEADER)
  // =========================
  scrollBelowHeader(behavior: ScrollBehavior = 'smooth') {
    const header = document.querySelector('app-header') as HTMLElement;

    const offset = header?.getBoundingClientRect().height ?? 180;

    window.scrollTo({ top: 0, behavior });

    window.scrollBy({
      top: offset,
      behavior,
    });
  }

  // =========================
  // 2. SCROLL INTERNO CON OFFSET
  // =========================
  scrollToElement(id: string, offset = 80, behavior: ScrollBehavior = 'smooth') {
    const el = document.getElementById(id);
    if (!el) return;

    const elementTop = el.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: elementTop - offset,
      behavior,
    });
  }

  // =========================
  // 3. GUARDAR SCROLL ACTUAL
  // =========================
  saveScroll(url: string = this.getUrl()): void {
    this.scrollPositions.set(url, window.scrollY);
  }

  // =========================
  // 4. RESTAURAR SCROLL
  // =========================
  restoreScroll(url: string = this.getUrl(), behavior: ScrollBehavior = 'auto'): void {
    const y = this.scrollPositions.get(url);

    if (y !== undefined) {
      window.scrollTo({
        top: y,
        behavior,
      });
    }
  }

  // =========================
  // 5. UTILIDAD URL
  // =========================
  private getUrl(): string {
    return window.location.pathname + window.location.search;
  }

  // =========================
  // 6. LIMPIAR (opcional)
  // =========================
  clearScroll(url: string = this.getUrl()): void {
    this.scrollPositions.delete(url);
  }
}
*/
