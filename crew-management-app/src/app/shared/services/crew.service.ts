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
    { id: 2, firstName: 'Jane', lastName: 'Smith', nationality: 'British', title: 'Engineer', daysOnBoard: 90, dailyRate: 250, currency: 'EUR', totalIncome: 22500, certificates: [] },
    { id: 3, firstName: 'Carlos', lastName: 'Gomez', nationality: 'Spanish', title: 'Cooker', daysOnBoard: 150, dailyRate: 200, currency: 'USD', totalIncome: 30000, certificates: [] },
    { id: 4, firstName: 'Anna', lastName: 'Ivanova', nationality: 'Russian', title: 'Mechanic', daysOnBoard: 110, dailyRate: 220, currency: 'USD', totalIncome: 24200, certificates: [] },
    { id: 5, firstName: 'Liu', lastName: 'Wei', nationality: 'Chinese', title: 'Deckhand', daysOnBoard: 130, dailyRate: 180, currency: 'EUR', totalIncome: 23400, certificates: [] }
  ];

  // **BehaviorSubject ile canlı veri kaynağı**
  private crewListSubject = new BehaviorSubject<CrewMember[]>(this.crewList);
  crewList$ = this.crewListSubject.asObservable(); // Observable olarak dışa aç

  // Döviz kuru (örnek olarak 1 EUR = 1.1 USD)
  private exchangeRate: number = 0.85;

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
    const totalUSD = this.crewList.reduce((acc, member) => {
      if (member.currency === 'USD') {
        return acc + member.totalIncome; // USD ise direkt ekle
      } else {
        return acc + member.totalIncome / this.exchangeRate; // EUR ise USD'ye çevirerek ekle
      }
    }, 0);
  
    const totalEUR = this.crewList.reduce((acc, member) => {
      if (member.currency === 'EUR') {
        return acc + member.totalIncome; // EUR ise direkt ekle
      } else {
        return acc + member.totalIncome * this.exchangeRate; // USD ise EUR'ya çevirerek ekle
      }
    }, 0);
  
    const summary: IncomeSummary[] = [
      { currency: 'USD', totalIncome: totalUSD },
      { currency: 'EUR', totalIncome: totalEUR }
    ];
  
    return new BehaviorSubject(summary).asObservable();
  }

  /**
   * Mürettebat üyesini ID'ye göre sil ve güncellenmiş listeyi yay (emit) et
   */
  deleteCrewMember(id: number): void {
    this.crewList = this.crewList.filter(member => member.id !== id);
    this.crewListSubject.next(this.crewList); // BehaviorSubject'i güncelle
  }
}
