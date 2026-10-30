import { Download, LoaderCircle } from "lucide-react";
import { useState } from "react";
import TransactionInfoCard from "./TransactionInfoCard";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
    const [loading, setLoading] = useState(false);
    const runAction = async (action) => { setLoading(true); try { await action(); } finally { setLoading(false); } };
    return (
        <div className="card rounded-2xl bg-white px-5 py-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between"><h5 className="text-base font-semibold text-gray-800">Tất cả khoản chi</h5><div className="flex items-center justify-end gap-2">
                <button disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-60" onClick={() => runAction(onDownload)}>{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download size={14} />} {loading ? "Đang tải..." : "Tải xuống"}</button>
            </div></div>
            {transactions.length > 0 ? <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">{transactions.map((expense) => <TransactionInfoCard key={expense.id} title={expense.name} icon={expense.icon} date={new Date(expense.date).toLocaleDateString("vi-VN")} amount={expense.amount} type="expense" onDelete={() => onDelete(expense.id)} />)}</div> : <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-400">Chưa có khoản chi nào.</div>}
        </div>
    );
};
export default ExpenseList;
