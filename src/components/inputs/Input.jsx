import { useState } from "react"
import {FaRegEye,FaRegEyeSlash} from "react-icons/fa6"
const Input = ({ name, value, onChange, placeholder, type, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  const showHidePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-box-main-div">
      <label className="text-[13px] text-slate-700">{label}</label>
      <div className="input_box">
        <input
          name={name}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="outline-none bg-transparent w-full"
        />
        {type === "password" && (
          showPassword ? (
            <FaRegEye
              size={22}
              className="text-primary cursor-pointer"
              onClick={showHidePassword}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className="text-slate-500 cursor-pointer"
              onClick={showHidePassword}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Input