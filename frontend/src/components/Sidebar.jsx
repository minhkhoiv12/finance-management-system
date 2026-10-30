import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { SIDE_BAR_DATA } from "../assets/assets";
import { User } from "lucide-react";

const Sidebar = ({activeMenu}) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <aside className="w-full bg-white border-gray-200/50 px-3 pb-3 pt-2 lg:w-64 lg:h-[calc(100vh-74px)] lg:sticky lg:top-[74px] lg:z-20 lg:px-5 lg:pb-5 lg:pt-2">
            <div className="flex flex-col items-center justify-center gap-3 mb-7">
                {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="profile image" className="w-20 h-20 bg-slate-400 rounded-full object-cover" />
                ) : (
                    <User className="w-20 h-20 text-gray-500" />
                )}
                <h5 className="text-gray-950 font-medium leading-6">{user?.fullName || ""}</h5>
            </div>
            <nav>
                {SIDE_BAR_DATA.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                        onClick = {() => navigate(item.path)}
                            key={`menu_${item.id}`}
                            type="button"
                            
                            className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-colors hover:bg-purple-800 hover:text-white ${activeMenu === item.label ? "text-white bg-purple-800" : "text-slate-800"}`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;