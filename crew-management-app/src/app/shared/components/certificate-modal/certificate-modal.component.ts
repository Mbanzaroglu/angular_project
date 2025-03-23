import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CertificateDetails } from '@models/certificate.model';
import { CertificateService } from '@services/certificate.service';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CrewMember } from '@shared/models/crew-member.model';

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
  displayedColumns: string[] = ['name', 'description', 'issueDate', 'expiryDate'];
  dataSource = new MatTableDataSource<CertificateDetails>();

  constructor(
    public dialogRef: MatDialogRef<CertificateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { crewMemberId: number },
    private certificateService: CertificateService,
    public translate: TranslateService
  ) {
    console.log('Certificate Modal Component initialized', this.data);
  }

  ngOnInit(): void {
    console.log('Full Received Data:', this.data.crewMemberId);
    this.certificateService.getCertificatesByCrewMember(this.data.crewMemberId).subscribe(certificates => {
      this.dataSource.data = certificates;
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}