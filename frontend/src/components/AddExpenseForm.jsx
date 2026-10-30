import { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojPickerPopup";
import Input from "./input";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories }) => {
    const [expense, setExpense] = useState({ name: "", amount: "", date: "", icon: "", categoryId: "" });
    const [loading, setLoading] = useState(false);
    const categoryOptions = categories.length
        ? categories.map((category) => ({ value: category.id, label: category.name }))
        : [{ value: "", label: "Chưa có danh mục chi tiêu" }];
    const hasCategories = categories.length > 0;
    const handleChange = (key, value) => setExpense((current) => ({ ...current, [key]: value }));
    const handleSubmit = async () => {
        if (!hasCategories) return;
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { if (categories.length && !expense.categoryId) setExpense((current) => ({ ...current, categoryId: categories[0].id })); }, [categories, expense.categoryId]);
    return (
        <div className="space-y-1">
            <EmojiPickerPopup icon={expense.icon} onSelect={(icon) => handleChange("icon", icon)} />
            <Input value={expense.name} onChange={({ target }) => handleChange("name", target.value)} label="Nguồn chi tiêu" placeholder="Ví dụ: Tiền điện, Wifi" type="text" />
            <Input label="Danh mục" value={expense.categoryId} onChange={({ target }) => handleChange("categoryId", target.value)} isSelect options={categoryOptions} />
            {!hasCategories && <p className="-mt-2 mb-3 text-xs text-amber-700">Hãy tạo danh mục loại Chi tiêu trong trang Danh mục trước khi thêm khoản chi.</p>}
            <Input value={expense.amount} onChange={({ target }) => handleChange("amount", target.value)} label="Số tiền" placeholder="Ví dụ: 50.000 hoặc 50000" type="text" />
            <Input value={expense.date} onChange={({ target }) => handleChange("date", target.value)} label="Ngày" placeholder="dd/mm/yyyy" type="date" />
            <div className="mt-5 flex justify-end"><button type="button" onClick={handleSubmit} disabled={loading || !hasCategories} className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Đang thêm...</> : "Thêm khoản chi"}</button></div>
        </div>
    );
};
export default AddExpenseForm;
