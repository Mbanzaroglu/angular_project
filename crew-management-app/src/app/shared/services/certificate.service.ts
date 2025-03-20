import { Injectable } from '@angular/core';
import { Certificate } from '../models/certificate.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CertificateType } from '@shared/models/certificate-type.model';
import { CrewService } from './crew.service';
import { CrewMember } from '@shared/models/crew-member.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private certificates: Certificate[] = [
    { id: 1, name: 'Safety Training', description: 'Basic safety training', issueDate: '2024-01-10', expiryDate: '2026-01-10', crewMemberId: 1 },
    { id: 2, name: 'First Aid', description: 'Medical emergency response', issueDate: '2023-06-15', expiryDate: '2025-06-15', crewMemberId: 2 },
    { id: 3, name: 'Firefighting', description: 'Firefighting training for onboard safety.', issueDate: '2024-02-20', expiryDate: '2026-02-20', crewMemberId: 3 },
    { id: 4, name: 'Navigation', description: 'Advanced navigation training for officers.', issueDate: '2023-11-05', expiryDate: '2025-11-05', crewMemberId: 4 },
    { id: 5, name: 'Engineering', description: 'Engineering training for technical crew.', issueDate: '2023-07-12', expiryDate: '2025-07-12', crewMemberId: 5 },
    { id: 6, name: 'First Aid', description: 'First aid training for emergencies.', issueDate: '2024-03-01', expiryDate: '2026-03-01', crewMemberId: 1 },
    { id: 7, name: 'Safety Training', description: 'Basic safety training for crew members.', issueDate: '2023-08-18', expiryDate: '2025-08-18', crewMemberId: 2 },
    { id: 8, name: 'Firefighting', description: 'Firefighting training for onboard safety.', issueDate: '2024-04-10', expiryDate: '2026-04-10', crewMemberId: 4 },
    { id: 9, name: 'Navigation', description: 'Advanced navigation training for officers.', issueDate: '2023-09-21', expiryDate: '2025-09-21', crewMemberId: 3 },
    { id: 10, name: 'Engineering', description: 'Engineering training for technical crew.', issueDate: '2024-01-15', expiryDate: '2026-01-15', crewMemberId: 5 }
  ];

  private certificateTypes: CertificateType[] = [
    { id: 1, name: 'Safety Training', description: 'Basic safety training for crew members.' },
    { id: 2, name: 'First Aid', description: 'First aid training for emergencies.' },
    { id: 3, name: 'Firefighting', description: 'Firefighting training for onboard safety.' },
    { id: 4, name: 'Navigation', description: 'Advanced navigation training for officers.' },
    { id: 5, name: 'Engineering', description: 'Engineering training for technical crew.' }
  ];

  private certificatesAssignedSubject = new BehaviorSubject<boolean>(false);
  certificatesAssigned$ = this.certificatesAssignedSubject.asObservable();

  constructor(private crewService: CrewService) {
    console.log('CertificateService initialized');
    this.assignCertificatesToCrew();
  }

  assignCertificatesToCrew(): void {
    console.log('Assigning certificates to crew members...');
    this.crewService.getCrewList().subscribe(crewList => {
      console.log('Crew list fetched:', crewList);
      crewList.forEach(crewMember => {
        const assignedCertificates = this.certificates
          .filter(cert => cert.crewMemberId === crewMember.id)
          .map(cert => cert.id);
        crewMember.certificates = assignedCertificates;
      });
    });
  }

  getCertificatesByCrewMember(crewMemberId: number): Observable<Certificate[]> {
    console.log(`Fetching certificates for crew member ID: ${crewMemberId}`);
    const crewCertificates = this.certificates.filter(cert => cert.crewMemberId === crewMemberId);
    console.log(`Certificates for crew member ${crewMemberId}:`, crewCertificates);
    return of(crewCertificates);
  }

  getCertificates(): Observable<Certificate[]> {
    console.log('Fetching all certificates...');
    return of(this.certificates);
  }

  addCertificate(newCertificate: Certificate): void {
    console.log('Adding new certificate:', newCertificate);
    this.certificates.push(newCertificate);
    console.log('Certificate added. Updated certificates list:', this.certificates);

    // CrewMember'ın certificates array'ini güncelle
    this.crewService.getCrewList().subscribe(crewList => {
      const crewMember = crewList.find(member => member.id === newCertificate.crewMemberId);
      if (crewMember) {
        crewMember.certificates = [
          ...crewMember.certificates,
          newCertificate.id
        ];
        // CrewService'in crewListSubject'ini güncelle
        this.crewService.updateCrewList(crewList);
      }
    });

    // Sertifikaların atandığını bildir
    this.certificatesAssignedSubject.next(true);
  }

  addCertificateType(newCertificateType: CertificateType): void {
    console.log('Adding new certificate type:', newCertificateType);
    this.certificateTypes.push(newCertificateType);
    console.log('Certificate type added. Updated certificate types list:', this.certificateTypes);
  }

  getCertificateTypes(): Observable<CertificateType[]> {
    console.log('Fetching all certificate types...');
    return of(this.certificateTypes);
  }
}