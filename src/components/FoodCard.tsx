import React from 'react';
import type { Summary } from '../interfaces/Summary';

interface FoodCardProps {
  summary: Summary;
}

export const FoodCard: React.FC<FoodCardProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Header with food name */}
      <h3 className="bg-[#4180ab] text-white text-center py-3 font-semibold text-lg tracking-wide group-hover:bg-[#346b91] transition-colors duration-300">
        {summary.foodName}
      </h3>

      {/* Grid containing metrics */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 flex-1">
        {/* Total Received */}
        <div className="bg-white p-1.5 sm:p-2.5 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">Enviado</span>
          <span className="text-sm font-semibold text-gray-700 mt-1">{summary.totalSentKg} Kg</span>
        </div>

        {/* Total Wasted */}
        <div className="bg-white p-1 sm:p-2 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">Desperdiçado</span>
          <span className="text-sm font-semibold text-red-600 mt-1">{summary.totalWastedKg} Kg</span>
        </div>

        {/* Waste Percentage (Row Span 2) */}
        <div className="bg-red-50 p-1.5 sm:p-2.5 rounded-xl border border-red-100 flex flex-col justify-center items-center text-center shadow-sm row-span-2">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-red-400 tracking-wider">Desperdício</span>
          <span className="text-lg font-black text-red-600 mt-1">{Math.round(summary.wastePercentage)}%</span>
        </div>

        {/* Money Spent */}
        <div className="bg-white p-1.5 sm:p-2.5 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gasto</span>
          <span className="text-xs font-semibold text-black mt-1">R$ {summary.moneySpent.toFixed(2)}</span>
        </div>

        {/* Money Lost */}
        <div className="bg-white p-1.5 sm:p-2.5 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">Perdido</span>
          <span className="text-xs font-semibold text-red-500 mt-1">R$ {summary.moneyLost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;