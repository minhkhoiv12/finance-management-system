import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { LoaderCircle } from "lucide-react";
import Input from "../components/input";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { saveToken, saveUser } from "../util/storage";
import Notification from "../components/Notification";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(AppContext);
    const location = useLocation();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (location.state?.notification) {
            setNotification(location.state.notification);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        const hideNotification = () => setNotification(null);
        window.addEventListener("category-notification-hide", hideNotification);
        return () => window.removeEventListener("category-notification-hide", hideNotification);
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
       
        
        if(!username.trim()){
            setError("Vui lòng nhập tên tài khoản");
            setIsLoading(false);
            return;
        }
        if(!password.trim()){
            setError("Vui lòng nhập mật khẩu");
            setIsLoading(false);
            return;
        }
        setError("");
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                username,
                password,
            })  
            const {token, user} = response.data;
            if(token) {
                saveToken(token);
                saveUser(user);
                setUser(user);
                navigate("/dashboard", { state: { notification: { message: "Đăng nhập thành công!", type: "success" } } });
            } else {
                setError(response.data?.message || response.data?.error || "Đăng nhập thất bại. Vui lòng thử lại.");
            }
        } catch(error) {
            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                (error.code === "ECONNABORTED"
                    ? "Máy chủ phản hồi quá lâu. Vui lòng thử lại."
                    : error.message)
            );
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
        <>
        <Notification message={notification?.message} type={notification?.type} />
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8FC] px-4 py-8">
            <section className="relative z-10 w-full max-w-md rounded-3xl border border-white bg-white p-8 shadow-xl shadow-teal-950/10 sm:p-10">
                <img src={assets.pigLogo} alt="Quản lý tài chính" className="-mt-4 mb-4 h-32 w-auto mix-blend-multiply mx-auto" />
                <h1 className="text-center text-3xl font-bold text-slate-900">Chào mừng trở lại</h1>
                <p className="mt-2 text-center text-slate-500">Quản lý tài chính của bạn dễ dàng hơn mỗi ngày.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-2">
                    <Input label="Tên tài khoản" type="text" placeholder="Nhập tên tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input label="Mật khẩu" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && (
                        <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}
                    <button disabled={isLoading} type="submit" className={`mt-4 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-[#6B21A8] flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed': ''}`}>
                        {isLoading ? (
                            <>
                                <LoaderCircle className="animate-spin w-5 h-5" />
                                Đang đăng nhập...
                            </>
                        ) : (
                            "ĐĂNG NHẬP"
                        )}
                        
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">Chưa có tài khoản? <Link to="/signup" className="font-semibold text-black hover:text-[#6B21A8] hover:underline">Tạo tài khoản</Link></p>
                
            </section>
        </main>
        </>
    );
};

export default Login;