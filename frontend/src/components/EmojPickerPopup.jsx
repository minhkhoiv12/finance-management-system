import { Image as ImageIcon, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

const EmojiPickerPopup = ({icon, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleEmojiClick = (emoji) => {
        onSelect(emoji?.imageUrl || "");
        setIsOpen(false);
    }
    return (
        <div className="mb-4 flex flex-col items-start gap-3 md:flex-row">
            <div onClick={() => setIsOpen(true)}
            className="flex cursor-pointer items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                    {
                        icon ? (
                                <img src={icon} alt="Biểu tượng danh mục" className="h-11 w-11 rounded-lg" />
                        ) : (
                            <ImageIcon size={24} />
                        )
                    }
                </div>
                <p className="text-sm font-medium text-slate-700">{icon ? "Đổi biểu tượng" : "Chọn biểu tượng"}</p>
                </div>
                {isOpen && (
                    <div className="relative">
                        <button onClick={() => setIsOpen(false)}
                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer">
                        <X />
                        </button>
                        <EmojiPicker
                        open={isOpen}
                        onEmojiClick={handleEmojiClick}
                         />
                    </div>
                )}
            </div>
    )
}
export default EmojiPickerPopup;