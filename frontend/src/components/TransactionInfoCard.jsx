import { CircleDollarSign, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { formatVND } from "../util/money";

const TransactionInfoCard = ({icon, title, date, amount, type, hideDeleteBtn, onDelete}) => {
    const getAmountStyles = () => type === 'income' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800';
    const formattedAmount = formatVND(amount);
    return (
        <div className="group relative mt-1 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-gray-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-800">
                {
                    icon ? (
                        <img src={icon} alt={title} className="h-5 w-5" />
                    ) : (
                        <CircleDollarSign size={20} className="text-amber-600" />
                    )
                }
            </div>
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-700">{title}</p>
                    <p className="text-xs font-medium text-gray-400">{date}</p>
                </div>
                <div className="flex items-center gap-2">
                    {!hideDeleteBtn && (
                        <button 
                        onClick={onDelete}
                        className="cursor-pointer text-gray-400 opacity-0 transition-opacity hover:text-red-800 group-hover:opacity-100">
                            <Trash2 size={18} />
                        </button>
                    )}
                    <div className= {`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 ${getAmountStyles()}`}>
                        <h6 className="text-xs font-semibold">
                            {type === 'income' ? '+' : '-'}{formattedAmount}
                        </h6>
                        {type === 'income' ? (
                            <TrendingUp size={15} />
                        ): (
                            <TrendingDown size={15} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TransactionInfoCard;