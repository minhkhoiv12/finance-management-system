import { useEffect, useState } from "react"
import EmojiPickerPopup from "./EmojPickerPopup"
import Input from "./input"
import { LoaderCircle } from "lucide-react"

const AddIncome = ({onAddIncome, categories}) => {
    const [income, setIncome] = useState({
        name : '',
        amount: '',
        date: '',
        icon: '',
        categoryId: ''
    })
    const [loading, setLoading] = useState(false);
    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }))
    const handleChange = (key,value) => {
        setIncome({...income, [key]: value});
    }
    const handleAddIncome = async () => {
        setLoading(true);
        try {
            await onAddIncome(income)
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if(categories.length > 0 && !income.categoryId) {
            setIncome((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, income.categoryId]);
    return ( 
        <div className="space-y-1">
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />
            <Input
            value = {income.name}
            onChange={({target}) => handleChange('name', target.value)}
            label="Nguồn thu nhập"
            placeholder="Ví dụ: Lương, làm việc tự do, tiền thưởng"
            type="text"
            />
            <Input
            label="Danh mục"
            value={income.categoryId}
            onChange={({target}) =>handleChange('categoryId', target.value)}
            isSelect = {true}
            options = {categoryOptions}
            />
            <Input
            value={income.amount}
            onChange={({target}) =>handleChange('amount', target.value)}
            label="Số tiền"
            placeholder="Ví dụ: 50.000 hoặc 50000"
            type="text"
            />

            <Input
            value={income.date}
            onChange={({target}) =>handleChange('date', target.value)}
            label="Ngày"
            placeholder="dd/mm/yyyy"
            type="date"
            />
            <div className="mt-5 flex justify-end">
                <button
                    type="button"
                    onClick={handleAddIncome}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Đang thêm...
                        </>
                    ) : (
                        <>
                        Thêm khoản thu
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
export default AddIncome