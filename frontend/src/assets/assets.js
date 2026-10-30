import { Coins, LayoutDashboard, List, SlidersHorizontal, Wallet } from "lucide-react";
import pigLogo from "./pig-logo.png";
import logo from "./logo.svg";

export const assets = {
    pigLogo,
    logo,
};
export const SIDE_BAR_DATA = [
   {
     id: "01",
        label: "Tổng quan",
        icon: LayoutDashboard,
        path: "/dashboard",
   },
   {
        id: "02",
        label: "Danh mục",
        icon: List,
        path: "/category",
   },
   {
        id: "03",
        label: "Thu nhập",
        icon: Wallet,
        path: "/income",
   },
   {
        id: "04",
        label: "Chi tiêu",
        icon: Coins,
        path: "/expense",
   },
   {
        id: "05",
        label: "Lọc giao dịch",
        icon: SlidersHorizontal,
        path: "/filter",
   },

]