import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert = ({content, onDelete}) => {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div className="min-h-[84px]">
            <p className="text-sm font-medium text-slate-800">{content}</p>
            <div className="mt-7 flex justify-end">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Đang xóa...
                        </>
                    ) : (
                        "Xóa"
                    )}
                </button>
            </div>
        </div>
    )
}
export default DeleteAlert;