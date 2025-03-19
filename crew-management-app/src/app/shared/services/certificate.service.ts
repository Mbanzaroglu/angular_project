import { Injectable } from '@angular/core';
import { Certificate } from '../models/certificate.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private certificates: Certificate[] = [
    { id: 1, name: 'Safety Training', description: 'Basic safety training', issueDate: '2024-01-10', expiryDate: '2026-01-10', crewMemberId: 1 },
    { id: 2, name: 'First Aid', description: 'Medical emergency response', issueDate: '2023-06-15', expiryDate: '2025-06-15', crewMemberId: 2 }
  ];

  getCertificates(): Observable<Certificate[]> {
    return of(this.certificates);
  }

  getCertificatesByCrewMember(crewMemberId: number): Observable<Certificate[]> {
    return of(this.certificates.filter(cert => cert.crewMemberId === crewMemberId));
  }

  addCertificate(newCertificate: Certificate): void {
    this.certificates.push({ ...newCertificate, id: this.certificates.length + 1 });
  }
}
