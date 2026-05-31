import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Note {
  id: number;
  title: string;
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
export class Notes implements OnInit {
  notes: Note[] = [];

  newNote = '';
  newTitle = '';

  private storageKey = 'user_notes';

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convertir las fechas de string a Date
        this.notes = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        }));
      } catch (e) {
        console.error('Error loading notes:', e);
        this.notes = [];
      }
    }
  }

  saveNotes(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }

  addNote() {
    const title = this.newTitle.trim();
    const content = this.newNote.trim();

    if (!title || !content) return;

    this.notes.unshift({
      id: Date.now(),
      title,
      content,
      createdAt: new Date(),
    });

    this.saveNotes();

    this.newTitle = '';
    this.newNote = '';
  }

  deleteNote(id: number) {
    this.notes = this.notes.filter((n) => n.id !== id);
    this.saveNotes();
  }

  printNote(note: Note) {
    const printWindow = window.open('', '_blank');

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Nota</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              margin-bottom: 20px;
            }
            .date {
              color: #666;
              margin-bottom: 30px;
              font-size: 14px;
            }
            .content {
              white-space: pre-wrap;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <h1>${this.escapeHtml(note.title)}</h1>
          <div class="date">
            ${new Date(note.createdAt).toLocaleString()}
          </div>
          <div class="content">
            ${this.escapeHtml(note.content)}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  //  Seguridad: escapar HTML para evitar inyección
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  trackById(_: number, note: Note) {
    return note.id;
  }
}
