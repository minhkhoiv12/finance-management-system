import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({isOpen, onClose, children,title, centered}) => {
    if(!isOpen) return null;
    // centered: overlay phủ toàn màn hình (kể cả header), mọi thành phần phía sau bị mờ, khung nằm giữa màn hình
    // createPortal: render ra document.body để không bị ancestor có backdrop-filter/transform
    // ép position: fixed định vị theo chính nó (trước đây overlay bị giam trong thanh header 96px)
    return createPortal(
        <div className={`fixed left-0 right-0 bottom-0 z-[9998] flex items-center justify-center overflow-y-auto bg-slate-900/55 px-4 py-6 backdrop-blur-[1px] ${centered ? "top-0" : "top-[96px]"}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div className="relative my-auto w-full max-w-[548px]">
                <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h3 className="text-base font-bold text-slate-900">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            type="button"
                            aria-label="Đóng hộp thoại"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                            <X size={16} strokeWidth={2} />
                        </button>
                    </div>
                    <div className="px-5 py-6 text-slate-700 sm:px-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default Modal;