import { CheckCircle2, CircleAlert } from "lucide-react";
import { useEffect } from "react";

const Notification = ({ message, type = "success" }) => {
    useEffect(() => {
        if (!message) return undefined;

        const timer = setTimeout(() => {
            window.dispatchEvent(new Event("category-notification-hide"));
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;

    const isSuccess = type === "success";

    return (
        <div
            className="fixed left-1/2 top-5 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg"
            role="status"
            aria-live="polite"
        >
            {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
                <CircleAlert className="h-5 w-5 text-red-500" />
            )}
            <span>{message}</span>
        </div>
    );
};

export default Notification;
