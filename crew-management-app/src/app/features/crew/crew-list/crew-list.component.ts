import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CrewService } from '@services/crew.service';
import { CrewMember } from '@shared/models/crew-member.model';
import { IncomeSummary } from '@models/income-summary.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { get } from 'node:http';
import { CertificateModalComponent } from 'app/features/certificate/certificate-modal/certificate-modal.component';

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
    TranslateModule,
  ]
})
export class CrewListComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'nationality', 'title', 'daysOnBoard', 'dailyRate', 'currency', 'totalIncome', 'certificates', 'action'];
  
  // Servisten gelen veri Observable olarak tutuluyor
  dataSource$: BehaviorSubject<CrewMember[]> = new BehaviorSubject<CrewMember[]>([]);
  incomeSummary$: Observable<IncomeSummary[]> = new BehaviorSubject<IncomeSummary[]>([]);

  // Varsayılan para birimi
  selectedCurrency: 'USD' | 'EUR' = 'USD';
    // Kur farkı (örnek olarak 1 USD = 0.85 EUR)
  exchangeRate = 0.85;

  constructor(private crewService: CrewService, private dialog: MatDialog, public translate: TranslateService) {
    
  }

  ngOnInit(): void {
    this.crewService.getCrewList().subscribe(data => this.dataSource$.next(data));
    this.incomeSummary$ = this.crewService.getIncomeSummary();
  }

  openCertificateModal(crew: CrewMember) {
    console.log('Opening certificate modal for crew member:', crew);
    this.dialog.open(CertificateModalComponent, {
      width: '1200px',
      data: { crewMemberId: crew.id } // Pass the ID in an object
    });
  }

  // Para birimini dönüştürme fonksiyonu
  convertCurrency(amount: number, fromCurrency: 'USD' | 'EUR', toCurrency: 'USD' | 'EUR'): number {
    if (fromCurrency === toCurrency) {
      return amount; // Aynı para birimi ise dönüşüm yapma
    }
    if (fromCurrency === 'USD' && toCurrency === 'EUR') {
      return amount * this.exchangeRate; // USD'den EUR'ya çevir
    }
    if (fromCurrency === 'EUR' && toCurrency === 'USD') {
      return amount / this.exchangeRate; // EUR'dan USD'ye çevir
    }
    return amount; // Varsayılan olarak dönüşüm yapma
  }

  // Satırın para birimini değiştirme fonksiyonu
  toggleRowCurrency(row: CrewMember) {
    const previousCurrency = row.currency; // Mevcut para birimini sakla
    row.currency = row.currency === 'USD' ? 'EUR' : 'USD'; // Para birimini değiştir
    row.totalIncome = this.convertCurrency(row.totalIncome, previousCurrency as 'USD' | 'EUR', row.currency as 'USD' | 'EUR');
    
    // Veri kaynağını güncelle
    const updatedData = this.dataSource$.getValue().map(item => item.id === row.id ? row : item);
    this.dataSource$.next(updatedData);
  }
    
  deleteCrew(element: CrewMember) {
    this.crewService.deleteCrewMember(element.id);
    this.incomeSummary$ = this.crewService.getIncomeSummary();
  }

  editCrew(element: CrewMember) {
    // Edit fonksiyonu
  }


  navigateToCrewCard(element: CrewMember) {
    // Navigasyon fonksiyonu
  }
}