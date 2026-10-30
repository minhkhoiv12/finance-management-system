import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { parseVietnameseAmount } from "../util/money";
import IncomeList from "../components/incomeList";
import DeleteAlert from "../components/DeleteAlert";
import AddIncomeForm from "../components/AddIncomeForm";
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import IncomeOverview from "../components/incomeOverview";

const Income = () => {

    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [openAddIncomeModal, setOpenAndIncomeModal] = useState(false);
    const closeAddIncomeModal = () => setOpenAndIncomeModal(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });



    const fetchIncomeDetails = async () => {
        if(loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_IMCOMES);
            if(response.status === 200) {
                setIncomeData(response.data);
            }
        }
        catch(error) {
            console.error('Failed to fetch income details', error);
            setNotification({ message: error.response?.data?.message || "Không thể tải danh sách thu nhập", type: "error" });
        }
        finally {
            setLoading(false);
        }
    }
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        }
        catch (error) {
            console.error("Failed to fetch income categories", error);
            setNotification({
                message: error.response?.data?.message || "Failed to fetch income categories",
                type: "error"
            });
        }
    };
    const handleAddIncome = async (income) => {
        const {name, amount, date, icon, categoryId} = income;
        const today = new Date().toISOString().split('T')[0];

        if (!name.trim()) {
            setNotification({ message: "Vui lòng nhập tên", type: "error" });
            return;
        }
        const numericAmount = parseVietnameseAmount(amount);
        if(!numericAmount || numericAmount <= 0){
            setNotification({ message: "Số tiền phải là số hợp lệ lớn hơn 0", type: "error" });
            return;
        }
        if(!date) {
            setNotification({ message: "Vui lòng chọn ngày", type: "error" });
            return;
        }
        if(date > today) {
            setNotification({ message: "Ngày không được ở tương lai", type: "error" });
            return;
        }
        if(!categoryId){
            setNotification({ message: "Vui lòng chọn danh mục", type: "error" });
            return ;
        }
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: numericAmount,
                date,
                icon,
                categoryId
            })
            if(response.status === 201) {
                setIncomeData((currentIncome) => [response.data, ...currentIncome]);
                closeAddIncomeModal();
                setNotification({ message: "Thêm khoản thu thành công", type: "success" });
                fetchIncomeCategories();
            }
        }
        catch (error){
            setNotification({ message: error.response?.data?.message || "Không thể thêm khoản thu", type: "error" });

        }
    }
    const deleteIncome = async(id) => {
        
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({show: false, data: null});
            setNotification({ message: "Xóa khoản thu thành công", type: "success" });
            fetchIncomeDetails();
        }
        catch(error) {
            console.error('Error deleting income', error);
            setNotification({ message: error.response?.data?.message || "Không thể xóa khoản thu", type: "error" });

        }
        
    }
    const getErrorMessage = async (error, fallbackMessage) => {
        if (error.response?.data instanceof Blob) {
            try {
                const errorData = JSON.parse(await error.response.data.text());
                return errorData.message || fallbackMessage;
            } catch {
                return fallbackMessage;
            }
        }

        return error.response?.data?.message || fallbackMessage;
    };

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = "chi_tiet_thu_nhap.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setNotification({ message: "Tải chi tiết thu nhập thành công", type: "success" });
        } catch (error) {
            setNotification({
                message: await getErrorMessage(error, "Không thể tải chi tiết thu nhập"),
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    },[]);
    return (
         <>
         <Notification message={notification?.message} type={notification?.type} />
         <Dashboard activeMenu= "Thu nhập">
           <div className="my-5 mx-auto">
            <div className="space-y-6">
                <IncomeOverview transactions={incomeData} onAddIncome={() => setOpenAndIncomeModal(true)} />
                <IncomeList transactions={incomeData}
                onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                onDownload={handleDownloadIncomeDetails}
                />
                <Modal 
                isOpen={openAddIncomeModal}
                onClose={closeAddIncomeModal}
                title = "Thêm khoản thu"
                 >
                    <AddIncomeForm
                        onAddIncome = {(income) => handleAddIncome(income)}
                        categories = {categories}
                    />
                 </Modal>
                 <Modal
                 isOpen={openDeleteAlert.show}
                 onClose={() => setOpenDeleteAlert({show: false, data: null})}
                 title="Xóa khoản thu"
                  >
                    <DeleteAlert
                    content="Bạn có chắc muốn xóa khoản thu này không?"
                    onDelete={() => deleteIncome(openDeleteAlert.data)}
                    
                    />
                </Modal>
            </div>
           </div>
        </Dashboard>
        </>
    )
}
export default Income;