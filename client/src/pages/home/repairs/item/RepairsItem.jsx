import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from 'antd';
import { CheckCircleFilled, ClockCircleOutlined, EnvironmentOutlined, StarFilled, UserOutlined } from '@ant-design/icons'; // Importez l'icône d'utilisateur par défaut

const RepairsItem = ({ repairer, itemsPerView }) => {
    const getWidthClass = () => {
        switch (itemsPerView) {
            case 1:
                return 'w-full';
            case 2:
                return 'w-1/2';
            case 3:
            default:
                return 'w-1/3';
        }
    };

    return (


        <div className='mt-10 mb-3 sm:mb-0 col-md-4 container relative'>
            <Link to={`/front/repairer/${repairer.id}`}>


                <div class="relative  flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 border border-gray-400  shadow-md">
                    <img src={repairer.imageProfile} className="relative  -mt-10 h-[100px] w-[100px] mx-auto overflow-hidden rounded-circle object-cover" />

                    <div class="px-6 pt-3 pb-2">
                        <h5 class="mb-2 block font-sans mx-auto text-center text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">

                            {repairer.firstName + " " + repairer.lastName}
                            {repairer.pro && (
                                <CheckCircleFilled className='text-blue-500 text-sm ml-1' />
                            )}
                        </h5>
                    </div>
                    <div class="px-6 pb-2">
                        {repairer.pro && (
                            <span className='bg-blue-500 rounded-full text-sm font-semibold text-white px-3 py-1'>PRO</span>
                        )}
                    </div>
                    <div class="p-6 pt-2 flex ">
                        <div className='text-sm text-gray-700 font-semibold'><EnvironmentOutlined className='text-blue-500 mr-1' />{repairer.city}</div>
                        <div className='text-sm text-gray-700 font-semibold ml-2'><ClockCircleOutlined className='text-blue-500 mr-1' />Immediat</div>
                    </div>
                    <div className="p-6 pt-0 flex items-center justify-center">
                        <StarFilled className='text-black' /> {repairer?.reviews?.length ? (repairer.reviews.reduce((sum, review) => sum + review.rating, 0) / repairer.reviews.length).toFixed(1) : 0} ({repairer?.reviews?.length})
                    </div>
                </div>

            </Link>
        </div>
    );
};

export default RepairsItem;
