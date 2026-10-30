import { Layers2, Pencil } from "lucide-react";

const CategoryList = ({categories, onEditCategory }) => {
   return (
    <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Danh sách danh mục</h4>
        </div>
        {categories.length ===0 ? (
            <p className="text-gray-500">
                Chưa có danh mục nào. Hãy thêm danh mục để bắt đầu.
            </p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div 
                    key={category.id}
                    className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/60">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-800">
                            {category.icon ? (
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    className="h-6 w-6 object-contain"
                                />
                            ) : (
                                <Layers2 className="text-purple-800" size={24} />
                            )}
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700 font-medium">
                                    {category.name}
                                </p>
                                <p className="text-sm text-gray-400 mt-1 capitalize">
                                    {category.type === "income" ? "Thu nhập" : "Chi tiêu"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onEditCategory(category)}
                                className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity-100 transition-opacity cursor-pointer">
                                    <Pencil size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) }
    </div>
   );
}
export default CategoryList;