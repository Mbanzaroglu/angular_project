import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrewMember } from '@shared/models/crew-member.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CrewService } from '@services/crew.service';

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
export class CrewModalComponent implements OnInit {
  crewForm: FormGroup;
  nationalities: string[] = [];
  titles: string[] = [];
  isEditMode: boolean = false; // Düzenleme modunda olup olmadığını belirlemek için

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrewModalComponent>,
    private crewService: CrewService,
    @Inject(MAT_DIALOG_DATA) public data: { crewMember?: CrewMember } // Mevcut CrewMember verisini alıyoruz
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

    // Eğer data.crewMember varsa, düzenleme modundayız
    if (this.data?.crewMember) {
      this.isEditMode = true;
      this.crewForm.patchValue({
        firstName: this.data.crewMember.firstName,
        lastName: this.data.crewMember.lastName,
        nationality: this.data.crewMember.nationality,
        title: this.data.crewMember.title,
        daysOnBoard: this.data.crewMember.daysOnBoard,
        dailyRate: this.data.crewMember.dailyRate,
        currency: this.data.crewMember.currency
      });
    }
  }

  ngOnInit(): void {
    // Nationality listesini al
    this.crewService.getNationalities().subscribe(nationalities => {
      this.nationalities = nationalities;
    });

    // Title listesini al
    this.crewService.getTitles().subscribe(titles => {
      this.titles = titles;
    });
  }

  onSubmit() {
    if (this.crewForm.valid) {
      const formValue = this.crewForm.value;
      const updatedCrew: CrewMember = {
        ...formValue,
        id: this.isEditMode ? this.data.crewMember!.id : Date.now(), // Düzenleme modunda mevcut ID'yi koru, yoksa yeni ID oluştur
        totalIncome: formValue.daysOnBoard * formValue.dailyRate,
        certificates: this.isEditMode ? this.data.crewMember!.certificates : [] // Düzenleme modunda mevcut sertifikaları koru
      };
      this.dialogRef.close(updatedCrew);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}