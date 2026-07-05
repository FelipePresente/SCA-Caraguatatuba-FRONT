// Matches FoodSummaryDTO from backend
export interface Summary {
  foodId: string;
  foodName: string;
  totalSentKg: number;      // backend field name is totalSentKg (not totalReceivedKg)
  totalWastedKg: number;
  moneySpent: number;
  moneyLost: number;
  wastePercentage: number;
}