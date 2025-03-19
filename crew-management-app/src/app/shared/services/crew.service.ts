import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CrewMember } from '@shared/models/crew-member.model';
import { IncomeSummary } from '@models/income-summary.model';

@Injectable({
  providedIn: 'root'
})
export class CrewService {
  // Örnek mürettebat verisi
  private crewList: CrewMember[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', nationality: 'American', title: 'Captain', daysOnBoard: 120, dailyRate: 300, currency: 'USD', totalIncome: 36000, certificates: [] },
    { id: 2, firstName: 'Jane', lastName: 'Smith', nationality: 'British', title: 'Engineer', daysOnBoard: 90, dailyRate: 250, currency: 'USD', totalIncome: 22500, certificates: [] },
    { id: 3, firstName: 'Carlos', lastName: 'Gomez', nationality: 'Spanish', title: 'Cooker', daysOnBoard: 150, dailyRate: 200, currency: 'EUR', totalIncome: 30000, certificates: [] },
    { id: 4, firstName: 'Anna', lastName: 'Ivanova', nationality: 'Russian', title: 'Mechanic', daysOnBoard: 110, dailyRate: 220, currency: 'EUR', totalIncome: 24200, certificates: [] },
    { id: 5, firstName: 'Liu', lastName: 'Wei', nationality: 'Chinese', title: 'Deckhand', daysOnBoard: 130, dailyRate: 180, currency: 'USD', totalIncome: 23400, certificates: [] }
  ];

  // **BehaviorSubject ile canlı veri kaynağı**
  private crewListSubject = new BehaviorSubject<CrewMember[]>(this.crewList);
  crewList$ = this.crewListSubject.asObservable(); // Observable olarak dışa aç

  // Gelir özeti
  private incomeSummary: IncomeSummary[] = [
    { currency: 'USD', totalIncome: 81900 },
    { currency: 'EUR', totalIncome: 54200 }
  ];

  constructor() {}

  /**
   * Mürettebat listesini Observable olarak döndür
   */
  getCrewList(): Observable<CrewMember[]> {
    return this.crewList$; // Artık BehaviorSubject üzerinden döndürülüyor
  }

  /**
   * Gelir özetini Observable olarak döndür
   */
  getIncomeSummary(): Observable<IncomeSummary[]> {
    return new BehaviorSubject(this.incomeSummary).asObservable();
  }

  /**
   * Mürettebat üyesini ID'ye göre sil ve güncellenmiş listeyi yay (emit) et
   */
  deleteCrewMember(id: number): void {
    this.crewList = this.crewList.filter(member => member.id !== id);
    this.crewListSubject.next(this.crewList); // BehaviorSubject'i güncelle
  }
}
