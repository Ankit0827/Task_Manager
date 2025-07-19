import { useState } from "react"
import { LuChevronDown } from "react-icons/lu";

const SelecDropdown = ({ options, value, onChange, placeholder }) => {

    const [isOpen, setIsOpen] = useState(false);


    const handleSelect = (option) => {
        onChange(option)
        setIsOpen(false)

    }
    return (
        <div className="relative w-full mt-4">
            {/* Deop Down Button */}
            <button className="w-full text-sm outline-none  border border-slate-300 px-2.5 py-3 rounded-md flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className="ml-2">{isOpen ? <LuChevronDown className="rotate-180" /> : <LuChevronDown />}</span>
            </button>
            {/* Drop down Menu */}
            {
                isOpen && (
                    <div className="absolute w-full border bg-white  border-slate-300 rounded-md mt-1 shadow-md z-10">
                        {options?.map((option) => (
                            <div key={option.value} onClick={() => handleSelect(option.value)} className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100">
                                {option.label}
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default SelecDropdown