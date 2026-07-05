import type { Summary } from "../interfaces/Summary";
import type { SummaryPerSchool } from "../interfaces/SummaryPerSchool";

export const summary: Summary[] = [
  {
    foodId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    foodName: "Arroz Branco",
    totalReceivedKg: 500.0,
    totalWastedKg: 50.0,
    moneySpent: 2750.00,
    moneyLost: 275.00,
    wastePercentage: 10.00
  },
  {
    foodId: "550e8400-e29b-41d4-a716-446655440000",
    foodName: "Feijão Carioca",
    totalReceivedKg: 300.0,
    totalWastedKg: 60.0,
    moneySpent: 2160.00,
    moneyLost: 432.00,
    wastePercentage: 20.00
  },
  {
    foodId: "3b1a8f9c-7e5d-4f1b-8c2d-9a0e4b6c3d5f",
    foodName: "Carne Moída",
    totalReceivedKg: 400.0,
    totalWastedKg: 32.0,
    moneySpent: 11560.00,
    moneyLost: 924.80,
    wastePercentage: 8.00
  },
  {
    foodId: "c83b2e5a-9f4c-4e8b-8a7d-3f1c6e9a2b5d",
    foodName: "Sopa de Ervilha", // O Vilão do Desperdício!
    totalReceivedKg: 200.0,
    totalWastedKg: 85.0,
    moneySpent: 1900.00,
    moneyLost: 807.50,
    wastePercentage: 42.50 
  }
];

export const summaryPerSchool: SummaryPerSchool[] = [
  {
    schoolUsername: "emef_tinga",
    totalReceivedKg: 400.0,
    totalWastedKg: 40.0,
    moneySpent: 3000.00,
    moneyLost: 300.00,
    wastePercentage: 10.00
  },
  {
    schoolUsername: "emei_massaguacu",
    totalReceivedKg: 250.0,
    totalWastedKg: 62.5,
    moneySpent: 1800.00,
    moneyLost: 450.00,
    wastePercentage: 25.00
  },
  {
    schoolUsername: "emef_morro_algodao",
    totalReceivedKg: 350.0,
    totalWastedKg: 92.75,
    moneySpent: 2800.00,
    moneyLost: 742.00,
    wastePercentage: 26.50
  },
  {
    schoolUsername: "emef_prof_euripedes",
    totalReceivedKg: 300.0,
    totalWastedKg: 15.0,
    moneySpent: 2200.00,
    moneyLost: 110.00,
    wastePercentage: 5.00 // A escola exemplar!
  }
];