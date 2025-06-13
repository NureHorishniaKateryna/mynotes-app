import { Routes } from '@angular/router';
import {RegisterComponent} from './auth/register/register.component';
import {NotesListComponent} from './notes/notes-list/notes-list.component';
import {LoginComponent} from './auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'notes',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'notes',
    component: NotesListComponent,
  },
  {
    path: '**',
    redirectTo: 'notes',
  },
];
