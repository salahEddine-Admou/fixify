import React from 'react';
import ServiceItem from './item/ServiceItem';
import { MobileOutlined, TabletOutlined, LaptopOutlined, UserOutlined, ToolOutlined, RightOutlined } from '@ant-design/icons';
import "./Services.css"
import { Link } from 'react-router-dom';

const Services = () => {
    const servicesData = [
        {
            title: 'Réparation de Smartphones ',
            description: 'Nous réparons tous les types de smartphones, y compris les écrans cassés, les problèmes de batterie, et plus encore.',
            icon: <MobileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
        },
        {
            title: 'Réparation de Tablettes',
            description: 'Nos experts peuvent réparer les tablettes de toutes marques, résolvant les problèmes matériels et logiciels.',
            icon: <TabletOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
        },
        {
            title: 'Réparation d\'Ordinateurs',
            description: 'Nous offrons des services de réparation complets pour les ordinateurs portables et de bureau, y compris les remplacements de pièces et les mises à jour système.',
            icon: <LaptopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
        },
    ];

    return (
        <section >
            <div className="flex items-center justify-between ">
                <h2 className="fw-bolder md:text-2xl text-base title pb-2 w-fit relative">Nos services</h2>
                <Link to="/about" className='text-blue-500 ml-auto font-semibold cursor-pointer'>Voir plus <RightOutlined /></Link>
            </div>

            <section class="serv_card__container row m-auto mt-3">


                <div class="card__bx card__1 col-md-4">
                    <div class="card__data">
                        <div class="card__icon">
                            <div class="card__icon-bx">
                                <i class="fa-solid fa-pen-ruler"></i>
                            </div>
                        </div>
                        <div class="card__content">
                            <h3>Réparations Rapides de Smartphones</h3>
                            <p>Faites réparer votre smartphone rapidement et efficacement par nos techniciens qualifiés, pour que votre appareil soit de nouveau opérationnel en un rien de temps.</p>

                        </div>
                    </div>
                </div>
                <div class="card__bx card__2 col-md-4">
                    <div class="card__data">
                        <div class="card__icon">
                            <div class="card__icon-bx"><i class="fa-solid fa-code"></i></div>
                        </div>
                        <div class="card__content">
                            <h3>Entretien Complet des Ordinateurs Portables</h3>
                            <p>De la réparation d'écran à la résolution des problèmes logiciels, nos experts fournissent des services d'entretien et de réparation de haute qualité pour toutes les marques d'ordinateurs portables.</p>

                        </div>
                    </div>
                </div>
                <div class="card__bx card__3 col-md-4">
                    <div class="card__data">
                        <div class="card__icon">
                            <div class="card__icon-bx"><i class="fa-solid fa-rocket"></i></div>
                        </div>
                        <div class="card__content">
                            <h3>Diagnostic Détaillé des Appareils</h3>
                            <p>Vous ne savez pas ce qui ne va pas avec votre appareil ? Notre service de diagnostic identifiera rapidement le problème et vous fournira un plan de réparation clair.</p>

                        </div>
                    </div>
                </div>

            </section>

        </section>
        // <div class="bg-gray-100 p-4 min-h-screen">

        //     <div class="max-w-7xl mx-auto pb-6 md:px-12 xl:px-6">
        //         <div class="md:w-2/3 lg:w-1/2  text-gray-100">
        //             <h2 class="my-3 text-2xl font-bold text-gray-900 md:text-4xl">Nos Services</h2>
        //             <p class="text-gray-700">Nous offrons une variété de services adaptés à vos besoins</p>
        //         </div>
        //         <div
        //             class="mt-16 grid divide-x divide-y divide-gray-700 overflow-hidden rounded-3xl border text-gray-600 border-gray-700 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4">
        //             <div class="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
        //                 <div class="relative space-y-8 py-12 p-8">
        //                     <div class="circle">
        //                         <MobileOutlined className='text-5xl text-gray-300' />
        //                     </div>
        //                     <div class="space-y-2 mt-1">
        //                         <h5 class="capitalize text-xl font-semibold text-white transition group-hover:text-secondary">Réparations Rapides de Smartphones</h5>
        //                         <p class="text-gray-300 text-justify">Faites réparer votre smartphone rapidement et efficacement par nos techniciens qualifiés, pour que votre appareil soit de nouveau opérationnel en un rien de temps.</p>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
        //                 <div class="relative space-y-8 py-12 p-8">
        //                     <div class="circle">
        //                         <LaptopOutlined className='text-5xl text-gray-300' />
        //                     </div>
        //                     <div class="space-y-2">
        //                         <h5 class="capitalize text-xl font-semibold text-white transition group-hover:text-secondary">Entretien Complet des Ordinateurs Portables</h5>
        //                         <p class="text-gray-300 text-justify">De la réparation d'écran à la résolution des problèmes logiciels, nos experts fournissent des services d'entretien et de réparation de haute qualité pour toutes les marques d'ordinateurs portables.</p>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
        //                 <div class="relative space-y-8 py-12 p-8">
        //                     <div class="circle">

        //                         <TabletOutlined className='text-5xl text-gray-300' />
        //                     </div>
        //                     <div class="space-y-2">
        //                         <h5 class="capitalize text-xl font-semibold text-white transition group-hover:text-secondary">Réparations Fiables de Tablettes</h5>
        //                         <p class="text-gray-300 text-justify">Qu'il s'agisse d'un écran cassé ou de problèmes de batterie, nos professionnels offrent des services de réparation fiables pour restaurer la fonctionnalité de votre tablette.</p>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
        //                 <div class="relative space-y-8 py-12 p-8">
        //                     <div class="circle">
        //                         <ToolOutlined className='text-5xl text-gray-300' />
        //                     </div>
        //                     <div class="space-y-2">
        //                         <h5 class="capitalize text-xl font-semibold text-white transition group-hover:text-secondary">Diagnostic Détaillé des Appareils</h5>
        //                         <p class="text-gray-300 text-justify">Vous ne savez pas ce qui ne va pas avec votre appareil ? Notre service de diagnostic identifiera rapidement le problème et vous fournira un plan de réparation clair.</p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    );
}

export default Services;