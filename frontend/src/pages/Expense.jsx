import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { parseVietnameseAmount } from "../util/money";
import ExpenseOverview from "../components/expenseOverview";
import ExpenseList from "../components/expenseList";
import AddExpenseForm from "../components/AddExpenseForm";
import DeleteAlert from "../components/DeleteAlert";
import Modal from "../components/Modal";
import Notification from "../components/Notification";

const Expense = () => {
    useUser();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [notification, setNotification] = useState(null);
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

    const fetchExpenses = async () => { try { const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES); setExpenseData(response.data); } catch (error) { setNotification({ message: error.response?.data?.message || "Không thể tải danh sách khoản chi", type: "error" }); } };
    const fetchCategories = async () => { try { const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense")); setCategories(response.data); } catch (error) { setNotification({ message: error.response?.data?.message || "Không thể tải danh mục chi tiêu", type: "error" }); } };
    useEffect(() => { fetchExpenses(); fetchCategories(); }, []);

    const handleAddExpense = async ({ name, amount, date, icon, categoryId }) => {
        const today = new Date().toISOString().split("T")[0];
        if (!name.trim()) return setNotification({ message: "Vui lòng nhập tên", type: "error" });
        const numericAmount = parseVietnameseAmount(amount);
        if (!numericAmount || numericAmount <= 0) return setNotification({ message: "Số tiền phải lớn hơn 0", type: "error" });
        if (!date || date > today) return setNotification({ message: "Vui lòng nhập ngày hợp lệ", type: "error" });
        if (!categoryId) return setNotification({ message: "Vui lòng chọn danh mục", type: "error" });
        try { await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, { name, amount: numericAmount, date, icon, categoryId }); setOpenAddExpenseModal(false); setNotification({ message: "Thêm khoản chi thành công", type: "success" }); await fetchExpenses(); } catch (error) { setNotification({ message: error.response?.data?.message || "Không thể thêm khoản chi", type: "error" }); }
    };
    const deleteExpense = async (id) => { try { await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id)); setOpenDeleteAlert({ show: false, data: null }); setNotification({ message: "Xóa khoản chi thành công", type: "success" }); await fetchExpenses(); } catch (error) { setNotification({ message: error.response?.data?.message || "Không thể xóa khoản chi", type: "error" }); } };
    const getErrorMessage = async (error, fallback) => { if (error.response?.data instanceof Blob) { try { return JSON.parse(await error.response.data.text()).message || fallback; } catch { return fallback; } } return error.response?.data?.message || fallback; };
    const downloadExpense = async () => { try { const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, { responseType: "blob" }); const url = window.URL.createObjectURL(new Blob([response.data])); const link = document.createElement("a"); link.href = url; link.download = "chi_tiet_chi_tieu.xlsx"; document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url); setNotification({ message: "Tải chi tiết chi tiêu thành công", type: "success" }); } catch (error) { setNotification({ message: await getErrorMessage(error, "Không thể tải chi tiết chi tiêu"), type: "error" }); } };

    return <><Notification message={notification?.message} type={notification?.type} /><Dashboard activeMenu="Chi tiêu"><div className="my-5 mx-auto"><div className="space-y-6"><ExpenseOverview transactions={expenseData} onAddExpense={() => setOpenAddExpenseModal(true)} /><ExpenseList transactions={expenseData} onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })} onDownload={downloadExpense} /><Modal isOpen={openAddExpenseModal} onClose={() => setOpenAddExpenseModal(false)} title="Thêm khoản chi"><AddExpenseForm onAddExpense={handleAddExpense} categories={categories} /></Modal><Modal isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({ show: false, data: null })} title="Xóa khoản chi"><DeleteAlert content="Bạn có chắc muốn xóa khoản chi này không?" onDelete={() => deleteExpense(openDeleteAlert.data)} /></Modal></div></div></Dashboard></>;
};
export default Expense;