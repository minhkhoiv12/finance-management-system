import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatChartVND, formatVND } from "../util/money";

const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const formatAmount = (value) => `+${formatVND(value)}`;

const IncomeTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const { amount, name } = payload[0].payload;
    return (
        <div className="min-w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg">
            <p className="border-b border-gray-100 pb-1.5 font-semibold text-gray-700">{label}</p>
            <p className="pt-1.5 font-semibold text-gray-700">Tổng: <span className="text-violet-700">{formatAmount(amount)}</span></p>
            <p className="mt-2 text-gray-500">Chi tiết:</p>
            <p className="text-gray-600">{name}: <span className="font-medium">{formatAmount(amount)}</span></p>
        </div>
    );
};

const IncomeOverview = ({ transactions, onAddIncome }) => {
    const chartData = useMemo(() => transactions
        .map((transaction) => ({
            date: transaction.date,
            label: formatDate(transaction.date),
            amount: Number(transaction.amount) || 0,
            name: transaction.name || "Income",
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)), [transactions]);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h5 className="text-base font-semibold text-gray-900">Tổng quan thu nhập</h5>
                    <p className="mt-0.5 text-xs text-gray-400">Theo dõi thu nhập theo thời gian và phân tích xu hướng tài chính.</p>
                </div>
                <button
                    type="button"
                    onClick={onAddIncome}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                    <Plus size={14} />
                    Thêm khoản thu
                </button>
            </div>
            <div className="h-[245px] sm:h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.38} />
                            <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#4b5563", fontSize: 11 }}
                        tickMargin={12}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#4b5563", fontSize: 11 }}
                        tickFormatter={(value) => formatChartVND(value)}
                        width={48}
                    />
                    <Tooltip cursor={false} content={<IncomeTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#7541dc"
                        strokeWidth={2.5}
                        fill="url(#incomeGradient)"
                        dot={{ r: 4, fill: "#7541dc", stroke: "#7541dc" }}
                        activeDot={{ r: 5, fill: "#7541dc", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeOverview;