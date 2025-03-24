import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CertificateDetails } from '@models/certificate.model';
import { CertificateService } from '@services/certificate.service';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-certificate-modal',
  standalone: true,
  templateUrl: './certificate-modal.component.html',
  styleUrls: ['./certificate-modal.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    TranslateModule,
  ]
})
export class CertificateModalComponent implements OnInit {
  @Input() crewMemberId: number | undefined;
  @Input() isDialog: boolean | undefined; // Artık opsiyonel

  displayedColumns: string[] = ['name', 'description', 'issueDate', 'expiryDate'];
  dataSource = new MatTableDataSource<CertificateDetails>();

  constructor(
    private certificateService: CertificateService,
    public translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { crewMemberId: number, isDialog?: boolean },
    @Optional() private dialogRef?: MatDialogRef<CertificateModalComponent>
  ) {
    // isDialog'u otomatik belirle
    this.isDialog = this.dialogRef !== undefined ? true : (this.data?.isDialog ?? false);
    console.log('CertificateModalComponent initialized with data:', this.data, 'isDialog:', this.isDialog);
  }

  ngOnInit(): void {
    console.log('CertificateModalComponent initialized with crew member ID:', this.crewMemberId, this.data?.crewMemberId, 'isDialog:', this.isDialog);
    const memberId = this.isDialog ? this.data?.crewMemberId : this.crewMemberId;
    console.log('Crew member ID to load certificates:', memberId);
    if (memberId) {
      this.loadCertificates(memberId);
    } else {
      console.error('Crew member ID is undefined');
    }
  }

  loadCertificates(crewMemberId: number): void {
    console.log('Loading certificates for crew member ID:', crewMemberId);
    this.certificateService.getCertificatesByCrewMember(crewMemberId).subscribe({
      next: (certificates) => {
        console.log('Certificates loaded:', certificates);
        this.dataSource.data = certificates;
      },
      error: (err) => {
        console.error('Error loading certificates:', err);
        this.dataSource.data = [];
      }
    });
  }

  closeModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}