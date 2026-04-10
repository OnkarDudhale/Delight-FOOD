import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/frontend_assets/assets.js";
import toast from "react-hot-toast";
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/getCroppedImg.js'

const Profile = () => {

    const { user, axios, fetchUser } = useContext(AppContext);

    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCrop, setShowCrop] = useState(false);



    if (!user) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <p className="text-gray-500 text-lg animate-pulse">
                    Loading profile...
                </p>
            </div>
        );
    }

    const changeProfile = async (profileImage) => {
        try {
            const formData = new FormData();
            formData.append("profile_image", profileImage)
            const response = await axios.post('/api/user/update/profileImage', formData);
            if (response.data.success) {
                toast.success(response.data.message)
                fetchUser()
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    }

    const handleCropSave = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);

            await changeProfile(croppedBlob);

            setShowCrop(false);
            setImage(null);
        } catch (err) {
            console.log(err);
            toast.error("Crop failed");
        }
    };


    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 my-7.5">
            <div className="w-full max-w-md bg-[#fff2ef]  shadow-lg rounded-2xl p-6 border border-gray-100">

                <div className="flex flex-col items-center mb-6">
                    <div className="group relative w-20 h-20 rounded-full border-2 border-[tomato] flex items-center justify-center">
                        <label htmlFor="profile_image">
                            <img className="w-18 h-18 cursor-pointer hover:opacity-70 rounded-full" src={user.profile_image ? user.profile_image : assets.profile_icon} alt="profile_image" />
                            <img className="absolute cursor-pointer hidden group-hover:block inset-0 m-auto" src={assets.edit_icon} alt="edit icon" />
                        </label>
                        <input id="profile_image" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImage(URL.createObjectURL(file));
                                setShowCrop(true);
                            }
                        }} type="file" />
                    </div>
                    {showCrop && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded-lg">
                                <div className="relative w-75 h-75">
                                    <Cropper
                                        image={image}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={(_, croppedPixels) =>
                                            setCroppedAreaPixels(croppedPixels)
                                        }
                                    />
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button
                                        className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
                                        onClick={() => setShowCrop(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="px-3 py-1 cursor-pointer bg-[tomato] text-white rounded"
                                        onClick={handleCropSave}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <h2 className="mt-3 text-xl font-semibold text-gray-800">
                        {user.username}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                        {user.role}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-500">Username</span>
                        <span className="font-medium text-gray-800">
                            {user.username}
                        </span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-800">
                            {user.email}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Role</span>
                        <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-600 font-medium">
                            {user.role}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;