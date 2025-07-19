import { useState } from "react"
import { HiOutlineTrash, HiPlus } from "react-icons/hi";
import { LuPaperclip } from "react-icons/lu";


const AddAttachmentsInput = ({ attachments, setAttachments }) => {
    const [option, setOption] = useState("");


    // function handle addding an option

    const handleAddoption = () => {
        if (option.trim()) {
            setAttachments([...attachments, option.trim()]);
            setOption("")
        }
    }


    // function handle Deleting an option

    const handleDeletingOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);

    }

    return (
        <div className="">
            {
                attachments?.map((items, index) => (
                    <div className="flex justify-between bg-gray-50  border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2" key={index}>
                        <div className="flex flex-1 items-center gap-3 border border-gray-100">
                            <LuPaperclip className="text-gray-400" />
                            <p className="text-xs text-black">{items}</p>
                        </div>
                        <button className="cursor-pointer" onClick={() => handleDeletingOption(index)}>
                            <HiOutlineTrash className="text-lg text-red-500" />
                        </button>
                    </div>
                ))
            }

            <div className="flex items-center gap-5 mt-4" >
                <div className="flex flex-1 items-center gap-3 border border-gray-300  px-3 py-2 rounded-md">
                    <LuPaperclip className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Add File Links"
                        value={option}
                        onChange={({ target }) => setOption(target.value)}
                        className="w-full text-[13px] outline-none text-black  bg-white"
                    />
                </div>

                <button className="card-btn text-nowrap" onClick={handleAddoption}>
                    <HiPlus className="text-lg" /> Add
                </button>

            </div>
        </div>
    )
}
export default AddAttachmentsInput