import { useContext } from 'react';
import { adminAssets } from '../../assets/admin_assets/assets.js'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
const Navbar = () => {

    const { user } = useContext(AppContext);
    const navigate = useNavigate()
    return (
        <div className='fixed navbar w-full border-b shadow-sm border-gray-300 bg-white flex justify-between  items-center py-2 mb-2 px-[4%] '>
            <div className="max-md:w-20">
                <img src={adminAssets.admin_logo} alt="admin-logo" className="logo w-[max(15%,100px)]" />
            </div>
            <div className="flex items-center gap-8">
                <div onClick={() => navigate('/')} className="group relative flex flex-col justify-center cursor-pointer">
                    <img src={adminAssets.home_page_icon} alt="home" className='home max-md:w-9 md:w-25' />
                    <div className="absolute hidden group-hover:block transition duration-300 delay-150 ">
                        <p className='text-orange-700 '>home</p>
                    </div>
                </div>
                <div className="profile_icon">
                    <img src={user ? user.profile_image : adminAssets.profile_icon} alt="profile-image" className="profile max-md:w-9 md:w-30 rounded-full" />
                </div>
            </div>

        </div>
    )
}

export default Navbar