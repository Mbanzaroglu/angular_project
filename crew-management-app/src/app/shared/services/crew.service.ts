import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { CrewMember } from '@shared/models/crew-member.model';
import { IncomeSummary } from '@models/income-summary.model';
import { Currency } from '@shared/enums/currency.enum';

@Injectable({
  providedIn: 'root'
})
export class CrewService {
  private crewList: CrewMember[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', nationality: 'American', title: 'Captain', daysOnBoard: 120, dailyRate: 300, currency: Currency.USD, totalIncome: 0, certificates: [] },
    { id: 2, firstName: 'Jane', lastName: 'Smith', nationality: 'British', title: 'Engineer', daysOnBoard: 90, dailyRate: 250, currency: Currency.EUR, totalIncome: 0, certificates: [] },
    { id: 3, firstName: 'Carlos', lastName: 'Gomez', nationality: 'Spanish', title: 'Cooker', daysOnBoard: 150, dailyRate: 200, currency: Currency.USD, totalIncome: 0, certificates: [] },
    { id: 4, firstName: 'Anna', lastName: 'Ivanova', nationality: 'Russian', title: 'Mechanic', daysOnBoard: 110, dailyRate: 220, currency: Currency.USD, totalIncome: 0, certificates: [] },
    { id: 5, firstName: 'Liu', lastName: 'Wei', nationality: 'Chinese', title: 'Deckhand', daysOnBoard: 130, dailyRate: 180, currency: Currency.EUR, totalIncome: 0, certificates: [] }
  ];

  private nationalityList: string[] = [
    'American',
    'British',
    'Spanish',
    'Russian',
    'Chinese',
    'French',
    'German',
    'Italian',
    'Japanese',
    'Brazilian'
  ];

  private titleList: string[] = [
    'Captain',
    'Engineer',
    'Cooker',
    'Mechanic',
    'Deckhand',
    'First Officer',
    'Navigator',
    'Steward',
    'Electrician',
    'Chief Mate'
  ];

  private currencyList: Currency[] = [Currency.USD, Currency.EUR];

  private crewListSubject = new BehaviorSubject<CrewMember[]>(this.crewList);
  crewList$ = this.crewListSubject.asObservable();

  private incomeSummarySubject = new BehaviorSubject<IncomeSummary[]>([]);
  incomeSummary$ = this.incomeSummarySubject.asObservable();

  private exchangeRate: number = 0.85;

  private originalDailyRates: Map<number, { value: number; currency: Currency }> = new Map();
  private originalTotalIncomes: Map<number, { value: number; currency: Currency }> = new Map();

  constructor() {
    // Başlangıçta orijinal değerleri sakla ve totalIncome’u hesapla
    this.crewList.forEach(crew => {
      crew.totalIncome = crew.daysOnBoard * crew.dailyRate;
      this.originalDailyRates.set(crew.id, { value: crew.dailyRate, currency: crew.currency });
      this.originalTotalIncomes.set(crew.id, { value: crew.totalIncome, currency: crew.currency });
    });
    this.crewListSubject.next(this.crewList);

    // crewList$’a abone ol ve her değişiklikte incomeSummary$’ı güncelle
    this.crewList$.subscribe(crewList => {
      this.updateIncomeSummary(crewList);
    });
  }

  private updateIncomeSummary(crewList: CrewMember[]): void {
    const totalUSD = crewList.reduce((acc, member) => {
      const original = this.originalTotalIncomes.get(member.id);
      if (!original) return acc;
      if (original.currency === Currency.USD) {
        return acc + original.value;
      } else {
        return acc + original.value / this.exchangeRate; // EUR -> USD
      }
    }, 0);

    const totalEUR = crewList.reduce((acc, member) => {
      const original = this.originalTotalIncomes.get(member.id);
      if (!original) return acc;
      if (original.currency === Currency.EUR) {
        return acc + original.value;
      } else {
        return acc + original.value * this.exchangeRate; // USD -> EUR
      }
    }, 0);

    const summary: IncomeSummary[] = [
      { currency: Currency.USD, totalIncome: totalUSD },
      { currency: Currency.EUR, totalIncome: totalEUR }
    ];

    this.incomeSummarySubject.next(summary);
  }

  getCrewList(): Observable<CrewMember[]> {
    return this.crewList$;
  }

  getCurrencies(): Observable<Currency[]> {
    return of(this.currencyList);
  }

  getIncomeSummary(): Observable<IncomeSummary[]> {
    return this.incomeSummary$;
  }

  deleteCrewMember(id: number): void {
    this.crewList = this.crewList.filter(member => member.id !== id);
    this.originalDailyRates.delete(id);
    this.originalTotalIncomes.delete(id);
    this.crewListSubject.next(this.crewList);
  }

  addCrewMember(newCrew: CrewMember): void {
    console.log('Adding new crew member:', newCrew);
    newCrew.totalIncome = newCrew.daysOnBoard * newCrew.dailyRate;
    this.crewList.push(newCrew);
    this.originalDailyRates.set(newCrew.id, { value: newCrew.dailyRate, currency: newCrew.currency });
    this.originalTotalIncomes.set(newCrew.id, { value: newCrew.totalIncome, currency: newCrew.currency });
    this.crewListSubject.next(this.crewList);
    console.log('Crew member added. Updated crew list:', this.crewList);
    console.log('Crew Member Subject:', this.crewList$);
  }

  updateCrewList(updatedCrewList: CrewMember[]): void {
    this.crewList = updatedCrewList.map(crew => {
      const updatedCrew = { ...crew };
      updatedCrew.totalIncome = updatedCrew.daysOnBoard * updatedCrew.dailyRate;
      this.originalTotalIncomes.set(updatedCrew.id, { value: updatedCrew.totalIncome, currency: updatedCrew.currency });
      return updatedCrew;
    });
    this.crewListSubject.next(this.crewList);
    console.log('Crew list updated:', this.crewList);
  }

  getNationalities(): Observable<string[]> {
    return of(this.nationalityList);
  }

  getTitles(): Observable<string[]> {
    return of(this.titleList);
  }

  getOriginalDailyRate(id: number): { value: number; currency: Currency } | undefined {
    return this.originalDailyRates.get(id);
  }

  getOriginalTotalIncome(id: number): { value: number; currency: Currency } | undefined {
    return this.originalTotalIncomes.get(id);
  }
}