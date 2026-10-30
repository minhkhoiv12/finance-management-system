import { useEffect, useState } from "react";
import Input from "./input";
import EmojiPickerPopup from "./EmojPickerPopup";
import { LoaderCircle } from "lucide-react";

const AddCategoryForm = ({onAddCategory, initialCategoryData, isEditing}) => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    })
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if(isEditing && initialCategoryData){
            setCategory({
                ...initialCategoryData,
                type: initialCategoryData.type ?? initialCategoryData.categoryType ?? "income"
            });
        }
        else {
            setCategory({name: "", type: "income", icon: ""});
        }
    }, [isEditing, initialCategoryData]);
    const categoryTypeOptions = [
        {
            value: "income", label: "Thu nhập"
        },
        {
            value: "expense", label: "Chi tiêu"
        }
    ]
    const handleChange = (key, value) => {
        setCategory({...category, [key]: value})
    }
    const handleSubmit = async() => {
        setLoading(true);
        try {
             await onAddCategory(category);
        }
        finally {
            setLoading(false);
        }
       
    }
    return (
        <div className="space-y-4">
            <EmojiPickerPopup 
            icon={category.icon}
            onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />
            <Input
            value = {category.name}
            onChange={({target}) => handleChange("name", target.value)}
            label = "Tên danh mục"
            placeholder = "Làm thêm, lương, thực phẩm"
            type="text"
             />
             <Input
             label = "Loại danh mục"
             value = {category.type}
             onChange={({target}) => handleChange("type", target.value)}
             isSelect = {true}
             options={categoryTypeOptions}
             
             />
             <div className="flex justify-end mt-8">
                <button type="button"
                onClick={handleSubmit}
                disabled = {loading}
                className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? (
                        <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                    {isEditing ? "Đang cập nhật..." : "Đang thêm..."}
                        </>
                    ) : (
                        <>
                            {isEditing ? "Cập nhật danh mục" : "Thêm danh mục"}
                        </>
                    )}
                </button>
             </div>
        </div>
    )
}
export default AddCategoryForm;