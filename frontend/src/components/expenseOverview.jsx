import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatChartVND, formatVND } from "../util/money";

const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const ExpenseTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const { amount, name } = payload[0].payload;
    return (
        <div className="min-w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg">
            <p className="border-b border-gray-100 pb-1.5 font-semibold text-gray-700">{label}</p>
            <p className="pt-1.5 font-semibold text-gray-700">Tổng: <span className="text-red-700">-{formatVND(amount)}</span></p>
            <p className="mt-2 text-gray-500">{name}: <span className="font-medium">-{formatVND(amount)}</span></p>
        </div>
    );
};

const ExpenseOverview = ({ transactions, onAddExpense }) => {
    const chartData = useMemo(() => transactions.map((transaction) => ({
        date: transaction.date,
        label: formatDate(transaction.date),
        amount: Number(transaction.amount) || 0,
        name: transaction.name || "Expense",
    })).sort((a, b) => new Date(a.date) - new Date(b.date)), [transactions]);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h5 className="text-base font-semibold text-gray-900">Tổng quan chi tiêu</h5>
                    <p className="mt-0.5 text-xs text-gray-400">Theo dõi xu hướng chi tiêu và hiểu rõ dòng tiền của bạn.</p>
                </div>
                <button type="button" onClick={onAddExpense} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100">
                    <Plus size={14} /> Thêm khoản chi
                </button>
            </div>
            <div className="h-[245px] sm:h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                        <defs><linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="100%" stopColor="#fecaca" stopOpacity={0.02} /></linearGradient></defs>
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11 }} tickMargin={12} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11 }} tickFormatter={(value) => formatChartVND(value)} width={48} />
                        <Tooltip cursor={false} content={<ExpenseTooltip />} />
                        <Area type="monotone" dataKey="amount" stroke="#dc2626" strokeWidth={2.5} fill="url(#expenseGradient)" dot={{ r: 4, fill: "#dc2626", stroke: "#dc2626" }} activeDot={{ r: 5, fill: "#dc2626", stroke: "#fff", strokeWidth: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default ExpenseOverview;
