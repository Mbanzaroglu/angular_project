import { Component, OnInit } from '@angular/core';
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
import { Observable, BehaviorSubject } from 'rxjs';
import { CertificateModalComponent } from 'app/features/certificate/certificate-modal/certificate-modal.component';
import { Router, RouterModule } from '@angular/router';
import { CrewModalComponent } from '../crew-modal/crew-modal.component';
import { CertificateService } from '@shared/services/certificate.service';
import { CertificateTypeModalComponent } from 'app/features/certificate/certificate-type-form/certificate-type-form.component';

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
export class CrewListComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'nationality', 'title', 'daysOnBoard', 'dailyRate', 'currency', 'totalIncome', 'certificates', 'action'];

  dataSource$: BehaviorSubject<CrewMember[]> = new BehaviorSubject<CrewMember[]>([]);
  incomeSummary$: Observable<IncomeSummary[]> = new BehaviorSubject<IncomeSummary[]>([]);

  // CrewService’ten gelen para birimleri
  currencies: string[] = [];

  // Kur farkı (örneğin, 1 USD = 0.85 EUR)
  exchangeRate = 0.85;

  // Orijinal dailyRate değerlerini saklamak için bir Map
  private originalDailyRates: Map<number, number> = new Map();

  constructor(
    private crewService: CrewService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private router: Router,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    // Crew listesini yükle ve orijinal dailyRate değerlerini sakla
    this.crewService.getCrewList().subscribe(data => {
      data.forEach(crew => {
        // Orijinal dailyRate değerini sakla
        this.originalDailyRates.set(crew.id, crew.dailyRate);
        // totalIncome’u güncelle (başlangıçta orijinal değer)
        crew.totalIncome = crew.daysOnBoard * crew.dailyRate;
      });
      this.dataSource$.next(data);
    });

    this.incomeSummary$ = this.crewService.getIncomeSummary();

    // Para birimlerini CrewService’ten al
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

  // Para birimini dönüştürme fonksiyonu
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    if (fromCurrency === 'USD' && toCurrency === 'EUR') {
      return amount * this.exchangeRate;
    }
    if (fromCurrency === 'EUR' && toCurrency === 'USD') {
      return amount / this.exchangeRate;
    }
    return amount; // Bilinmeyen para birimi durumunda dönüşüm yapma
  }

  // Para birimini değiştirme fonksiyonu
  changeCurrency(row: CrewMember, newCurrency: string) {
    const previousCurrency = row.currency;
    row.currency = newCurrency;

    // Orijinal dailyRate değerini al
    const originalDailyRate = this.originalDailyRates.get(row.id) || row.dailyRate;

    // dailyRate’i orijinal değerden yeni para birimine dönüştür
    row.dailyRate = this.convertCurrency(originalDailyRate, 'USD', row.currency);

    // totalIncome’u orijinal değerden hesapla ve yeni para birimine dönüştür
    const originalTotalIncome = row.daysOnBoard * originalDailyRate;
    row.totalIncome = this.convertCurrency(originalTotalIncome, 'USD', row.currency);

    // dataSource$’ı güncelle
    const updatedData = this.dataSource$.getValue().map(item => (item.id === row.id ? row : item));
    this.dataSource$.next(updatedData);

    // Income summary’yi güncelle
    this.incomeSummary$ = this.crewService.getIncomeSummary();
  }

  deleteCrew(element: CrewMember) {
    this.crewService.deleteCrewMember(element.id);
    this.originalDailyRates.delete(element.id); // Silinen üyenin orijinal dailyRate’ini kaldır
    this.incomeSummary$ = this.crewService.getIncomeSummary();
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
        // Güncellenen üyenin orijinal dailyRate’ini güncelle
        this.originalDailyRates.set(result.id, result.dailyRate);
        result.totalIncome = result.daysOnBoard * result.dailyRate;
        this.crewService.updateCrewList(updatedCrewList);
        this.incomeSummary$ = this.crewService.getIncomeSummary();
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

  openAddCrewModal() {
    const dialogRef = this.dialog.open(CrewModalComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crewService.addCrewMember(result);
        // Yeni üyenin orijinal dailyRate’ini sakla
        this.originalDailyRates.set(result.id, result.dailyRate);
        result.totalIncome = result.daysOnBoard * result.dailyRate;
        this.incomeSummary$ = this.crewService.getIncomeSummary();
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
        this.incomeSummary$ = this.crewService.getIncomeSummary();
      }
    });
  }
}