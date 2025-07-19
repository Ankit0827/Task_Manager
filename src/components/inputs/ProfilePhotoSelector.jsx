import { useRef, useState } from "react"
import {LuUser,LuUpload,LuTrash} from "react-icons/lu"

const ProfilePhotoSelector=({image,setImage})=>{

    const inputRef=useRef(null)

    const [previewUrl,setPreviewUrl]=useState(null)

    const handleImageChange=(event)=>{
        const file=event.target.files[0]

        if(file){

            //  update image state 
            setImage(file)

            // Generate preview URL from file 

            const preview =URL.createObjectURL(file)

            setPreviewUrl(preview)

        }
    }

    const onChooseFile=()=>{
        inputRef.current.click();
    }

    const handleImageRemove=()=>{
        setImage(null)
        setPreviewUrl(null)
    }

    console.log(image)

    return <div className="flex justify-center mb-6">

        <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange} className="hidden"/>
        {
            !image? (
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
                <LuUser className="text-4xl text-primary"/>
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white absolute -bottom-1 -right-1" onClick={onChooseFile}>
                    <LuUpload/>
                </button>
            </div>):(<div className="relative">
                <img src={previewUrl} alt="profile photo" className="w-20 h-20 rounded-full object-cover"/>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white absolute -bottom-1 -right-1" type="button" onClick={handleImageRemove}>
                    <LuTrash/>
                </button>
            </div>)
        }
              
    </div>
}

export default ProfilePhotoSelector