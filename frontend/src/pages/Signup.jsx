import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/input";
import { assets } from "../assets/assets";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { Check, CircleAlert, LoaderCircle, X } from "lucide-react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import uploadProfileImage from "../util/uploadProfileImage";
import Notification from "../components/Notification";

const passwordRules = [
    { id: "length", label: "Mật khẩu phải có ít nhất 8 ký tự.", test: (pwd) => pwd.length >= 8 },
    { id: "upper", label: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.", test: (pwd) => /[A-Z]/.test(pwd) },
    { id: "lower", label: "Mật khẩu phải chứa ít nhất một chữ cái viết thường.", test: (pwd) => /[a-z]/.test(pwd) },
    { id: "number", label: "Mật khẩu phải chứa ít nhất một chữ số.", test: (pwd) => /[0-9]/.test(pwd) },
    { id: "special", label: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.", test: (pwd) => /[@#$%!*\-_]/.test(pwd) },
];

const validatePassword = (pwd) => {
    if (!pwd || !pwd.trim()) return "Vui lòng nhập mật khẩu";
    const ruleResults = passwordRules.map((rule) => ({ ...rule, passed: rule.test(pwd) }));
    const failed = ruleResults.find((r) => !r.passed);
    if (failed) return failed.label;
    return null;
};

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = "";
        setIsLoading(true);
        setError(null);

        if (!fullName.trim()) {
            setError("Vui lòng nhập họ và tên");
            setIsLoading(false);
            return;
        }

        if (!username.trim()) {
            setError("Vui lòng nhập tên tài khoản");
            setIsLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
            return;
        }

        try {
            if (profilePhoto) {
                try {
                    const imageUrl = await uploadProfileImage(profilePhoto);
                    profileImageUrl = imageUrl || "";
                } catch (uploadErr) {
                    console.error(uploadErr);
                }
            }

            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName: fullName.trim(),
                username: username.trim(),
                password,
                profileImageUrl,
            });

            if (response?.status === 201) {
                const data = response.data || {};
                const msg = data?.message || data?.error || "";
                const lower = String(msg).toLowerCase();
                if (
                    lower.includes("username") ||
                    lower.includes("tài khoản") ||
                    lower.includes("exist") ||
                    lower.includes("exists") ||
                    lower.includes("duplicate") ||
                    lower.includes("tồn tại") ||
                    lower.includes("đã có")
                ) {
                    setError("Tên tài khoản đã tồn tại");
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                navigate("/login", { state: { notification: { message: "Đăng ký thành công!", type: "success" } } });
                return;
            }

            const serverMsg = response?.data?.message || response?.data?.error || "";
            const lowerMsg = String(serverMsg).toLowerCase();
            if (
                lowerMsg.includes("username") ||
                lowerMsg.includes("tài khoản") ||
                lowerMsg.includes("exist") ||
                lowerMsg.includes("exists") ||
                lowerMsg.includes("duplicate") ||
                lowerMsg.includes("tồn tại") ||
                lowerMsg.includes("đã có")
            ) {
                setError("Tên tài khoản đã tồn tại");
            } else {
                setError(serverMsg || "Đăng ký thất bại. Vui lòng thử lại.");
            }
            setIsLoading(false);
            return;
        } catch (err) {
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error || "";
            const lowerMsg = String(serverMsg).toLowerCase();
            if (
                lowerMsg.includes("username") ||
                lowerMsg.includes("tài khoản") ||
                lowerMsg.includes("exist") ||
                lowerMsg.includes("exists") ||
                lowerMsg.includes("duplicate") ||
                lowerMsg.includes("tồn tại") ||
                lowerMsg.includes("đã có")
            ) {
                setError("Tên tài khoản đã tồn tại");
            } else {
                setError(
                    serverMsg ||
                        (err?.code === "ECONNABORTED"
                            ? "Máy chủ phản hồi quá lâu. Vui lòng thử lại."
                            : "Không thể tạo tài khoản. Vui lòng thử lại.")
                );
            }
            setIsLoading(false);
            return;
        }
    };

    return (
        <>
            <Notification message={notification?.message} type={notification?.type} />
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8FC] px-4 py-8">
                <section className="relative z-10 w-full max-w-lg rounded-3xl border border-white bg-white p-7 shadow-xl shadow-teal-950/10 sm:p-10">
                    <img src={assets.pigLogo} alt="Quản lý tài chính" className="-mt-4 mb-4 h-32 w-auto mix-blend-multiply mx-auto" />
                    <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">Tạo tài khoản</h1>
                    <p className="mt-2 text-center text-sm text-slate-600">Bắt đầu quản lý tài chính rõ ràng và chủ động.</p>
                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="flex justify-center mb-6">
                            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                        </div>
                        <div className="grid gap-x-4 sm:grid-cols-2">
                            <Input label="Họ và tên" type="text" placeholder="Nguyễn Văn A" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            <Input label="Tên tài khoản" type="text" placeholder="Nhập tên tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <Input label="Mật khẩu" type="password" placeholder="Ít nhất 8 ký tự" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="mt-2 mb-4 space-y-1.5">
                            {passwordRules.map((rule) => {
                                const passed = password ? rule.test(password) : false;
                                return (
                                    <div key={rule.id} className={`flex items-center gap-2 text-xs ${passed ? "text-emerald-600" : "text-slate-400"}`}>
                                        {passed ? <Check size={14} /> : <X size={14} />}
                                        <span>{rule.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded mb-3 flex items-center justify-center gap-2">
                                <CircleAlert size={16} />
                                {error}
                            </p>
                        )}
                        <button disabled={isLoading} className={`mt-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-[#6B21A8] flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`} type="submit">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                "ĐĂNG KÝ"
                            )}
                        </button>
                        <p className="mt-6 text-center text-sm text-slate-600">Đã có tài khoản? <Link to="/login" className="font-semibold text-black hover:text-[#6B21A8] hover:underline">Đăng nhập</Link></p>
                    </form>
                </section>
            </main>
        </>
    );
};

export default Signup;
