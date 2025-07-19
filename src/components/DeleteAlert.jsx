
const DeleteAlert=({content,onDelete})=>{
    return(
        <div className="flex items-baseline justify-between">
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button className="flex bg-rose-200 border border-red-500 text-red-600 text-xs items-center justify-center font-medium px-4 py-2 rounded-sm cursor-pointer" type="button" onClick={onDelete}>
                    Delete
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert