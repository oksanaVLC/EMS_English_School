import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.html',
  styleUrls: ['./notes.scss'],
})
export class Notes {
  notes: Note[] = [];

  newNote = '';

  addNote() {
    const value = this.newNote.trim();
    if (!value) return;

    this.notes.unshift({
      id: Date.now(),
      content: value,
      createdAt: new Date(),
    });

    this.newNote = '';
  }

  deleteNote(id: number) {
    this.notes = this.notes.filter((n) => n.id !== id);
  }

  trackById(_: number, note: Note) {
    return note.id;
  }
}
