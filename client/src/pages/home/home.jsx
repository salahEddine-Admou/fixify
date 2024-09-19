// Home.jsx
import React, { useState } from 'react';
import { ArrowUpOutlined, RightOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import Banner from './banner/Banner';
import MarketPlace from './marketplace/MarketPlace';
import Services from './services/Services'
import Repairs from './repairs/Repairs';
import Features from './features/Features';
import Testimonial from './testimonial/Testimonial';
import './home.css';
import Testimonials from './testimonial/Testimonial';
import BlogPosts from './blog-posts/BlogPosts';



const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    window.onscroll = () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    return (
        <div className="home"> {/* Ajoutez la classe bg-blue-100 ici */}
            <Banner />
            <div className="md:px-[50px] px-3 pt-4" id="Market">
                <BlogPosts />
            </div>

            <div className="px-3 md:px-[100px] pb-3 md:pt-4 pt-0" id="Features">
                <Features />
            </div>

            <div className="md:px-[100px] px-3 py-3" id="repairs">
                <Repairs />
            </div>

            <div className="md:px-[100px] px-3 py-3" id="Services">
                <Services />
            </div>

            <div className=" md:px-[100px] px-3 pb-6 pt-8" id="Market">



                <div class="relative rounded-2xl overflow-hidden mx-auto bg-white bg-opacity-20 bg-cover bg-center ">
                    <img class="absolute h-full w-1/2 right-0 object-cover" src="https://miro.medium.com/v2/resize:fit:1000/1*2W95XAGfV3VpJ_XNyGRFdw.jpeg" />
                    <div class="text-white lg:w-1/2">
                        <div class="bg-blue-600 bg-opacity-95 p-5 opacity-90 backdrop-blur-lg lg:p-12">
                            <h2 class="text-5xl font-bold">Leading the next generation of innovators</h2>
                            <a href="#" class="mt-6 inline-block rounded-md border-1 px-3 py-1 font-semibold border-white hover:bg-white hover:text-blue-600"> Read Now </a>
                        </div>
                    </div>
                </div>

                <div className="md:px-[100px] px-3 pb-5 mt-3" id="Market">
                    <div className="flex items-center justify-between">
                        <h2 className="fw-bolder md:text-2xl text-base title pb-2 w-fit relative">Client Testimonials</h2>

                    </div>
                    <section class=" text-blue-900  ">
                        <div class="mx-auto max-w-screen-lg md:px-4 px:0 sm:px-6 lg:px-8">
                            <div class="flex flex-col items-center">
                                <Testimonial />
                            </div>
                        </div>
                    </section>
                </div>


            </div>


            <footer className="bg-gray-100">
                <div className="mx-auto grid max-w-screen-xl gap-y-8 gap-x-12 px-10 py-10 md:grid-cols-2 xl:grid-cols-4 xl:px-10">
                    <div className="max-w-sm">
                        <div className="mb-6 flex h-12 items-center space-x-2">
                            <span className="text-3xl font-bold">
                                <span className="text-5xl font-bold">Fixi<span className="text-blue-600">Fy</span>.</span>
                            </span>
                        </div>
                        <div className="text-gray-500">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis ad a officia ea expedita!
                        </div>
                    </div>
                    <div>
                        <div className="mt-4 mb-2 font-medium xl:mb-4 text-blue-600">Address</div> {/* Adresse en bleu */}
                        <div className="text-blue-600"> {/* Contenu de l'adresse en bleu */}
                            35 Remida Heights, <br />
                            45 Street, <br />
                            South Carolina, US
                        </div>
                    </div>
                    <div>
                        <div className="mt-4 mb-2 font-medium xl:mb-4 text-blue-600">Links</div> {/* Titre des liens en bleu */}
                        <div aria-label="Footer Navigation" className="text-gray-500">
                            <ul className="space-y-3 pl-0">
                                <li>
                                    <a className="hover:text-blue-600 hover:underline text-blue-600" href="#">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-blue-600 hover:underline text-blue-600" href="#">
                                        Demo
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-blue-600 hover:underline text-blue-600" href="#">
                                        Press
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-blue-600 hover:underline text-blue-600" href="#">
                                        Support Hub
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-blue-600 hover:underline text-blue-600" href="#">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="mt-4 mb-2 font-medium xl:mb-4">Subscribe to our Newsletter</div>
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <input
                                    type="email"
                                    className="focus:outline mb-2 block h-14 w-full rounded-xl bg-gray-200 px-4 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    placeholder="Enter your email"
                                />
                                <button className="block rounded-md bg-blue-600 px-4 py-2 font-medium text-white">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-200">
                    <div className="mx-auto flex max-w-screen-xl flex-col gap-y-4 px-4 py-3 text-center text-gray-500 sm:flex-row sm:justify-between sm:text-left">
                        <div>© 2024 Orange Digital Center | All Rights Reserved</div>
                        <div>
                            <a className="text-blue-600" href="#"> {/* Lien en bleu */}
                                Privacy Policy
                            </a>
                            <span>|</span>
                            <a className="text-blue-600" href="#"> {/* Lien en bleu */}
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <FloatButton
                shape="square"
                type="primary"
                style={{ right: 24, bottom: 20, display: isVisible ? 'block' : 'none' }}
                icon={<ArrowUpOutlined />}
                onClick={scrollToTop}
            />
        </div>

    );
};

export default Home;
