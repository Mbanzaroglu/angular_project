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
import { Currency, getCurrencyDetailById, getCurrencyCodeById } from '@shared/enums/currency.enum';

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
  currencies: Currency[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrewModalComponent>,
    private crewService: CrewService,
    @Inject(MAT_DIALOG_DATA) public data: { crewMember?: CrewMember }
  ) {
    this.crewForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationality: ['', Validators.required],
      title: ['', Validators.required],
      daysOnBoard: [0, [Validators.required, Validators.min(0)]],
      dailyRate: [0, [Validators.required, Validators.min(0)]],
      currency: [Currency.USD, Validators.required] // Varsayılan olarak Currency.USD
    });

    if (this.data?.crewMember) {
      this.isEditMode = true;
      this.crewForm.patchValue({
        firstName: this.data.crewMember.firstName,
        lastName: this.data.crewMember.lastName,
        nationality: this.data.crewMember.nationality,
        title: this.data.crewMember.title,
        daysOnBoard: this.data.crewMember.daysOnBoard,
        dailyRate: this.data.crewMember.dailyRate,
        currency: this.data.crewMember.currency // Currency enum’ı olarak geliyor
      });
    }
  }

  ngOnInit(): void {
    this.crewService.getNationalities().subscribe(nationalities => {
      this.nationalities = nationalities;
    });

    this.crewService.getTitles().subscribe(titles => {
      this.titles = titles;
    });

    this.crewService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
    });
  }

  onSubmit() {
    if (this.crewForm.valid) {
      const formValue = this.crewForm.value;
      const updatedCrew: CrewMember = {
        ...formValue,
        id: this.isEditMode ? this.data.crewMember!.id : Date.now(),
        totalIncome: formValue.daysOnBoard * formValue.dailyRate,
        certificates: this.isEditMode ? this.data.crewMember!.certificates : [],
        currency: formValue.currency // Currency enum’ı olarak zaten doğru tipte
      };
      this.dialogRef.close(updatedCrew);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getCurrencyDetail(currency: Currency) {
    return getCurrencyDetailById(currency);
  }
}