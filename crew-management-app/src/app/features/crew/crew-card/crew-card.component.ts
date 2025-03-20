// crew-card.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CrewService } from '@services/crew.service';
import { CertificateService } from '@services/certificate.service';
import { MatListModule } from '@angular/material/list';
import { CrewMember } from '@shared/models/crew-member.model';
import { Certificate } from '@models/certificate.model';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
    // Başka Material modülleri (MatFormField, MatInput vb.) ekleyebilirsiniz
  ]
})
export class CrewCardComponent implements OnInit {
  id: number = 0;
  crewMember: CrewMember | undefined;
  crewCertificates: Certificate[] = [];

  constructor(
    private route: ActivatedRoute,
    private crewService: CrewService,
    private certificateService: CertificateService,
    private router: Router,
    private translate: TranslateModule
  ) {
    console.log('CrewCardComponent constructor called');
  }

  ngOnInit(): void {
    // URL'deki ID'yi al
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = paramId ? +paramId : 0;

    // Crew bilgilerini getir
    this.crewService.getCrewList().subscribe(crewList => {
      this.crewMember = crewList.find(member => member.id === this.id);
      console.log('Crew Member:', this.crewMember);
    });

    // Sertifikaları getir
    this.certificateService.getCertificatesByCrewMember(this.id).subscribe(certificates => {
      this.crewCertificates = certificates;
      console.log('Crew Certificates:', this.crewCertificates);
    });
  }
  navigateToCrewList(): void {
    this.router.navigate(['/crew-list']);
  }
}
