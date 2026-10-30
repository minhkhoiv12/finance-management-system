import { useCallback, useEffect, useRef, useState } from "react";
import { CircleAlert, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import Dashboard from "../components/Dashboard";
import TransactionInfoCard from "../components/TransactionInfoCard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";

const TYPE_TABS = [
    { value: "expense", label: "Chi tiêu" },
    { value: "income", label: "Thu nhập" },
];

const SORT_FIELD_OPTIONS = [
    { value: "date", label: "Ngày" },
    { value: "amount", label: "Số tiền" },
    { value: "name", label: "Tên" },
];

const SORT_ORDER_OPTIONS = [
    { value: "asc", label: "Tăng dần" },
    { value: "desc", label: "Giảm dần" },
];

const fieldClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const Filter = () => {
    useUser();

    // Mỗi điều kiện một state độc lập → thay đổi điều kiện này không làm mất điều kiện khác
    const [type, setType] = useState("expense");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [keywordInput, setKeywordInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchIdRef = useRef(0);

    const dateInvalid = Boolean(startDate && endDate && startDate > endDate);

    // Gõ từ khóa → áp dụng sau 400ms để tránh gọi API liên tục; xóa hết từ khóa cũng tự cập nhật lại
    useEffect(() => {
        const timer = setTimeout(() => setSearchKeyword(keywordInput.trim()), 400);
        return () => clearTimeout(timer);
    }, [keywordInput]);

    const fetchResults = useCallback(async () => {
        const fetchId = ++fetchIdRef.current;
        setLoading(true);
        setError(null);
        try {
            // Chỉ gửi những điều kiện người dùng đã chọn; sắp xếp luôn gửi theo lựa chọn hiện tại
            const params = { sortField, sortOrder };
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (searchKeyword) params.keyword = searchKeyword;
            const endpoint = type === "income" ? API_ENDPOINTS.FILTER_INCOMES : API_ENDPOINTS.FILTER_EXPENSES;
            const response = await axiosConfig.get(endpoint, { params });
            if (fetchId !== fetchIdRef.current) return; // bỏ qua phản hồi cũ sau khi điều kiện đã đổi tiếp
            setResults(response.data);
        } catch (err) {
            if (fetchId !== fetchIdRef.current) return;
            setResults([]);
            setError(err.response?.data?.message || "Không thể tải danh sách giao dịch. Vui lòng thử lại.");
        } finally {
            if (fetchId === fetchIdRef.current) setLoading(false);
        }
    }, [type, startDate, endDate, sortField, sortOrder, searchKeyword]);

    // Bất kỳ điều kiện nào thay đổi (loại, ngày, sắp xếp, từ khóa) → cập nhật danh sách ngay, không cần nhấn tìm kiếm
    useEffect(() => {
        if (dateInvalid) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }
        fetchResults();
    }, [dateInvalid, fetchResults]);

    const handleSearch = () => setSearchKeyword(keywordInput.trim());

    const typeLabel = type === "income" ? "thu nhập" : "chi tiêu";

    return (
        <Dashboard activeMenu="Lọc giao dịch">
            <main className="my-5 min-h-[calc(100vh-7rem)] rounded-2xl bg-[#fff8fc] p-5 sm:p-6">
                {/* ── Header ── */}
                <div>
                    <h2 className="text-xl font-bold text-slate-950">Lọc giao dịch</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Các điều kiện có thể dùng độc lập hoặc kết hợp với nhau — điều kiện bỏ trống sẽ không được áp dụng.
                    </p>
                </div>

                {/* ── Bảng điều kiện lọc ── */}
                <section className="mt-4 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(88,28,135,0.08)] sm:p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <SlidersHorizontal size={16} className="text-purple-800" /> Điều kiện lọc
                    </div>

                    {/* Loại giao dịch */}
                    <div className="mt-4">
                        <label className="mb-2 block text-[13px] text-slate-800">Loại giao dịch</label>
                        <div className="flex flex-wrap gap-2">
                            {TYPE_TABS.map((tab) => (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => setType(tab.value)}
                                    className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                                        type === tab.value
                                            ? "bg-purple-800 text-white shadow-sm"
                                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ngày + sắp xếp + tìm kiếm */}
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <label htmlFor="filter-start-date" className="mb-1 block text-[13px] text-slate-800">Ngày bắt đầu</label>
                            <input
                                id="filter-start-date"
                                type="date"
                                value={startDate}
                                max={endDate || undefined}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="filter-end-date" className="mb-1 block text-[13px] text-slate-800">Ngày kết thúc</label>
                            <input
                                id="filter-end-date"
                                type="date"
                                value={endDate}
                                min={startDate || undefined}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="filter-sort-field" className="mb-1 block text-[13px] text-slate-800">Sắp xếp theo</label>
                            <select
                                id="filter-sort-field"
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                                className={fieldClass}
                            >
                                {SORT_FIELD_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filter-sort-order" className="mb-1 block text-[13px] text-slate-800">Thứ tự</label>
                            <select
                                id="filter-sort-order"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className={fieldClass}
                            >
                                {SORT_ORDER_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filter-keyword" className="mb-1 block text-[13px] text-slate-800">Tìm kiếm</label>
                            <div className="relative">
                                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="filter-keyword"
                                    type="text"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="Tên giao dịch..."
                                    className={`${fieldClass} pl-9`}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Kết quả ── */}
                <section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(88,28,135,0.08)] sm:p-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-950">
                            Giao dịch {typeLabel}
                        </h3>
                        {!loading && !error && !dateInvalid && (
                            <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-medium text-purple-800">
                                {results.length} kết quả
                            </span>
                        )}
                    </div>

                    {/* Ngày không hợp lệ */}
                    {dateInvalid && (
                        <div className="flex min-h-32 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-center text-sm text-amber-800">
                            <CircleAlert size={18} />
                            Ngày kết thúc không thể trước ngày bắt đầu. Vui lòng điều chỉnh lại khoảng thời gian.
                        </div>
                    )}

                    {/* Đang tải */}
                    {loading && !dateInvalid && (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="mb-3 h-14 animate-pulse rounded-xl bg-slate-100" />
                            ))}
                        </div>
                    )}

                    {/* Lỗi API */}
                    {!loading && !dateInvalid && error && (
                        <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 text-center text-sm text-red-700">
                            <span className="flex items-center gap-2"><CircleAlert size={18} /> {error}</span>
                            <button
                                type="button"
                                onClick={fetchResults}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
                            >
                                <RotateCcw size={14} /> Thử lại
                            </button>
                        </div>
                    )}

                    {/* Không có kết quả */}
                    {!loading && !error && !dateInvalid && results.length === 0 && (
                        <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-400">
                            Không tìm thấy giao dịch nào phù hợp với điều kiện đã chọn.
                        </div>
                    )}

                    {/* Danh sách kết quả */}
                    {!loading && !error && !dateInvalid && results.length > 0 && (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                            {results.map((tx) => (
                                <TransactionInfoCard
                                    key={tx.id}
                                    title={tx.name}
                                    icon={tx.icon}
                                    date={new Date(tx.date).toLocaleDateString("vi-VN")}
                                    amount={tx.amount}
                                    type={type}
                                    hideDeleteBtn
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </Dashboard>
    );
};

export default Filter;
