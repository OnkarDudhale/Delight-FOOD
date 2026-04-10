import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets.js'
import { AppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const LoginPopUp = ({ setShowLogin }) => {

    const { setToken, axios } = useContext(AppContext);
    const [currentState, setCurrentState] = useState("Login")
    const [showPassword, setShowPassword] = useState(false)
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserData(userData => ({ ...userData, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()
        try {
            const response = currentState === "Login" ?
                await axios.post('api/user/signIn', userData) :
                await axios.post('api/user/signUp', userData);

            if (response.data.success) {

                setToken(response.data.accessToken);
                localStorage.setItem("token", response.data.accessToken);

                setShowLogin(false)
                toast.success(response.data.message);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    return (
        <div className='login-popup absolute z-1 w-full  h-full bg-[#00000090] grid'>
            <form onSubmit={onLogin} className={`login-popup-container max-md:w-[80%] ${currentState === "Login" ? "max-lg:w-[45%] lg:w-[30%]" : "max-md:w-[90%]"} place-self-center w-[max(23vw,330px) text-[#808080] bg-white flex flex-col gap-6 py-6 px-7 rounded-lg text-[14px] fadeIn-fast `} >
                <div className="login-popup-title flex justify-between items-center text-black">
                    <h2 className='text-3xl text-[tomato]'>{currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className='w-4 cursor-pointer' />
                </div>
                <div className="login-popup-inputs flex flex-col gap-5">
                    {
                        currentState === "Login" ? <></> :
                            <input onChange={onChangeHandler} name='username' value={userData.username} className='focus:border-[tomato] focus:border-2 outline-none border border-[#c9c9c9] p-2.5 rounded-sm' type="text" placeholder='Your name ' required />
                    }
                    <input onChange={onChangeHandler} name='email' value={userData.email} className='focus:border-[tomato] focus:border-2 outline-none border border-[#c9c9c9] p-2.5 rounded-sm' type="email" placeholder='Your email' required />
                    <div className="password-show-hide relative flex justify-center items-center">
                        <input type={showPassword ? "text" : "password"} onChange={onChangeHandler} name='password' value={userData.password} className='w-full focus:border-[tomato] focus:border-2 outline-none border border-[#c9c9c9] p-2.5 rounded-sm' placeholder='Password' required />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                        >
                            <img
                                src={showPassword ? assets.hide_icon : assets.show_icon}
                                alt=""
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>
                <button type='submit' className=' border-none p-2 rounded-sm text-white bg-[tomato] text-[15px] cursor-pointer '>{currentState === "Sign Up" ? "Create account " : "Login"}</button>
                {currentState === "Sign Up" ? <div className="login-popup-condition flex items-start gap-2 -mt-3.75">
                    <input className='mt-1.25 ' type="checkbox" required />
                    <p>By continuing , i agree to the terms of use & privacy policy.</p>
                </div> : <></>}
                {currentState === "Login" ?
                    <p >Create a new account? <span className='text-[tomato] font-medium cursor-pointer' onClick={() => setCurrentState("Sign Up")}>Click here</span></p> :
                    <p>Already have an account? <span className='text-[tomato] font-medium cursor-pointer' onClick={() => setCurrentState("Login")}>Login here</span></p>}
            </form>
        </div >
    )
}

export default LoginPopUp