import { Injectable } from '@angular/core';
import { Certificate, CertificateDetails } from '../models/certificate.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CertificateType } from '@shared/models/certificate-type.model';
import { CrewService } from './crew.service';
import { CrewMember } from '@shared/models/crew-member.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private certificates: Certificate[] = [
    { id: 1, typeId: 1, issueDate: '2024-01-10', expiryDate: '2026-01-10', crewMemberId: 1 },
    { id: 2, typeId: 2, issueDate: '2023-06-15', expiryDate: '2025-06-15', crewMemberId: 2 },
    { id: 3, typeId: 3, issueDate: '2024-02-20', expiryDate: '2026-02-20', crewMemberId: 3 },
    { id: 4, typeId: 4, issueDate: '2023-11-05', expiryDate: '2025-11-05', crewMemberId: 4 },
    { id: 5, typeId: 5, issueDate: '2023-07-12', expiryDate: '2025-07-12', crewMemberId: 5 },
    { id: 6, typeId: 2, issueDate: '2024-03-01', expiryDate: '2026-03-01', crewMemberId: 1 },
    { id: 7, typeId: 1, issueDate: '2023-08-18', expiryDate: '2025-08-18', crewMemberId: 2 },
    { id: 8, typeId: 3, issueDate: '2024-04-10', expiryDate: '2026-04-10', crewMemberId: 4 },
    { id: 9, typeId: 4, issueDate: '2023-09-21', expiryDate: '2025-09-21', crewMemberId: 3 },
    { id: 10, typeId: 5, issueDate: '2024-01-15', expiryDate: '2026-01-15', crewMemberId: 5 }
  ];

  private certificateTypes: CertificateType[] = [
    { id: 1, name: 'Safety Training', description: 'Basic safety training for crew members.' },
    { id: 2, name: 'First Aid', description: 'First aid training for emergencies.' },
    { id: 3, name: 'Firefighting', description: 'Firefighting training for onboard safety.' },
    { id: 4, name: 'Navigation', description: 'Advanced navigation training for officers.' },
    { id: 5, name: 'Engineering', description: 'Engineering training for technical crew.' }
  ];

  private certificatesSubject = new BehaviorSubject<Certificate[]>(this.certificates);
  certificates$ = this.certificatesSubject.asObservable();

  constructor(private crewService: CrewService) {
    console.log('CertificateService initialized');
  }

  getCertificatesByCrewMember(crewMemberId: number): Observable<CertificateDetails[]> {
    console.log(`Fetching certificates for crew member ID: ${crewMemberId}`);
    const crewCertificates = this.certificates.filter(cert => cert.crewMemberId === crewMemberId);

    const certificatesDetails: CertificateDetails[] = crewCertificates.map(cert => {
      const certType = this.certificateTypes.find(type => type.id === cert.typeId);
      return {
        id: cert.id,
        name: certType ? certType.name : 'Unknown',
        description: certType ? certType.description : 'No description available',
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        crewMemberId: cert.crewMemberId
      };
    });

    console.log(`Certificates for crew member ${crewMemberId}:`, certificatesDetails);
    return of(certificatesDetails);
  }

  getCertificates(): Observable<Certificate[]> {
    console.log('Fetching all certificates...');
    return of(this.certificates);
  }

  addCertificate(newCertificate: Certificate): void {
    newCertificate.id = this.generateNewCertificateId();
    console.log('Adding new certificate with updated ID:', newCertificate);
    this.certificates.push(newCertificate);
    this.certificatesSubject.next(this.certificates);
    console.log('Certificate added. Updated certificates list:', this.certificates);
  }

  deleteCertificate(certificateId: number): void {
    console.log(`Deleting certificate with ID: ${certificateId}`);
    const certificateToDelete = this.certificates.find(cert => cert.id === certificateId);
    if (certificateToDelete) {
      this.certificates = this.certificates.filter(cert => cert.id !== certificateId);
      this.certificatesSubject.next(this.certificates);
      console.log('Certificate deleted. Updated certificates list:', this.certificates);
    } else {
      console.warn(`Certificate with ID ${certificateId} not found.`);
    }
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

  generateNewCertificateId(): number {
    return this.certificates.length > 0 ? this.certificates[this.certificates.length - 1].id + 1 : 1;
  }
}