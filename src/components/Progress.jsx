

const Progress=({progress,status})=>{

     const getColor=()=>{
        switch(status){
            case "In progress":
            return "text-cyan-500 bg-cyan-100 border border-cyan-500/10";

            case "Completed":
            return "text-blue-800 bg-blue-300 border border-blue-500/20";

            default:
            return "text-voilet-500 bg-voilet-100 border border-voilet-500/10";
        }
    };
    return(
        <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`${getColor()} h-1.5 rounded-full `} style={{width:`${progress}%`}}></div>
        </div>
    )
}

export default Progress


