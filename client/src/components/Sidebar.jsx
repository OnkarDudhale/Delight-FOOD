import { adminAssets } from '../assets/admin_assets/assets.js'
import { NavLink, Outlet } from 'react-router-dom'

const Sidebar = () => {
    const sidebarLinks = [
        {
            name: "Orders",
            path: "/orders",
            icon: adminAssets.order_icon,
            end: true
        }, {
            name: "Order History",
            path: "/orders/history",
            icon: adminAssets.order_icon
        }
    ]

    return (
        <div className='lg:flex lg:h-screen  gap-10'>
            <div className="max-lg:hidden lg:w-50 w-12 border-r h-[95vh] text-base pt-10 border-gray-300  flex flex-col  pl-[2%]">
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end={item.end} className={({ isActive }) => `flex items-center gap-5  my-1 p-3 border-l border-y rounded-l-sm
                ${isActive ? " bg-[#fff0ed] border-[tomato] border-y-2 border-l-2" : "hover:bg-gray-100/90 "} border-[#a9a9a9]`}>
                        <img src={item.icon} alt="item-icon" />
                        <p className='lg:block text-center hidden'>{item.name}</p>
                    </NavLink>

                ))}
            </div >
            <div className="lg:hidden flex text-base  border-t w-full justify-around  border-gray-300 ">
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end={item.end} className={({ isActive }) => `flex flex-col items-center justify-between  p-3 border-b border-x rounded-l-sm 
                ${isActive ? " bg-[#fff0ed] border-[tomato] border-x-2 border-b-2" : "hover:bg-gray-100/90 "}  border-[#a9a9a9]`}>
                        <img src={item.icon} alt="item-icon" />
                        <p className='lg:block text-center '>{item.name}</p>
                    </NavLink>

                ))}
            </div >
            <div className="flex-1  overflow-y-auto 
            scrollbar-thin scrollbar-thumb-red-100 scrollbar-track-transparent hover:scrollbar-thumb-red-100">
                <div className=" lg:mr-10">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Sidebar