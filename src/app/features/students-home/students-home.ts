import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-students-home',
  imports: [RouterLink, Button],
  templateUrl: './students-home.html',
  styleUrl: './students-home.scss',
})
export class StudentsHome {}
