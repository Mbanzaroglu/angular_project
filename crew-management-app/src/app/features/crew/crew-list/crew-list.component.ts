import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

// Gelir Özeti Tipi Tanımlama
interface IncomeSummary {
  currency: string;
  totalIncome: number;
}

// Crew Tipi Tanımlama
interface Crew {
  firstName: string;
  lastName: string;
  nationality: string;
  title: string;
  daysOnBoard: number;
  dailyRate: number;
  currency: string;
  totalIncome: number;
}

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
export class CrewListComponent {
  displayedColumns: string[] = ['firstName', 'lastName', 'nationality', 'title', 'daysOnBoard', 'dailyRate', 'currency', 'totalIncome', 'action'];
  dataSource: Crew[] = [
    { firstName: 'John', lastName: 'Doe', nationality: 'American', title: 'Captain', daysOnBoard: 120, dailyRate: 300, currency: 'USD', totalIncome: 36000 },
    { firstName: 'Jane', lastName: 'Smith', nationality: 'British', title: 'Engineer', daysOnBoard: 90, dailyRate: 250, currency: 'USD', totalIncome: 22500 },
    { firstName: 'Carlos', lastName: 'Gomez', nationality: 'Spanish', title: 'Cooker', daysOnBoard: 150, dailyRate: 200, currency: 'EUR', totalIncome: 30000 },
    { firstName: 'Anna', lastName: 'Ivanova', nationality: 'Russian', title: 'Mechanic', daysOnBoard: 110, dailyRate: 220, currency: 'EUR', totalIncome: 24200 },
    { firstName: 'Liu', lastName: 'Wei', nationality: 'Chinese', title: 'Deckhand', daysOnBoard: 130, dailyRate: 180, currency: 'USD', totalIncome: 23400 }
  ];
  incomeSummary: IncomeSummary[] = [
    { currency: 'USD', totalIncome: 81900 },
    { currency: 'EUR', totalIncome: 54200 }
  ];

  constructor(private dialog: MatDialog, public translate: TranslateService) {}

  editCrew(element: any) {
    // Edit fonksiyonu
  }

  deleteCrew(element: any) {
    // Delete fonksiyonu
  }

  navigateToCrewCard(element: any) {
    // Navigasyon fonksiyonu
  }
}
