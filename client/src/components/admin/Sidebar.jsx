import React from 'react'
import { adminAssets } from '../../assets/admin_assets/assets.js'
import { NavLink, Outlet } from 'react-router-dom'

const Sidebar = () => {
    const sidebarLinks = [
        {
            name: "Add Food Items",
            path: "/admin",
            icon: adminAssets.add_icon,
            end: true
        }, {
            name: "List Food Items",
            path: "/admin/list",
            icon: adminAssets.product_list_icon
        }, {
            name: "Orders",
            path: "/admin/orders",
            icon: adminAssets.order_icon
        }
    ]

    return (
        <div className='flex h-[calc(100vh-80px)] max-md:mt-[5vh] mt-[7vw]'>
            <div className="fixed md:w-64 w-16 border-r h-[95vh] text-base pt-10 border-gray-300  flex flex-col pl-[2%]">
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end={item.end} className={({ isActive }) => `flex items-center gap-10 px-4 my-1 py-3 border-l border-y rounded-l-sm
                ${isActive ? " bg-[#fff0ed] border-[tomato] border-y-2 border-l-2" : "hover:bg-gray-100/90 "} border-[#a9a9a9]`}>
                        <img src={item.icon} alt="item-icon" />
                        <p className='md:block text-center hidden'>{item.name}</p>
                    </NavLink>

                ))}
            </div >
            <div className="flex-1 overflow-y-auto md:ml-64 ml-16 mb-10">
                <Outlet />
            </div>
        </div>
    )
}

export default Sidebar