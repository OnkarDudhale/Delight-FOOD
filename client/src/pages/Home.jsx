import React, { useState, useRef } from 'react'
import Header from '../components/Header'
import ExploreMenu from '../components/ExploreMenu'
import FoodDisplay from '../components/FoodDisplay';
import AppDownload from '../components/AppDownload';


const Home = () => {
    const [category, setCategory] = useState('All');
    const exploreMenu = useRef(null);

    return (
        <div >
            <Header exploreMenu={exploreMenu} />
            <ExploreMenu category={category} setCategory={setCategory} exploreMenu={exploreMenu} />
            <FoodDisplay category={category} />
            <AppDownload />
        </div>
    )
}

export default Home