import React from 'react'
import { featuresImg } from '../../../assets'
import { ToolOutlined, CalendarOutlined, SafetyCertificateOutlined } from '@ant-design/icons'

const Features = () => {
    return (
        <section class="relative my-10 flex overflow-hidden  flex-col w-full rounded-3xl px-4   pt-10 pb-3 text-gray-700  bg-white shadow-md    lg:flex-row">
            <div className="ball bg-blue-500 rounded-circle h-[81px] w-[92px] absolute top-[-31px] right-[-44px] z-20"></div>
            <div className="ball bg-blue-500 rounded-circle h-[81px] w-[92px] absolute bottom-[-31px] left-[-44px] z-20"></div>
            <div class="mr-2">
                <h2 class="mb-4 text-4xl font-medium">Une meilleure   <span class="text-blue-600">Expérience de réparation</span></h2>
                <p class="mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum nemo obcaecati commodi itaque aliquam.</p>
                <div class="mb-4 space-y-4">
                    <div class="flex space-x-2">
                        <span class="text-blue-500">
                            <ToolOutlined />
                        </span>
                        <span class="font-medium">Réservez un réparateur pour votre appareil</span>
                    </div>
                    <div class="flex space-x-2">
                        <span class="text-blue-500">
                            <CalendarOutlined />
                        </span>
                        <span class="font-medium">Guides quotidiennes</span>
                    </div>
                    <div class="flex space-x-2">
                        <span class="text-blue-500">
                            <SafetyCertificateOutlined />
                        </span>
                        <span class="font-medium">Materiels de secours</span>
                    </div>

                </div>
                <div class="text-gray-500">and more...</div>
            </div>
            <div class="h-96">
                <img class="h-full w-full object-contain" src={featuresImg} alt="" />
            </div>
        </section>

    )
}

export default Features