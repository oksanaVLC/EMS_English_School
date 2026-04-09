import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Button, RouterModule, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  activeIndex: number | null = null;

  toggleFAQ(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  currentIndex = 0;
  intervalId: any;

  @ViewChild('reviewsSlider', { static: false }) slider!: ElementRef;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  // ================= VIDEOS =================
  videos = [
    {
      id: 'O8zlczzKOF8',
      thumb: '',
      title: 'TEMA 1',
      embedUrl: null,
      loaded: false,
      reveal: 50,
    },
    {
      id: 'Abjqc8LgUcI',
      thumb: '',
      title: 'TEMA 2',
      embedUrl: null,
      loaded: false,
      reveal: 50,
    },
    {
      id: 'kQKbalJVjcA',
      thumb: '',
      title: 'TEMA 3',
      embedUrl: null,
      loaded: false,
      reveal: 50,
    },
    {
      id: '1I2wzSUIpDk',
      thumb: '',
      title: 'TEMA 4',
      embedUrl: null,
      loaded: false,
      reveal: 50,
    },
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

  // ================= REVIEWS =================
  reviews = [
    {
      stars: '★★★★★',
      text: 'He mejorado muchísimo mi inglés en pocas semanas.',
      name: 'María G.',
      country: 'España',
      image: 'images/user1.jpg',
    },
    {
      stars: '★★★★★',
      text: 'Me encanta la metodología.',
      name: 'Alex P.',
      country: 'Italia',
      image: 'images/user2.jpg',
    },
    {
      stars: '★★★★☆',
      text: 'Muy buenas explicaciones.',
      name: 'Laura K.',
      country: 'Francia',
      image: 'images/user3.jpg',
    },
    {
      stars: '★★★★★',
      text: 'He mejorado muchísimo mi inglés en pocas semanas.',
      name: 'María G.',
      country: 'España',
      image: 'images/user1.jpg',
    },
    {
      stars: '★★★★★',
      text: 'Me encanta la metodología.',
      name: 'Alex P.',
      country: 'Italia',
      image: 'images/user2.jpg',
    },
    {
      stars: '★★★★☆',
      text: 'Muy buenas explicaciones.',
      name: 'Laura K.',
      country: 'Francia',
      image: 'images/user3.jpg',
    },
  ];

  ngAfterViewInit() {
    this.initObserver();
    this.initDrag();
  }

  // ================= ANIMATION =================
  initObserver() {
    const cards = document.querySelectorAll('.review-card');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer.observe(card));
  }

  initDrag() {
    const el = this.slider.nativeElement;

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
}
