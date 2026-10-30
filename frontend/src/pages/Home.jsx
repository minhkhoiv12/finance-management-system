import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Wallet, ArrowRight, CircleDollarSign } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { formatVND } from "../util/money";
import Notification from "../components/Notification";

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (val) => formatVND(val);

/* ─── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ label, value, iconBg, Icon }) => (
    <div className="flex flex-1 min-w-[220px] items-center gap-4 rounded-2xl bg-white px-5 py-5 shadow-[0_4px_18px_rgba(88,28,135,0.08)]">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
            <Icon size={26} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{fmt(value)}</p>
        </div>
    </div>
);

/* ─── Recent Transaction Row ─────────────────────────────── */
const RecentRow = ({ tx }) => {
    const isIncome = tx.type === "income";
    return (
        <div className="flex items-center gap-4 rounded-xl px-2 py-3 transition hover:bg-slate-50">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100">
                {tx.icon ? (
                    <img src={tx.icon} alt={tx.name} className="h-6 w-6 object-contain" />
                ) : (
                    <CircleDollarSign size={22} className="text-amber-500" />
                )}
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{tx.name}</p>
                <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString("vi-VN")}</p>
            </div>
            <div className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold ${
                isIncome ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}>
                {isIncome ? `+${fmt(tx.amount)}` : `-${fmt(tx.amount)}`}
                {isIncome ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </div>
        </div>
    );
};

/* ─── Custom Centre Label ────────────────────────────────── */
const DonutLabel = ({ cx, cy, balance }) => (
    <>
        <text x={cx} y={cy - 10} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 13, fill: "#64748b" }}>
            Số dư tổng cộng
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: "#0f172a" }}>
            {fmt(balance)}
        </text>
    </>
);

/* ─── Financial Overview Donut ───────────────────────────── */
const COLORS = ["#7c3aed", "#9f1239", "#15803d"]; // purple, dark-red, dark-green

const FinancialOverview = ({ balance, income, expense }) => {
    const chartData = [
        { name: "Số dư tổng cộng", value: Math.max(Number(balance || 0), 0) },
        { name: "Tổng chi tiêu", value: Math.max(Number(expense || 0), 0) },
        { name: "Tổng thu nhập", value: Math.max(Number(income || 0), 0) },
    ];

    return (
        <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={90} outerRadius={128} paddingAngle={3} dataKey="value" labelLine={false}>
                        {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(val) => [fmt(val), ""]} contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 13, fill: "#64748b" }}>Số dư tổng cộng</text>
                    <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 20, fontWeight: 700, fill: "#0f172a" }}>{fmt(balance)}</text>
                </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-1">
                {chartData.map((d, i) => (
                    <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                        {d.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

/* ─── Skeleton ───────────────────────────────────────────── */
const Skeleton = ({ className }) => (
    <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
);

/* ─── Home Page ──────────────────────────────────────────── */
const Home = () => {
    useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        axiosConfig
            .get(API_ENDPOINTS.GET_DASHBOARD)
            .then((res) => setData(res.data))
            .catch(() => setError("Không thể tải dữ liệu tổng quan."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (location.state?.notification) {
            setNotification(location.state.notification);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        const hideNotification = () => setNotification(null);
        window.addEventListener("category-notification-hide", hideNotification);
        return () => window.removeEventListener("category-notification-hide", hideNotification);
    }, []);

    const totalExpense = (data?.totalIncome ?? 0) - (data?.totalBalance ?? 0);

    return (
        <Dashboard activeMenu="Tổng quan">
            <Notification message={notification?.message} type={notification?.type} />
            <main className="my-5 min-h-[calc(100vh-7rem)] rounded-2xl bg-[#fff8fc] p-5 sm:p-6">

                {/* ── Stat cards ── */}
                {loading ? (
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="flex-1 h-24" />)}
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        <StatCard label="Số dư tổng cộng" value={data?.totalBalance} iconBg="bg-purple-700" Icon={Wallet} />
                        <StatCard label="Tổng thu nhập" value={data?.totalIncome} iconBg="bg-emerald-700" Icon={TrendingUp} />
                        <StatCard label="Chi tiêu" value={totalExpense} iconBg="bg-rose-800" Icon={TrendingDown} />
                    </div>
                )}

                {/* ── Bottom row: Recent Transactions + Financial Overview ── */}
                <div className="mt-6 flex flex-col gap-6 lg:flex-row">

                    {/* Recent Transactions */}
                    <section className="flex-1 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(88,28,135,0.08)] sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-950">Giao dịch gần đây</h3>
                            <button
                                onClick={() => navigate("/filter")}
                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Xem thêm <ArrowRight size={15} />
                            </button>
                        </div>

                        {loading && [1,2,3,4,5].map((i) => <Skeleton key={i} className="mb-3 h-14" />)}

                        {!loading && !error && data?.recentTransactions?.length === 0 && (
                            <p className="text-sm text-slate-400">Không tìm thấy giao dịch gần đây.</p>
                        )}

                        {!loading && !error && data?.recentTransactions?.map((tx, idx) => (
                            <RecentRow key={`${tx.type}-${tx.id}-${idx}`} tx={tx} />
                        ))}
                    </section>

                    {/* Tổng quan tài chính */}
                    <section className="w-full lg:w-[400px] shrink-0 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(88,28,135,0.08)] sm:p-6">
                        <h3 className="mb-2 text-lg font-bold text-slate-950">Tổng quan tài chính</h3>

                        {loading && <Skeleton className="h-72 w-full" />}

                        {!loading && !error && (
                            <FinancialOverview
                                balance={data?.totalBalance}
                                income={data?.totalIncome}
                                expense={totalExpense}
                            />
                        )}
                    </section>
                </div>

                {/* ── Bottom row 2: Recent Expenses + Recent Incomes ── */}
                <div className="mt-6 flex flex-col gap-6 lg:flex-row">

                    {/* Recent Expenses */}
                    <section className="flex-1 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(88,28,135,0.08)] sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-950">Chi tiêu gần đây</h3>
                            <button
                                onClick={() => navigate("/expense")}
                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Xem thêm <ArrowRight size={15} />
                            </button>
                        </div>

                        {loading && [1,2,3].map((i) => <Skeleton key={i} className="mb-3 h-14" />)}

                        {!loading && !error && (!data?.recent5Expenses || data.recent5Expenses.length === 0) && (
                            <p className="text-sm text-slate-400">Không tìm thấy khoản chi gần đây.</p>
                        )}

                        {!loading && !error && data?.recent5Expenses?.map((tx) => (
                            <RecentRow key={`expense-${tx.id}`} tx={{ ...tx, type: "expense" }} />
                        ))}
                    </section>

                    {/* Recent Incomes */}
                    <section className="flex-1 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(88,28,135,0.08)] sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-950">Thu nhập gần đây</h3>
                            <button
                                onClick={() => navigate("/income")}
                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Xem thêm <ArrowRight size={15} />
                            </button>
                        </div>

                        {loading && [1,2,3].map((i) => <Skeleton key={i} className="mb-3 h-14" />)}

                        {!loading && !error && (!data?.recent5Incomes || data.recent5Incomes.length === 0) && (
                            <p className="text-sm text-slate-400">Không tìm thấy khoản thu nhập gần đây.</p>
                        )}

                        {!loading && !error && data?.recent5Incomes?.map((tx) => (
                            <RecentRow key={`income-${tx.id}`} tx={{ ...tx, type: "income" }} />
                        ))}
                    </section>
                </div>
            </main>
        </Dashboard>
    );
};

export default Home;