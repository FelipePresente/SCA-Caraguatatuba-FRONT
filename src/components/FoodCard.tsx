import type { Summary } from '../interfaces/Summary'
import { summary } from '../lib/mockData'

export default function FoodCart() {
    const summaries: Summary[] = summary

    return (
        <div className='flex flex-col gap-6'>
            {summaries.map((summary) => (
                <div key={summary.foodId} className='rounded-xl overflow-hidden shadow-sm'>
                    <h1 className='bg-[#4180ab] text-[#ffffff] text-center py-2 font-semibold'>{summary.foodName}</h1>

                    <div className='grid grid-cols-3 gap-1 p-1'>
                        <p className='bg-[#d9d9d9] aspect-square rounded-bl-lg flex justify-center items-center'>{summary.totalReceivedKg} Kg</p>
                        <p className='bg-[#d9d9d9] aspect-square flex justify-center items-center'>{summary.totalWastedKg} Kg</p>
                        <p className='bg-[#d9d9d9] rounded-r-lg flex justify-center items-center row-span-2'>{summary.wastePercentage}%</p>
                        <p className='bg-[#d9d9d9] aspect-square flex justify-center items-center'>R$ {summary.moneySpent}</p>
                        <p className='bg-[#d9d9d9] aspect-square flex justify-center items-center'>R$ {summary.moneyLost}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}