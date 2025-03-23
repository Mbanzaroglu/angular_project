import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CertificateService } from '@services/certificate.service';
import { CertificateType } from '@shared/models/certificate-type.model';
import { Certificate } from '@models/certificate.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-certificate-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './add-certificate-modal.component.html',
  styleUrls: ['./add-certificate-modal.component.scss']
})
export class AddCertificateModalComponent implements OnInit {
  certificateForm: FormGroup;
  certificateTypes: CertificateType[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCertificateModalComponent>,
    private certificateService: CertificateService,
    @Inject(MAT_DIALOG_DATA) public data: { crewMemberId: number }
  ) {
    this.certificateForm = this.fb.group({
      certificateType: ['', Validators.required], // typeId’yi tutacak
      issueDate: ['', Validators.required],
      expiryDate: ['', Validators.required]
    }, {
      validators: [this.dateValidator, this.expiryDateAfterTodayValidator]
    });
  }

  ngOnInit(): void {
    // CertificateService’ten certificateTypes’ı al
    this.certificateService.getCertificateTypes().subscribe(types => {
      this.certificateTypes = types;
    });

    // Form değişikliklerini dinleyerek doğrulama hatalarını güncelle
    this.certificateForm.valueChanges.subscribe(() => {
      this.certificateForm.updateValueAndValidity();
    });
  }

  // Özel doğrulayıcı: expiryDate, issueDate’ten büyük olmalı
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const issueDate = control.get('issueDate')?.value;
    const expiryDate = control.get('expiryDate')?.value;

    if (issueDate && expiryDate) {
      const issue = new Date(issueDate);
      const expiry = new Date(expiryDate);

      if (expiry <= issue) {
        control.get('expiryDate')?.setErrors({ expiryBeforeIssue: true });
        return { expiryBeforeIssue: true };
      } else {
        // Hata yoksa mevcut hataları temizle
        const currentErrors = control.get('expiryDate')?.errors;
        if (currentErrors && currentErrors['expiryBeforeIssue']) {
          delete currentErrors['expiryBeforeIssue'];
          control.get('expiryDate')?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
        }
      }
    }
    return null;
  }

  // Özel doğrulayıcı: expiryDate, bugünden büyük olmalı
  expiryDateAfterTodayValidator(control: AbstractControl): ValidationErrors | null {
    const expiryDate = control.get('expiryDate')?.value;

    if (expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Saat farkını ortadan kaldırmak için
      const expiry = new Date(expiryDate);

      if (expiry <= today) {
        control.get('expiryDate')?.setErrors({ expiryBeforeToday: true });
        return { expiryBeforeToday: true };
      } else {
        // Hata yoksa mevcut hataları temizle
        const currentErrors = control.get('expiryDate')?.errors;
        if (currentErrors && currentErrors['expiryBeforeToday']) {
          delete currentErrors['expiryBeforeToday'];
          control.get('expiryDate')?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
        }
      }
    }
    return null;
  }

  onSubmit() {
    if (this.certificateForm.valid) {
      const formValue = this.certificateForm.value;
      const newCertificate: Certificate = {
        id: this.certificateService.generateNewCertificateId(),
        name: formValue.certificateType.name,
        description: formValue.certificateType.description,
        issueDate: formValue.issueDate,
        expiryDate: formValue.expiryDate,
        crewMemberId: this.data.crewMemberId
      };
      this.dialogRef.close(newCertificate);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}