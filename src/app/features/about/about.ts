import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-about',
  imports: [Button, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
