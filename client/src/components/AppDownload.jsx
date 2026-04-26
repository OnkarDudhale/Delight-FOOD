import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const AppDownload = () => {

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className='relative app-download m-auto mt-25 text-[max(3vw,20px)] text-center font-medium' id='app-download'>
            <div onClick={goToTop} className="absolute max-md:hidden right-5 bottom-0 bg-gray-100  hover:bg-gray-50 border border-transparent hover:border-[tomato] rounded-4xl p-2 transform hover:scale-110 delay-100 duration-250 cursor-pointer">
                <img className='w-6 h-6  ' src={assets.top_image} alt="" />
            </div>
            <p className='flex justify-center gap-[max(2vw,10px)] mt-10'>For Better Experience Download <br /> Delight FOOD App</p>
            <div className="app-download-platforms flex justify-center gap-[max(2vw,10px)] mt-10">
                <img className='w-[max(30vw,120px)] max-w-45 transition duration-500 cursor-pointer hover:transform-[scale(1.05)]' src={assets.play_store} alt="" />
                <img className='w-[max(30vw,120px)] max-w-45 transition duration-500 cursor-pointer hover:transform-[scale(1.05)]' src={assets.app_store} alt="" />
            </div>
        </div>
    )
}

export default AppDownload