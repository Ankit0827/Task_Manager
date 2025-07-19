

const StatCard=({label,count,status})=>{
    
     const getStatusTagColor = () => {
        switch (status) {
            case "In progress":
                return "text-cyan-600";
            case "Completed":
                return "text-lime-600";
            default:
                return "text-violet-600";
        }
    };

    return (
        <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded-xl`}>
            <p className="text-[12px] font-semibold">{count}</p>
            <p className="">{label}</p>
        </div>
    )
}

export default StatCard