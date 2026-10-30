import { useRef, useState } from "react";
import { Trash, Upload, User } from "lucide-react";

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }
    const handleRemoveImage = (e) => {
        e.preventDefault();
        setImage(null);
        setPreviewUrl(null);

    }
    const onChooseFile = (e) => {
        
        e.preventDefault();
        inputRef.current?.click();
    }
    return (
        <div className="flex justify-center mb-6">

            <input type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden" />
            {!image ? (
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <User className="text-purple-600" size={28} strokeWidth={2.5} />
                    <button
                        type="button"
                        onClick={onChooseFile}
                        aria-label="Tải ảnh đại diện"
                        className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm"
                    >
                        <Upload size={12} strokeWidth={2.5} />
                    </button>
                </div>
            ): (
                <div className="relative h-20 w-20">
                    <img
                        src={previewUrl}
                        alt="Ảnh đại diện"
                        className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        aria-label="Xóa ảnh đại diện"
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-800 text-white shadow-md"
                    >
                        <Trash size={15} strokeWidth={2} />
                    </button>
                </div>
            )}
        </div>
    )
}
export default ProfilePhotoSelector;