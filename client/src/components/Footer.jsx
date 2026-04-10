import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {
    return (
        <div className=' max-md:gap-2.5 max-md:py-2  max-md:pt-10 footer mt-24 text-[#d9d9d9] bg-[#323232] flex flex-col items-center gap-5 py-5 px-[8vw] pt-15 ' id='footer'>

            <div className="footer-content w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-20 max-md:gap-10">
                <div className="footer-content-left flex flex-col items-start gap-5 max-md:gap-2">
                    <img className='max-lg:w-25 w-48' src={assets.delight_bgBlack_logo} alt="" />
                    <p className='max-md:text-[13px]'>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                    <div className="footer-social-icons flex">
                        <img className='w-10 mr-3.5 max-md:w-7 max-md:mr-2' src={assets.facebook_icon} alt="" />
                        <img className='w-10 mr-3.5 max-md:w-7 max-md:mr-2' src={assets.twitter_icon} alt="" />
                        <img className='w-10 mr-3.5 max-md:w-7 max-md:mr-2' src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className=" footer-info flex justify-between">
                    <div className="footer-content-center flex flex-col items-start gap-5 max-md:gap-2">
                        <h2 className='text-3xl max-md:text-[18px] text-white'>COMPANY</h2>
                        <ul>
                            <li className='lg:mb-2.5 max-md:mb-1 cursor-pointer max-md:text-[13px]'>Home</li>
                            <li className='lg:mb-2.5 max-md:mb-1 cursor-pointer max-md:text-[13px]'>About us</li>
                            <li className='lg:mb-2.5 max-md:mb-1 cursor-pointer max-md:text-[13px]'>Delivery</li>
                            <li className='lg:mb-2.5 max-md:mb-1 cursor-pointer max-md:text-[13px]'>Privacy policy</li>
                        </ul>
                    </div>
                    <div className="footer-content-right flex flex-col items-start gap-5 max-md:gap-2">
                        <h2 className="text-3xl max-md:text-[18px] text-white">GET IN TOUCH</h2>
                        <ul>
                            <li className='mb-2.5 cursor-pointer max-md:text-[14px]'>+1-212-456-7890</li>
                            <li className='mb-2.5 cursor-pointer max-md:text-[14px]'>contact@delight.com</li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className='w-full h-0.5 my-5 bg-gray-400 border-none max-md:my-2' />
            <p className="footer-copyright max-md:text-[13px]">
                Copyright 2026 @ delight.com -All Right Reserved
            </p>
        </div>
    )
}

export default Footer