import React from 'react'
import { RightOutlined } from '@ant-design/icons';
import MarketplaceItem from './item/MarketplaceItem';
import "../home.css"
const MarketPlace = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="fw-bolder title pb-2 w-fit relative">Market Place</h2>
                <span className='text-blue-500 ml-auto font-semibold cursor-pointer'>Voir plus <RightOutlined /></span>
            </div>



            <div className="row py-3">
                <MarketplaceItem title="Tournevis american ATP 2 x 125mm - Facom" price={140} description="This is a wider card with supporting text below" />
                <MarketplaceItem title="Tournevis american ATP 2 x 125mm - Facom" price={140} description="This is a wider card with supporting text below" />
                <MarketplaceItem title="Tournevis american ATP 2 x 125mm - Facom" price={140} description="This is a wider card with supporting text below" />

            </div>

        </>
    )
}

export default MarketPlace