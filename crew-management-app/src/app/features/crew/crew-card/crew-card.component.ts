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
import { CertificateModalComponent } from '@shared/components/certificate-modal/certificate-modal.component';
import { MatButtonModule } from '@angular/material/button';
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
    TranslateModule,
    CertificateModalComponent
  ]
})
export class CrewCardComponent implements OnInit {
  id: number = 0;
  crewMember: CrewMember | undefined;
  crewCertificates: CertificateDetails[] = [];
  hasCertificates: boolean = false;
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
    console.log('CrewCardComponent initialized with ID:', this.id);

    this.loadCrewMember();
    this.loadCertificates();
  }

  loadCrewMember(): void {
    this.crewService.getCrewList().subscribe({
      next: (crewList) => {
        this.crewMember = crewList.find(member => member.id === this.id);
        if (!this.crewMember) {
          console.error('Crew member not found for ID:', this.id);
        } else {
          console.log('Crew member loaded:', this.crewMember);
        }
      },
      error: (err) => {
        console.error('Error loading crew list:', err);
      }
    });
  }

  loadCertificates(): void {
    this.certificateService.getCertificatesByCrewMember(this.id).subscribe({
      next: (certificates) => {
        this.crewCertificates = certificates;
        this.hasCertificates = certificates.length > 0;
        console.log('Certificates loaded for crew member ID:', this.id, this.crewCertificates);
      },
      error: (err) => {
        console.error('Error loading certificates:', err);
        this.crewCertificates = [];
        this.hasCertificates = false;
      }
    });
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