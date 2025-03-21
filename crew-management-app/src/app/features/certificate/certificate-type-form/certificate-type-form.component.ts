import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificateType } from '@models/certificate-type.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-certificate-type-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './certificate-type-form.component.html',
  styleUrls: ['./certificate-type-form.component.scss']
})
export class CertificateTypeModalComponent {
  certificateTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CertificateTypeModalComponent>
  ) {
    this.certificateTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    console.log('Certificate Type Modal Component initialized');
  }

  onSubmit() {
    if (this.certificateTypeForm.valid) {
      const newCertificateType: CertificateType = {
        ...this.certificateTypeForm.value,
        id: Date.now() // Benzersiz bir ID oluştur
      };
      this.dialogRef.close(newCertificateType);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}