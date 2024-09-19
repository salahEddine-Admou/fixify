import { CheckCircleFilled, ClockCircleOutlined, DollarCircleOutlined, EnvironmentOutlined, StarFilled } from '@ant-design/icons'
import { Button, Skeleton } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const RepairerCard = ({ repairer, showDrawer, setrepairer }) => {


    const handleShowDrawer = () => {
        showDrawer()
        setrepairer(repairer)
        console.log("Khona:", repairer)
    }
    return (
        <div className='mt-10 col-md-4 container relative shadow'>

            <div class="relative  flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 border border-gray-400">
                <img src={repairer.profilePhoto} className="relative  -mt-10 h-[100px] w-[100px] mx-auto overflow-hidden rounded-circle object-cover" />

                <div class="px-6 pt-3 pb-2">
                    <h5 class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">

                        {repairer.firstName + " " + repairer.lastName}
                        {repairer.pro && (
                            <CheckCircleFilled className='text-blue-500 text-sm ml-1' />
                        )}

                    </h5>
                    <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc felis ligula.
                    </p>
                </div>
                <div class="px-6 pb-2 flex gap-3 items-center">

                    {/* <span className='bg-blue-500 rounded-full text-sm font-semibold text-white px-3 py-1'>PRO</span> */}
                    <div className='text-lg text-gray-700 font-bold mr-3'><DollarCircleOutlined className='text-blue-500 mr-1' />{repairer.price} mad</div>
                </div>
                <div class="p-6 pt-2 flex ">

                    <div className='text-sm text-gray-700 font-semibold'><EnvironmentOutlined className='text-blue-500 mr-1' />{repairer.city}</div>
                    <div className='text-sm text-gray-700 font-semibold ml-2'><ClockCircleOutlined className='text-blue-500 mr-1' />Immediat</div>
                </div>
                <div class="p-6 pt-0 flex items-center">
                    <StarFilled className='text-black' /> {repairer?.reviews?.length ? repairer.reviews.reduce((sum, review) => sum + review.rating, 0) / repairer?.reviews?.length : 0} ({repairer?.reviews?.length})
                    <button
                        className='ml-auto stretched-link btn  btn-primary text-white'
                        type="primary"
                        size='large'

                        onClick={handleShowDrawer}
                    >
                        Consulter
                    </button>
                </div>
            </div>

        </div>

    )
}

export default RepairerCard