import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class Notes {
  notes: Note[] = [];

  newNote = '';
  newTitle = '';

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

    this.newTitle = '';
    this.newNote = '';
  }

  deleteNote(id: number) {
    this.notes = this.notes.filter((n) => n.id !== id);
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

        <h1>${note.title}</h1>

          <div class="date">
            ${new Date(note.createdAt).toLocaleString()}
          </div>

          <div class="content">
            ${note.content}
          </div>

        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();
  }

  trackById(_: number, note: Note) {
    return note.id;
  }
}
