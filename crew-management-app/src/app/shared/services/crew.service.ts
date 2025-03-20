import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CrewMember } from '@shared/models/crew-member.model';
import { IncomeSummary } from '@models/income-summary.model';

@Injectable({
  providedIn: 'root'
})
export class CrewService {
  private crewList: CrewMember[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', nationality: 'American', title: 'Captain', daysOnBoard: 120, dailyRate: 300, currency: 'USD', totalIncome: 36000, certificates: [] },
    { id: 2, firstName: 'Jane', lastName: 'Smith', nationality: 'British', title: 'Engineer', daysOnBoard: 90, dailyRate: 250, currency: 'EUR', totalIncome: 22500, certificates: [] },
    { id: 3, firstName: 'Carlos', lastName: 'Gomez', nationality: 'Spanish', title: 'Cooker', daysOnBoard: 150, dailyRate: 200, currency: 'USD', totalIncome: 30000, certificates: [] },
    { id: 4, firstName: 'Anna', lastName: 'Ivanova', nationality: 'Russian', title: 'Mechanic', daysOnBoard: 110, dailyRate: 220, currency: 'USD', totalIncome: 24200, certificates: [] },
    { id: 5, firstName: 'Liu', lastName: 'Wei', nationality: 'Chinese', title: 'Deckhand', daysOnBoard: 130, dailyRate: 180, currency: 'EUR', totalIncome: 23400, certificates: [] }
  ];

  private crewListSubject = new BehaviorSubject<CrewMember[]>(this.crewList);
  crewList$ = this.crewListSubject.asObservable();

  private exchangeRate: number = 0.85;

  constructor() {}

  getCrewList(): Observable<CrewMember[]> {
    return this.crewList$;
  }

  getIncomeSummary(): Observable<IncomeSummary[]> {
    const totalUSD = this.crewList.reduce((acc, member) => {
      if (member.currency === 'USD') {
        return acc + member.totalIncome;
      } else {
        return acc + member.totalIncome / this.exchangeRate;
      }
    }, 0);

    const totalEUR = this.crewList.reduce((acc, member) => {
      if (member.currency === 'EUR') {
        return acc + member.totalIncome;
      } else {
        return acc + member.totalIncome * this.exchangeRate;
      }
    }, 0);

    const summary: IncomeSummary[] = [
      { currency: 'USD', totalIncome: totalUSD },
      { currency: 'EUR', totalIncome: totalEUR }
    ];

    return new BehaviorSubject(summary).asObservable();
  }

  deleteCrewMember(id: number): void {
    this.crewList = this.crewList.filter(member => member.id !== id);
    this.crewListSubject.next(this.crewList);
  }

  // Yeni metod: Mürettebat üyesi ekleme
  addCrewMember(newCrew: CrewMember): void {
    console.log('Adding new crew member:', newCrew);
    this.crewList.push(newCrew);
    this.crewListSubject.next(this.crewList);
    console.log('Crew member added. Updated crew list:', this.crewList);
  }
}