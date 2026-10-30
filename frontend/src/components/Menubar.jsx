import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, LogOut, Menu, User, UserCog, X } from "lucide-react";
import { assets } from "../assets/assets";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import Input from "./input";
import ProfilePhotoSelector from "./ProfilePhotoSelector";
import uploadProfileImage from "../util/uploadProfileImage";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import Notification from "./Notification";
import { removeToken, removeUser } from "../util/storage";

const Menubar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { user, setUser, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        removeUser();
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };

    // ── Cập nhật hồ sơ ──
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileNotification, setProfileNotification] = useState(null);

    useEffect(() => {
        const hide = () => setProfileNotification(null);
        window.addEventListener("category-notification-hide", hide);
        return () => window.removeEventListener("category-notification-hide", hide);
    }, []);

    const handleOpenProfile = () => {
        setProfileName(user?.fullName || "");
        setProfileImage(null);
        setShowDropdown(false);
        setOpenProfileModal(true);
    };

    const handleSaveProfile = async () => {
        if (!profileName.trim()) {
            setProfileNotification({ message: "Vui lòng nhập họ và tên", type: "error" });
            return;
        }
        setSavingProfile(true);
        let profileImageUrl = user?.profileImageUrl || "";
        if (profileImage) {
            try {
                profileImageUrl = (await uploadProfileImage(profileImage)) || profileImageUrl;
            } catch (err) {
                console.error("Không tải được ảnh đại diện:", err);
                setProfileNotification({ message: "Tải ảnh lên thất bại, chỉ cập nhật thông tin khác", type: "error" });
            }
        }
        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE, {
                fullName: profileName.trim(),
                profileImageUrl,
            });
            if (response.status === 200) {
                setUser(response.data);
                setOpenProfileModal(false);
                setProfileNotification({ message: "Cập nhật hồ sơ thành công", type: "success" });
            }
        } catch (err) {
            setProfileNotification({
                message: err.response?.data?.message || "Cập nhật hồ sơ không thành công. Vui lòng thử lại.",
                type: "error",
            });
        } finally {
            setSavingProfile(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if(showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);

        }
    },[showDropdown]);

    return (
        <div className="relative flex h-[96px] items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] px-4 sm:px-7 sticky top-0 z-50">
            <div className="flex items-center gap-5">
                <button type="button" onClick={() => setOpenSideMenu(!openSideMenu)} className="hidden rounded p-1 text-black transition-colors hover:bg-gray-100 max-[1080px]:block">
                    {openSideMenu ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
                </button>
                <div className="flex items-center gap-3">
                    <img
                        src={assets.pigLogo}
                        alt="Biểu tượng quản lý tài chính"
                        className="h-[120px] w-[120px] shrink-0 object-contain mix-blend-multiply"
                        onError={(event) => {
                            event.currentTarget.src = assets.logo;
                        }}
                    />
                    <span className="text-xl font-medium text-black truncate">Quản lý tài chính</span>
                </div>
            </div>
            <div className="relative" ref={dropdownRef}>
                <button type="button" onClick={() => setShowDropdown(!showDropdown)} className="flex items-center justify-center w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2">
                    {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Ảnh đại diện" className="h-full w-full object-cover" />
                    ) : (
                        <User className="text-purple-500" size={26} />
                    )}
                </button>
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 py-1 z-50 shadow-lg">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-800 truncate">{user?.fullName || ""}</p>
<p className="text-xs text-gray-500 truncate">Tài khoản: {user?.username || ""}</p>
                        </div>
                        <button type="button" onClick={handleOpenProfile} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                            <UserCog className="w-4 h-4 text-gray-500" />
                            <span>Cập nhật hồ sơ</span>
                        </button>
                        <button type="button" onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-t border-gray-100">
                            <LogOut className="w-4 h-4 text-gray-500" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                )}
            </div>
            <Notification message={profileNotification?.message} type={profileNotification?.type} />
            <Modal isOpen={openProfileModal} onClose={() => setOpenProfileModal(false)} title="Cập nhật hồ sơ" centered>
                <div className="space-y-4">
                    <ProfilePhotoSelector image={profileImage} setImage={setProfileImage} />
                    <Input
                        label="Họ và tên"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                    />
                    <div className="flex justify-end mt-8">
                        <button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {savingProfile ? (
                                <>
                                    <LoaderCircle className="w-4 h-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
            {
                openSideMenu && (
                    <div className="fixed inset-x-0 top-[74px] z-20 max-h-[calc(100vh-74px)] overflow-y-auto bg-white border-b border-gray-200 sm:top-[82px] sm:max-h-[calc(100vh-82px)] lg:hidden">
                        <Sidebar activeMenu={activeMenu} />
                    </div>
                )
            }
        </div>
    );
};

export default Menubar;