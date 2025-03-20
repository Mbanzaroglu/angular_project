import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-certificate-type-form',
  standalone: true,
  templateUrl: './certificate-type-form.component.html',
  styleUrl: './certificate-type-form.component.scss',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule
  ],
})
export class CertificateTypeFormComponent {

}
