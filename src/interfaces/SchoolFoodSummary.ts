// Matches SchoolFoodSummaryDTO from backend
export interface SchoolFoodSummary {
  schoolUsername: string;
  totalSentKg: number;
  totalWastedKg: number;
  moneySpent: number;
  moneyLost: number;
  wastePercentage: number;
}
