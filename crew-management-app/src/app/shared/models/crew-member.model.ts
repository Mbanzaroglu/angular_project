import { Currency } from "@shared/enums/currency.enum";
import { Certificate } from "./certificate.model";

export interface CrewMember {
    id: number;
    firstName: string;
    lastName: string;
    nationality: string;
    title: string;
    daysOnBoard: number;
    dailyRate: number;
    currency: Currency;
    totalIncome: number;
    discount?: number; // Opsiyonel
  }
  