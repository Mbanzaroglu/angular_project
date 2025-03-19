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
  displayedColumns: string[] = ['firstName', 'lastName', 'nationality', 'title', 'daysOnBoard', 'dailyRate', 'currency', 'totalIncome', 'action'];
  
  // Servisten gelen veri Observable olarak tutuluyor
  dataSource$: BehaviorSubject<CrewMember[]> = new BehaviorSubject<CrewMember[]>([]);
  incomeSummary$: Observable<IncomeSummary[]> = new BehaviorSubject<IncomeSummary[]>([]);

  constructor(private crewService: CrewService, private dialog: MatDialog, public translate: TranslateService) {}

  ngOnInit(): void {
    this.crewService.getCrewList().subscribe(data => this.dataSource$.next(data));
    this.incomeSummary$ = this.crewService.getIncomeSummary();
  }

  editCrew(element: CrewMember) {
    // Edit fonksiyonu
  }

  deleteCrew(element: CrewMember) {
    this.crewService.deleteCrewMember(element.id);
  }

  navigateToCrewCard(element: CrewMember) {
    // Navigasyon fonksiyonu
  }
}