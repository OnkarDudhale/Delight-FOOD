
const Header = ({ exploreMenu }) => {

    const scrollToSection = () => {
        exploreMenu.current.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className=' header h-[36vw] mt-1 mb-7.5 mx-auto  bg-[url("/header_img.png")] max-md:rounded-[10px] rounded-2xl bg-no-repeat bg-contain relative'>
            <div className="header-content absolute mx-auto h-full flex flex-col items-start gap-[1.5vw] max-w-[60%]  left-[6vw] fadeIn">
                <h2 className='font-semibold text-[max(3.5vw,18px)] max-md:text-[max(3vw,15px)] text-white max-md:mb-2 mt-[9vw]'>Order your favourite food here</h2>
                <p className='max-sm:hidden text-white text-[1.3vw]'>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <button onClick={scrollToSection} className='transform hover:scale-110  duration-500 cursor-pointer text-center max-md:rounded-4xl max-md:py-1 max-md:px-2 max-md:text-[max(0.4vw,6px)] border-none text-[#747474] font-medium py-[1vw] px-[2.3vw] bg-white text-[max(1.1vw,14px)] rounded-3xl absolute bottom-[5vw] mt-[5vw] '>View Menu</button>
            </div>
        </div>
    )
}

export default Header