import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // Activar scroll instantáneo (solo para componentes que lo necesitan)
  enableInstantScroll() {
    this.renderer.addClass(document.documentElement, 'no-smooth-scroll');
  }

  // Volver a scroll suave
  enableSmoothScroll() {
    this.renderer.removeClass(document.documentElement, 'no-smooth-scroll');
  }

  scrollToTop(behavior: ScrollBehavior = 'smooth') {
    window.scrollTo({ top: 0, behavior });
  }

  scrollToElement(elementId: string, behavior: ScrollBehavior = 'smooth') {
    document.getElementById(elementId)?.scrollIntoView({ behavior });
  }

  // Guardar posición (solo para componentes que lo necesitan)
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
}
