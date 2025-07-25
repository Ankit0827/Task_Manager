

const TaskStatusTabs=({tabs,activeTabs,setActiveTabs})=>{
    return(
        <div className="my-2">
            <div className="flex">
            {
                tabs.map((tab)=>(
                   <button key={tab.label} className={`relative px-3 md:px-4 text-sm font-medium ${activeTabs===tab.label?"text-primary":"text-gray-500 hover:text-gray-700"} cursor-pointer`} onClick={()=>{setActiveTabs(tab.label)}}>
                    <div className="flex items-center">
                        <span className="text-xs">{tab.label}</span>
                        <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${activeTabs === tab.label?"bg-primary text-white":"bg-gray-200/70 text-gray-600"}`}>{tab.count}</span>
                    </div>
                    {activeTabs===tab.label && (
                        <div className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-primary"></div>
                    )}
                   </button>
                ))
            }
            </div>
        </div>
    )
}

export default TaskStatusTabs