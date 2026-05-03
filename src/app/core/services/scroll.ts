import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private router: Router,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initAutoScroll();
  }

  // Scroll automático al cambiar de página
  private initAutoScroll() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.scrollToTop('smooth');
    });
  }

  // Activar scroll instantáneo
  enableInstantScroll() {
    this.renderer.addClass(document.documentElement, 'no-smooth-scroll');
  }

  // Activar scroll suave
  enableSmoothScroll() {
    this.renderer.removeClass(document.documentElement, 'no-smooth-scroll');
  }

  scrollToTop(behavior: ScrollBehavior = 'smooth') {
    window.scrollTo({ top: 0, behavior });
  }

  /*  scrollToElement(elementId: string, behavior: ScrollBehavior = 'smooth') {
    document.getElementById(elementId)?.scrollIntoView({ behavior });
  }*/

  savePosition(key: string) {
    sessionStorage.setItem(`scroll_${key}`, window.scrollY.toString());
  }

  restorePosition(key: string) {
    const position = sessionStorage.getItem(`scroll_${key}`);
    if (position) {
      window.scrollTo({ top: parseInt(position), behavior: 'auto' });
      sessionStorage.removeItem(`scroll_${key}`);
    }
  }
  /* scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }*/

  scrollToElement(id: string, offset = 80, behavior: ScrollBehavior = 'auto') {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: y,
      behavior,
    });
  }
}
