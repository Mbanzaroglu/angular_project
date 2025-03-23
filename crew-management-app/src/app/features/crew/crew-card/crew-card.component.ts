import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CrewService } from '@services/crew.service';
import { CertificateService } from '@services/certificate.service';
import { MatListModule } from '@angular/material/list';
import { CrewMember } from '@shared/models/crew-member.model';
import { CertificateDetails } from '@models/certificate.model';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCertificateModalComponent } from '../../certificate/add-certificate-modal/add-certificate-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { Currency, getCurrencyDetailById } from '@shared/enums/currency.enum';

@Component({
  selector: 'app-crew-card',
  standalone: true,
  templateUrl: './crew-card.component.html',
  styleUrls: ['./crew-card.component.scss'],
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    TranslateModule
  ]
})
export class CrewCardComponent implements OnInit {
  id: number = 0;
  crewMember: CrewMember | undefined;
  crewCertificates: CertificateDetails[] = [];
  displayedColumns: string[] = ['name', 'description', 'issueDate', 'expiryDate'];
  dataSource = new MatTableDataSource<CertificateDetails>();
  selectedTabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private crewService: CrewService,
    private certificateService: CertificateService,
    private router: Router,
    private dialog: MatDialog
  ) {
    console.log('CrewCardComponent constructor called');
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = paramId ? +paramId : 0;

    this.crewService.getCrewList().subscribe(crewList => {
      this.crewMember = crewList.find(member => member.id === this.id);
      console.log('Crew Member:', this.crewMember);
    });

    this.loadCertificates();
  }

  loadCertificates(): void {
    console.log('Loading certificates for crew member ID:', this.id);
    this.certificateService.getCertificatesByCrewMember(this.id).subscribe(certificates => {
      this.crewCertificates = certificates;
      this.dataSource.data = certificates;
      console.log('Crew Certificates:', this.crewCertificates);
    });
    console.log('Certificates loaded');
  }

  navigateToCrewList(): void {
    this.router.navigate(['/crew-list']);
  }

  openAddCertificateModal(): void {
    const dialogRef = this.dialog.open(AddCertificateModalComponent, {
      width: '600px',
      data: { crewMemberId: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCertificates();
      }
    });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    console.log('Selected tab index:', this.selectedTabIndex);
  }

  getCurrencySymbol(currency?: Currency): string {
    if (!currency) return '';
    return this.getCurrencyDetail(currency).symbol;
  }

  getCurrencyName(currency?: Currency): string {
    if (!currency) return '';
    return this.getCurrencyDetail(currency).name;
  }

  getCurrencyDetail(currency: Currency) {
    return getCurrencyDetailById(currency);
  }
}