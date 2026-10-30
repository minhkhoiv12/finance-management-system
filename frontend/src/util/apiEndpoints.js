export const BASE_URL = "https://financial-system-api-3zs5.onrender.com/api/v1.0";
//export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1.0";

const CLOUDINARY_CLOUD_NAME = "dd7fcqtnn";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    GET_USER_INFO: "/profile",
    UPDATE_PROFILE: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_IMCOMES: "/incomes",
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_INCOME: "/incomes",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    INCOME_EXCEL_DOWNLOAD: "/excel/download/income",
    FILTER_INCOMES: "/incomes/filter",
    GET_ALL_EXPENSES: "/expenses",
    ADD_EXPENSE: "/expenses",
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    EXPENSE_EXCEL_DOWNLOAD: "/excel/download/expense",
    FILTER_EXPENSES: "/expenses/filter",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    GET_DASHBOARD: "/dashboard",
}