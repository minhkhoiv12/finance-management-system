import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import CategoryList from "../components/CategoryList";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import AddCategoryForm from "../components/AddCategoryForm";
import Modal from "../components/Modal";
import Notification from "../components/Notification";

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [notification, setNotification] = useState(null);
    const fetchCategoryDetails = async() => {
        if(loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if(response.status === 200) {
                console.log('categories',response.data);
                setCategoryData(response.data);
            }

        }
        catch(error) {
            console.error("Something went wrong, error", error);
            console.error(error.message);

        }
        finally {
            setLoading(false);
        }
    }
 
    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    useEffect(() => {
        const hideNotification = () => setNotification(null);
        window.addEventListener("category-notification-hide", hideNotification);
        return () => window.removeEventListener("category-notification-hide", hideNotification);
    }, []);
    const handleAddCategory =  async(category) => {
        const {name, type, icon} = category;
        if(!name.trim()){
            setNotification({ message: "Vui lòng nhập danh mục", type: "error" });
            return;
        }

        const isDuplicate =  categoryData.some((category) => {
            return category.name.toLowerCase() === name.trim().toLowerCase();
        })
        if( isDuplicate) {
            setNotification({ message: "Tên danh mục đã tồn tại", type: "error" });
            return;
        }
        try {
           const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type, icon});
           if(response.status ===201) {
            setNotification({ message: "Thêm danh mục thành công", type: "success" });
            setOpenAddCategoryModal(false);
            fetchCategoryDetails();
           }
        }
        catch(error) {
            console.error("Error adding category", error);
            setNotification({
                message: error.response?.data?.message || "Không thể thêm danh mục",
                type: "error"
            });
        }
    }
    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }
    const handleUpdateCategory = async(updateCategory) => {
        const {id, name, type, icon} = updateCategory;
        if (!name.trim()){
            setNotification({ message: "Vui lòng nhập tên danh mục", type: "error" });
            return;
        }
        if(!id){
            setNotification({ message: "Thiếu mã danh mục để cập nhật", type: "error" });
            return;
        }
        try {
            const response = await axiosConfig.put(
                API_ENDPOINTS.UPDATE_CATEGORY(id),
                { name, type, icon }
            );
            if (response.status === 200 || response.status === 201) {
                const updatedCategory = response.data;
                const updatedType = updatedCategory.type ?? updatedCategory.categoryType ?? type;

                setOpenEditCategoryModal(false);
                setSelectedCategory(null);
                setCategoryData((currentCategories) =>
                    currentCategories.map((category) =>
                        category.id === id
                            ? { ...category, ...updatedCategory, name, type: updatedType, icon }
                            : category
                    )
                );
                setNotification({ message: "Cập nhật danh mục thành công", type: "success" });
            }

        }
        catch(error){
            console.error('Error updating category:', error.response?.data?.message || error.message);
            setNotification({
                message: error.response?.data?.message || "Không thể cập nhật danh mục",
                type: "error"
            });
        }
    }
    return (
         <>
         <Notification message={notification?.message} type={notification?.type} />
         <Dashboard activeMenu= "Danh mục">
           <div className="my-5 mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold">Tất cả danh mục</h2>
                    <button onClick={() => setOpenAddCategoryModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200" 
                    type="button" 
                    aria-label="Thêm danh mục" >
                        <Plus size={15} />
                        Thêm danh mục

                    </button>
                </div>
                <CategoryList categories = {categoryData} onEditCategory={handleEditCategory}/>
                <Modal
                isOpen ={openAddCategoryModal}
                onClose={() => setOpenAddCategoryModal(false)}
                title="Thêm danh mục" >
                     <AddCategoryForm onAddCategory={handleAddCategory} />
                </Modal>
                <Modal
                    isOpen={openEditCategoryModal}
                    onClose={() => {
                    setOpenEditCategoryModal(false)
                    setSelectedCategory(null)
                    } 
                }
                title="Cập nhật danh mục"
                >
                    <AddCategoryForm
                    initialCategoryData={selectedCategory}
                    onAddCategory={handleUpdateCategory}
                    isEditing = {true}
                     />
                </Modal>

           </div>
        </Dashboard>
         </>
    )
}
export default Category;