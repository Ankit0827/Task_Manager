import { useState } from "react"
import { HiOutlineTrash, HiPlus} from "react-icons/hi";


const TodoListInput=({todoList,setTodoList})=>{

    const [option, setOption]=useState("");

    // function to handle adding an option

    const handleAddoption=()=>{
        if(option.trim()){
            setTodoList([...todoList,option.trim()]);
            setOption("");
        }
    }


 // function to handle Deleting an option

    const handleDeleteoption=(index)=>{
        const updateArr=todoList.filter((_,idx)=>idx!==index);
        setTodoList(updateArr);
    }
    return(
        <div className="">
             {
                todoList?.map((item,index)=>(
                    <div className="flex justify-between bg-gray-50  border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2" key={index}>
                           <p className="text-xs">
                            <span className="text-gray-400 font-semibold mr-2">{index<9?`0${index+1}`:index+1}</span>
                            {item}
                            </p>  
                            <button className="cursor-pointer" onClick={()=>handleDeleteoption(index)}>
                                <HiOutlineTrash className="text-lg text-red-500"/>
                            </button>
                    </div>
                ))
             }
             <div className="flex items-center gap-5 mt-4" >
                   <input 
                   type="text" 
                   placeholder="Enter task" 
                   value={option}
                   onChange={({target})=>setOption(target.value)} 
                   className="w-full text-[13px] outline-none text-black border border-gray-300 bg-white px-3 py-2 rounded-md"
                   />

                  <button className="card-btn text-nowrap" onClick={handleAddoption}>
                     <HiPlus className="text-lg"/> Add
                  </button>
                   
             </div>
        </div>
    )
}

export default TodoListInput