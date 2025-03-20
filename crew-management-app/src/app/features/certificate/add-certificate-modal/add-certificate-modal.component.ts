import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      certificateType: [null, Validators.required],
      issueDate: ['', Validators.required],
      expiryDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // CertificateService'ten certificateTypes'ı al
    this.certificateService.getCertificateTypes().subscribe(types => {
      this.certificateTypes = types;
    });
  }

  onSubmit() {
    if (this.certificateForm.valid) {
      const formValue = this.certificateForm.value;
      const newCertificate: Certificate = {
        id: Date.now(), // ID burada oluşturuluyor, ancak CertificateService içinde de kontrol edilecek
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