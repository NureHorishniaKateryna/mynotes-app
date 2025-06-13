import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly form: FormGroup;
  readonly router = inject(Router);
  readonly http = inject(HttpClient);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.http.post<any>('https://mynotes-backend-03ya.onrender.com/api/auth/login', this.form.value).subscribe({
      next: (res) => {
        console.log("RES", res)
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('user-email', res.user.email);
        this.router.navigate(['/notes']);
      },
      error: () => alert('Invalid email or password'),
    });
  }
}
