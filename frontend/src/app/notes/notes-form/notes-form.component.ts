import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle} from '@angular/material/dialog';
import {MatCheckbox} from '@angular/material/checkbox';

export interface NoteFormValue {
  title: string;
  content: string;
  tags: string[];
}

export interface NoteFormData {
  note: NoteFormValue | null;
  tags: string[];
}

@Component({
  selector: 'app-notes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatCheckbox,
  ],
  templateUrl: './notes-form.component.html',
  styleUrl: './notes-form.component.css',
})
export class NotesFormComponent {
  readonly form: FormGroup;
  availableTags: string[] = [];
  selectedTags: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<NotesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoteFormData
  ) {
    this.availableTags = data.tags;

    const note = data.note;
    this.form = this.fb.group({
      title: [note?.title ?? '', Validators.required],
      content: [note?.content ?? '', Validators.required],
    });

    this.selectedTags = note?.tags ?? [];

    if (this.data) {
      this.form.patchValue({
        title: this.data.note?.title,
        content: this.data.note?.content,
        tags: this.data.tags.join(', '),
      });
    }
  }

  toggleTag(tag: string, checked: boolean): void {
    if (checked) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { title, content } = this.form.value;

    this.dialogRef.close({
      title,
      content,
      tags: this.selectedTags,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
