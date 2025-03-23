import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CrewService } from '@services/crew.service';
import { CrewMember } from '@shared/models/crew-member.model';
import { IncomeSummary } from '@models/income-summary.model';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { CertificateModalComponent } from 'app/features/certificate/certificate-modal/certificate-modal.component';
import { Router, RouterModule } from '@angular/router';
import { CrewModalComponent } from '../crew-modal/crew-modal.component';
import { CertificateService } from '@shared/services/certificate.service';
import { CertificateTypeModalComponent } from 'app/features/certificate/certificate-type-form/certificate-type-form.component';
import { Currency, getCurrencyDetailById, getCurrencyCodeById } from '@shared/enums/currency.enum';

@Component({
  selector: 'app-crew-list',
  standalone: true,
  templateUrl: './crew-list.component.html',
  styleUrls: ['./crew-list.component.scss'],
  imports: [
    CommonModule,
    MatMenuModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    RouterModule
  ]
})
export class CrewListComponent implements OnInit{
  displayedColumns: string[] = ['firstName', 'lastName', 'nationality', 'title', 'daysOnBoard', 'dailyRate', 'currency', 'totalIncome', 'certificates', 'action'];

  dataSource$: BehaviorSubject<CrewMember[]> = new BehaviorSubject<CrewMember[]>([]);
  incomeSummary$: Observable<IncomeSummary[]> = new BehaviorSubject<IncomeSummary[]>([]);

  currencies: Currency[] = [];

  exchangeRate = 0.85;

  private crewListSubscription: Subscription | undefined;

  constructor(
    private crewService: CrewService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private router: Router,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    // crewList$’a abone ol ve dataSource$’ı güncelle
    this.crewListSubscription = this.crewService.getCrewList().subscribe(data => {
      this.dataSource$.next(data);
    });

    this.incomeSummary$ = this.crewService.getIncomeSummary();

    this.crewService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
    });
  }

  openCertificateModal(crew: CrewMember) {
    console.log('Opening certificate modal for crew member:', crew);
    this.dialog.open(CertificateModalComponent, {
      width: '1500px',
      data: { crewMemberId: crew.id }
    });
  }

  convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    const fromCode = getCurrencyCodeById(fromCurrency);
    const toCode = getCurrencyCodeById(toCurrency);
    if (fromCode === 'USD' && toCode === 'EUR') {
      return amount * this.exchangeRate;
    }
    if (fromCode === 'EUR' && toCode === 'USD') {
      return amount / this.exchangeRate;
    }
    return amount;
  }

  changeCurrency(row: CrewMember, newCurrency: Currency) {
    const originalDailyRateData = this.crewService.getOriginalDailyRate(row.id);
    const originalTotalIncomeData = this.crewService.getOriginalTotalIncome(row.id);

    const originalDailyRate = originalDailyRateData ? originalDailyRateData.value : row.dailyRate;
    const originalTotalIncome = originalTotalIncomeData ? originalTotalIncomeData.value : row.totalIncome;

    const originalDailyRateCurrency = originalDailyRateData ? originalDailyRateData.currency : row.currency;
    const originalTotalIncomeCurrency = originalTotalIncomeData ? originalTotalIncomeData.currency : row.currency;

    row.currency = newCurrency;
    row.dailyRate = this.convertCurrency(originalDailyRate, originalDailyRateCurrency, row.currency);
    row.totalIncome = this.convertCurrency(originalTotalIncome, originalTotalIncomeCurrency, row.currency);

    const updatedData = this.dataSource$.getValue().map(item => (item.id === row.id ? { ...item, ...row } : item));
    this.dataSource$.next(updatedData);
    this.crewService.updateCrewList(updatedData);
  }

  deleteCrew(element: CrewMember) {
    this.crewService.deleteCrewMember(element.id);
    // incomeSummary$ zaten güncellenecek, manuel güncelleme yapmaya gerek yok
  }

  editCrew(element: CrewMember) {
    const dialogRef = this.dialog.open(CrewModalComponent, {
      width: '600px',
      data: { crewMember: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedCrewList = this.dataSource$.getValue().map(crew =>
          crew.id === result.id ? result : crew
        );
        this.crewService.updateCrewList(updatedCrewList);
      }
    });
  }

  openAddCrewModal() {
    const dialogRef = this.dialog.open(CrewModalComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crewService.addCrewMember(result);
      }
    });
  }

  navigateToCrewCard(element: CrewMember) {
    console.log('Navigating to crew-card with ID:', element.id);
    this.router.navigate(['/crew', 'crew-card', element.id]).then(success => {
      console.log('Navigation success:', success);
      if (!success) {
        console.error('Navigation failed! Check route configuration.');
      }
    });
  }

  openAddCertificateTypeModal() {
    console.log('Opening Add Certificate Type Modal...');
    const dialogRef = this.dialog.open(CertificateTypeModalComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Add Certificate Type Modal closed. Result:', result);
      if (result) {
        console.log('Adding new certificate type:', result);
        this.certificateService.addCertificateType(result);
      }
    });
  }

  getCurrencyDetail(currency: Currency) {
    return getCurrencyDetailById(currency);
  }
}