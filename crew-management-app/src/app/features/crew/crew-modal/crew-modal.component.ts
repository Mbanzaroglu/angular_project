import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrewMember } from '@shared/models/crew-member.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-crew-modal',
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
  templateUrl: './crew-modal.component.html',
  styleUrls: ['./crew-modal.component.scss']
})
export class CrewModalComponent {
  crewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrewModalComponent>
  ) {
    this.crewForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationality: ['', Validators.required],
      title: ['', Validators.required],
      daysOnBoard: [0, [Validators.required, Validators.min(0)]],
      dailyRate: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required]
    });
  }

  onSubmit() {
    if (this.crewForm.valid) {
      const newCrew: CrewMember = {
        ...this.crewForm.value,
        id: Date.now(), // Benzersiz bir ID oluştur
        totalIncome: this.crewForm.value.daysOnBoard * this.crewForm.value.dailyRate,
        certificates: []
      };
      this.dialogRef.close(newCrew);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}