import { Injectable } from '@angular/core';
import { CertificateType } from '../models/certificate-type.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private certificateTypes: CertificateType[] = [
    { id: 1, name: 'Safety Training', description: 'Basic safety training required for all crew members' },
    { id: 2, name: 'Medical Training', description: 'First aid and emergency response' }
  ];

  getCertificateTypes(): Observable<CertificateType[]> {
    return of(this.certificateTypes);
  }

  addCertificateType(newType: CertificateType): void {
    this.certificateTypes.push({ ...newType, id: this.certificateTypes.length + 1 });
  }
}
