import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { NotesFormComponent, NoteFormValue } from '../notes-form/notes-form.component';
import {AddTagDialogComponent} from '../add-tag-dialog/add-tag-dialog.component';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatChipSet,
    MatChip,
    MatIcon,
    MatDialogModule,
    MatToolbar,
  ],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css',
})
export class NotesListComponent {
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly email = localStorage.getItem('user-email')!;
  readonly username = localStorage.getItem('username')!;
  private nextId = 1;
  newTag = '';

  readonly allUserTags = signal<string[]>([]);
  readonly notes = signal<Note[]>([]);
  readonly search = signal('');
  readonly tagFilter = signal<string | null>(null);

  readonly filteredNotes = computed(() => {
    return this.notes().filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(this.search().toLowerCase()) ||
        note.content.toLowerCase().includes(this.search().toLowerCase());

      const matchesTag = this.tagFilter() ? note.tags.includes(this.tagFilter()!) : true;

      return matchesSearch && matchesTag;
    });
  });

  readonly allTags = computed(() => {
    const tagSet = new Set<string>();
    this.notes().forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  });


  constructor() {
    this.loadNotes();
    this.loadTags();
  }

  loadNotes(): void {
    this.http.get<Note[]>(`https://mynotes-backend-03ya.onrender.com/api/notes/${this.email}`).subscribe(notes => {
      this.notes.set(notes);
      this.nextId = Math.max(0, ...notes.map(n => n.id)) + 1;
    });
  }

  loadTags(): void {
    this.http.get<string[]>(`https://mynotes-backend-03ya.onrender.com/api/notes/${this.email}/tags`)
      .subscribe(tags => this.allUserTags.set(tags));
  }

  openAddNoteDialog(): void {
    const ref = this.dialog.open(NotesFormComponent, {
      width: '500px',
      data: { note: null, tags: this.allUserTags() },
    });


    ref.afterClosed().subscribe((result: NoteFormValue | undefined) => {
      if (result) {
        const newNote: Note = {
          id: this.nextId++,
          ...result,
        };

        this.http.post<Note>(`https://mynotes-backend-03ya.onrender.com/api/notes`, {
          email: this.email,
          ...newNote,
        }).subscribe(created => {
          this.notes.update(notes => [...notes, created]);
        });
      }
    });
  }

  openAddTagDialog(): void {
    const ref = this.dialog.open(AddTagDialogComponent, {
      width: '300px',
    });

    ref.afterClosed().subscribe((tag: string | undefined) => {
      if (!tag) return;

      this.http.post(`https://mynotes-backend-03ya.onrender.com/api/notes/${this.email}/tags`, { tag })
        .subscribe(() => {
          this.loadTags();
        });
    });
  }
  removeNote(id: number): void {
    this.http.delete(`https://mynotes-backend-03ya.onrender.com/api/notes/${this.email}/${id}`).subscribe(() => {
      this.notes.update(notes => notes.filter(n => n.id !== id));
    });
  }

  clearTagFilter(): void {
    this.tagFilter.set(null);
  }

  setTagFilter(tag: string): void {
    this.tagFilter.set(tag);
  }

  logout(): void {
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  openEditNoteDialog(note: Note): void {
    const ref = this.dialog.open(NotesFormComponent, {
      width: '500px',
      data: { note, tags: this.allUserTags() },
    });

    ref.afterClosed().subscribe((result: NoteFormValue | undefined) => {
      if (result) {
        const updatedNote: Note = {
          ...note,
          ...result,
        };

        this.http.put<Note>(`https://mynotes-backend-03ya.onrender.com/api/notes/${this.email}/${note.id}`, updatedNote)
          .subscribe((saved) => {
            this.notes.update(notes =>
              notes.map(n => (n.id === note.id ? saved : n))
            );
          });
      }
    });
  }

}
