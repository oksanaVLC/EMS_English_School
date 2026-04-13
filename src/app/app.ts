import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { Navbar } from './shared/components/navbar/navbar';
import { Pagination } from './shared/components/pagination/pagination';
import { Tags } from './shared/components/tags/tags';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Header, Footer, Tags, Pagination],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('EMS_Frontend_Angular');
}
