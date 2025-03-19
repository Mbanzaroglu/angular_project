import { Certificate } from "./certificate.model";

export interface CrewMember {
    id: number;
    firstName: string;
    lastName: string;
    nationality: string;
    title: string;
    daysOnBoard: number;
    dailyRate: number;
    currency: string;
    totalIncome: number;
    discount?: number; // Opsiyonel
    certificates: Certificate[];
  }
  