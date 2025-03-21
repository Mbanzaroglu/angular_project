import { Currency } from "@shared/enums/currency.enum";

// Örneğin: src/app/models/income-summary.model.ts
export interface IncomeSummary {
    currency: Currency;
    totalIncome: number;
  }
  