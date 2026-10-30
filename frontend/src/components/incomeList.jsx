import { Download, LoaderCircle } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import { useState } from "react";

const IncomeList = ({transactions, onDelete, onDownload}) => {
    const [loading, setLoading] = useState(false);
    const handleDownload = async () => {
        setLoading(true);
        try {
            await onDownload();
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="card rounded-2xl bg-white px-5 py-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h5 className="text-base font-semibold text-gray-800">Nguồn thu nhập</h5>
                <div className="flex items-center justify-end gap-2">
                    <button disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100" onClick={handleDownload}>
                       
                         {loading ? (
                            <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Đang tải...
                            </>
                        ): (<>
                         <Download size={14} /> Tải xuống


                        </>)}
                    </button>
                </div>
            </div>
            {transactions.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                    {transactions.map((income) => (
                        <TransactionInfoCard
                            key={income.id}
                            title={income.name}
                            icon={income.icon}
                            date={new Date(income.date).toLocaleDateString("vi-VN")}
                            amount={income.amount}
                            type="income"
                            onDelete={() => onDelete(income.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-400">
                    Chưa có khoản thu nhập nào.
                </div>
            )}
        </div>
    )
}
export default IncomeList;