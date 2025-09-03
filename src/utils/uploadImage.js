import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosIntance";


const uploadImage=async(imageFile)=>{

	const formData=new FormData();
	// Append image file to form Data

	formData.append("profileImage",imageFile);

	try {

		const response= await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData,{
			headers:{
				'Content-Type':'multipart/form-data'//set header for file upload
			}
		})


		// Normalize to return inner data object { imageUrl, filename, ... }
		return response.data?.data ;
		
	} catch (error) {

		console.error('Error uploading image',error);
		throw error; //Rethrow error for handling
		
	}

}

export default uploadImage