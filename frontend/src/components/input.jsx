import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({label, value, onChange, placeholder, type, isSelect, options = []}) => {
   const [showPassword, setShowPassword] = useState(false);
   const toggleShowPassword = () => {
    setShowPassword(!showPassword);

   }
    return (
       <div className="mb-3">
        <label htmlFor="" className="text-[13px] text text-slate-800 block mb-1">
            {label}
        </label>
        <div className="relative">
            {isSelect ? (
                <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                value = {value}
                onChange = {(e) => onChange(e)}
                >{options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}

                </select>
            ) : (
            <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100" type={type === 'password' ? (showPassword ? 'text' : 'password') : type} placeholder={placeholder} value={value} onChange={onChange}  />
            )}
            {type === 'password' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-poiter">
                    {showPassword ? (
                        <Eye
                        size = {20}
                        className="text-purple-800"
                        onClick={toggleShowPassword}

                        />
                    ) : (
                        <EyeOff
                            size= {20}
                            className="text-slate-400"
                            onClick={toggleShowPassword}
                        />
                    )}
                </span>
            )}
        </div>
       </div>
    )
}
export default Input;