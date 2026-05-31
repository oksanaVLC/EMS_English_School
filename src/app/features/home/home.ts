import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  private animated = false;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.initDrag();
    this.setupStatsObserver();
    this.setupScrollAnimations(); // ← NUEVO: para las animaciones de scroll
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // =========================
  // SCROLL ANIMATIONS (NUEVO)
  // =========================
  private setupScrollAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }, // 15% visible para activar
    );

    animatedElements.forEach((el) => this.observer?.observe(el));
  }

  // =========================
  // STATS (ÚNICA ANIMACIÓN ACTIVA)
  // =========================
  private setupStatsObserver(): void {
    const section = document.getElementById('statsSection');
    if (!section) return;

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animated) {
            this.animated = true;
            this.startCounters();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    statsObserver.observe(section);
  }

  private startCounters(): void {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';

      let current = 0;
      const increment = target / 60;

      const animate = () => {
        current += increment;

        if (current < target) {
          el.textContent = this.format(Math.floor(current), suffix);
          requestAnimationFrame(animate);
        } else {
          el.textContent = this.format(target, suffix);
        }
      };

      animate();
    });
  }

  private format(value: number, suffix = ''): string {
    if (value >= 1000) return `${Math.floor(value / 1000)}k${suffix}`;
    return `${value}${suffix}`;
  }

  // =========================
  // FAQ
  // =========================
  activeIndex: number | null = null;

  toggleFAQ(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  // =========================
  // SLIDER DRAG
  // =========================
  @ViewChild('reviewsSlider', { static: false }) slider!: ElementRef;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  initDrag() {
    const el = this.slider?.nativeElement;
    if (!el) return;

    el.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDown = true;
      el.classList.add('dragging');
      const rect = el.getBoundingClientRect();
      this.startX = e.pageX - rect.left;
      this.scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => {
      this.isDown = false;
      el.classList.remove('dragging');
    });

    el.addEventListener('mouseup', () => {
      this.isDown = false;
      el.classList.remove('dragging');
    });

    el.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDown) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const x = e.pageX - rect.left;
      const walk = (x - this.startX) * 2;
      el.scrollLeft = this.scrollLeft - walk;
    });
  }

  // =========================
  // VIDEOS
  // =========================
  videos = [
    { id: 'oI5ZpKrHk7w', thumb: '', title: 'TEMA 1', embedUrl: null, loaded: false, reveal: 50 },
    { id: 'T79zpfKP5Fs', thumb: '', title: 'TEMA 2', embedUrl: null, loaded: false, reveal: 50 },
    { id: 'WbQPJGSq-3M', thumb: '', title: 'TEMA 3', embedUrl: null, loaded: false, reveal: 50 },
    { id: '1I2wzSUIpDk', thumb: '', title: 'TEMA 4', embedUrl: null, loaded: false, reveal: 50 },
    { id: 'xxk2LwBt62U', thumb: '', title: 'TEMA 5', embedUrl: null, loaded: false, reveal: 50 },
    { id: '75MbeDqiyoQ', thumb: '', title: 'TEMA 6', embedUrl: null, loaded: false, reveal: 50 },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.videos.forEach((v) => {
      v.thumb = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
    });
  }

  loadVideo(video: any) {
    if (!video.loaded) {
      video.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&controls=1`,
      );
      video.loaded = true;
    }
  }

  // =========================
  // REVIEWS DATA
  // =========================
  reviews = [
    {
      stars: '★★★★★',
      text: 'He mejorado muchísimo mi inglés en pocas semanas.',
      name: 'María G.',
      country: 'España',
      image: 'images/1p.webp',
    },
    {
      stars: '★★★★★',
      text: 'Me encanta la metodología.',
      name: 'Sebastian P.',
      country: 'Italia',
      image: 'images/2p.webp',
    },
    {
      stars: '★★★★★',
      text: 'Muy buenas explicaciones.',
      name: 'Laura K.',
      country: 'Francia',
      image: 'images/3p.webp',
    },
    {
      stars: '★★★★★',
      text: 'He mejorado muchísimo mi inglés en pocas semanas.',
      name: 'María G.',
      country: 'España',
      image: 'images/4p.webp',
    },
    {
      stars: '★★★★★',
      text: 'Me encanta la metodología.',
      name: 'Alex P.',
      country: 'Italia',
      image: 'images/5p.webp',
    },
    {
      stars: '★★★★★',
      text: 'Muy buenas explicaciones.',
      name: 'Alan K.',
      country: 'Francia',
      image: 'images/6p.webp',
    },
  ];
}
