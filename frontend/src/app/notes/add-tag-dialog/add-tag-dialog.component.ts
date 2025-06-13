import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-tag-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Add New Tag</h2>
    <div mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Tag name</mat-label>
        <input matInput [(ngModel)]="tagName" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onAdd()" [disabled]="!tagName.trim()">Add</button>
    </div>
  `,
  styleUrl: './add-tag-dialog.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class AddTagDialogComponent {
  tagName = '';

  constructor(private dialogRef: MatDialogRef<AddTagDialogComponent>) {}

  onAdd(): void {
    this.dialogRef.close(this.tagName.trim());
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
