import { menu_list } from '../assets/frontend_assets/assets.js'

const ExploreMenu = ({ category, setCategory, exploreMenu }) => {

  return (
    <div ref={exploreMenu} className='explore-menu flex-col gap-5 ' id='explore-menu'>
      <h1 className='text-4xl max-md:text-2xl text-[rgb(38,38,38)] font-medium'>Explore our menu</h1>
      <p className='explore-menu-text max-md:max-w-[90%] max-w-[70%] text-[#808080] text-[18px] max-md:text-[15px]'>Choose from a diverse menu of delicious dishes, crafted with the finest ingredients to satisfy every craving.</p>
      <div className="explore-menu-list flex justify-between items-center gap-7.5 max-md:gap-5 text-center my-5 overflow-x-scroll">
        {menu_list.map((item, index) => {
          const isSelected = category === item.menu_name;
          return (
            <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className="explore-menu-list-item">
              <img className={`
                  ${isSelected ? "border-4 border-[tomato] p-0.5 rounded-full" : "animate-spin"}
                  hover:opacity-75 w-[7.5vw] min-w-20 cursor-pointer transition duration-200
                  [animation-duration:10s] hover:animate-none
                `} src={item.menu_image} alt="" />
              <p className='mt-2.5 text-[#747474] text-[max(1.4vw,16px)] cursor-pointer'>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr className='my-2.5 h-0.5 bg-[#e2e2e2] border-none' />
    </div>

  )
}

export default ExploreMenu