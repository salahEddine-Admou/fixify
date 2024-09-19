
import { CheckCircleFilled, HeartFilled, StarFilled, EnvironmentOutlined, MobileOutlined, BugOutlined, ShoppingOutlined, SmileOutlined, LoadingOutlined, CloseCircleOutlined, } from '@ant-design/icons';
import { Button, Drawer, Form, Image, Modal, Space, Spin, notification } from 'antd'
import "./RepairerDrawer.css"
import React, { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea';
import { useSelector } from 'react-redux';
import ProblemTypeApi from '../../../../api/ProblemTypeApi';
import AuthModal from '../../../../components/auth/AuthModal';
import ReservationApi from '../../../../api/ReservationApi';
import ImageReservationUploader from '../../../../components/forms/ImageReservationUploader';
import RepairerApi from '../../../../api/repairerApi';

const RepairerDrawer = ({ onClose, open, repairer }) => {
    const { user, role } = useSelector((state) => state.auth);
    const [isFav, setisFav] = useState(false)

    const [previewVisible, setPreviewVisible] = useState(false);
    const [authOpen, setOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [loading, setloading] = useState(false)
    const [price, setprice] = useState({ id: "", price: "" })

    const [reservation, setReservation] = useState({
        priceId: "",
        price: "",
        repairerId: repairer.id,
        username: user,
        description: "",
        imgReservations: []
    })

    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const { infos } = useSelector((state) => state.reservation);


    const showChildrenDrawer = async () => {
        const getTotal = async () => {
            const { data } = await ProblemTypeApi.getTotal(infos.modelId, infos.problemId, repairer.id)
            return data
        }

        if (user) {
            // let price = await getTotal()
            console.log(price);
            setChildrenDrawer(true);
            setloading(false)
            setReservation({ ...reservation, username: user, repairerId: repairer.id, description: "", price: repairer.price, modelId: infos.modelId, problemId: infos.problemId })
        } else {
            setOpen(true)
        }

    };

    const addToFav = async () => {
        await RepairerApi.addToFav(repairer.id, user)
        setisFav(true)
    }
    const deleteFromFav = async () => {
        await RepairerApi.deleteFromFav(repairer.id, user)
        setisFav(false)
    }

    const handledescChange = (e) => {
        setReservation({ ...reservation, description: e.target.value })
    }

    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);

    };
    useEffect(() => {
        const handleIsFav = async () => {
            try {
                let { data } = await RepairerApi.isFav(repairer.id, user);
                return data;
            } catch (error) {
                console.error("Error fetching favorite status:", error);
                return false; // or handle the error appropriately
            }
        };

        const fetchData = async () => {
            const result = await handleIsFav();
            console.log(result);
            setisFav(result);

        };

        fetchData();




    }, [repairer.id]);

    const handlePreviewClose = () => {
        setPreviewVisible(false);
    };
    const handlePreviewOpen = () => {
        setPreviewVisible(true);
    };
    const handleConfirm = async () => {
        console.log(reservation)
        setloading(true)
        try {
            await ReservationApi.create(reservation)
            setloading(false)
            api.open({
                message: 'Reservation cree avec succes',
                description:
                    'Le support va vous contacter pour plus de details de votre probleme',
                icon: (
                    <SmileOutlined
                        style={{
                            color: '#108ee9',
                        }}
                    />
                ),
            });
        } catch (error) {
            api.open({
                message: 'Erreur',
                description:
                    'Une erreur est survenue lors de la resrevation',
                icon: (
                    <CloseCircleOutlined
                        className='text-red-500'
                    />
                ),
            });
        }

        setChildrenDrawer(false);

    };
    const showModal = () => {
        setOpen(true);
    };
    useEffect(() => {
        const getTotal = async () => {
            // const { data } = await ProblemTypeApi.getTotal(infos.modelId, infos.problemId, repairer.id)
            setReservation({ ...reservation, price: repairer.price, modelId: infos.modelId, problemId: infos.problemId })
        }
        getTotal()
    }, [])

    const handleImageUpload = (imageUrl) => {
        setReservation(prev => ({ ...prev, imgReservations: [...prev.imgReservations, imageUrl] }));
    };


    return (
        <>
            {contextHolder}
            <Drawer width={700} placement="right" onClose={onClose} open={open}

            >
                <div className='w-full text-center '>
                    <div class="m-auto mb-4  pl-4  items-center rounded-xl border pt-1 pb-4 text-center w-full md:flex-row md:items-start md:text-left">

                        <div class="w-full">

                            <div className="flex gap-2 w-fit m-auto items-center my-3">
                                <div>
                                    <img class="h-20 m-auto rounded-circle object-cover md:w-20 " src={repairer.profilePhoto} alt="" />
                                </div>

                                <div className='inline-grid text-left'>
                                    <h1 class="text-xl font-medium text-gray-700">  {repairer.firstName + " " + repairer.lastName}   {repairer.pro && (
                                        <CheckCircleFilled className='text-blue-500 text-sm ml-1' />
                                    )}</h1>
                                    <div class="text-sm font-medium text-gray-500">Senior Reparateur</div>
                                </div>

                            </div>




                            <div class="row gap-2 justify-evenly w-full mt-1">
                                <div class="col-md-4 items-center rounded-xl md:bg-gray-100  md:px-4 md:py-1">
                                    <p class="text-sm font-medium text-gray-500">Reservation reussites</p>
                                    <p class="text-xl font-medium text-gray-900">{repairer.totalSuccessfulReservations}</p>
                                </div>
                                <div class="col-md-4 md:pl-2 pl-0 items-center rounded-xl md:bg-gray-100  md:px-4 md:py-1">
                                    <p class="text-sm font-medium text-gray-500">Total appareils</p>
                                    <p class="text-xl font-medium text-gray-900">{repairer.totalModels}</p>
                                </div>
                                <div class="col-md-4 md:pl-2 pl-0  items-center rounded-xl md:bg-gray-100  md:px-4 md:py-1">
                                    <p class="text-sm font-medium text-gray-500">Rate</p>
                                    <p class="text-xl font-medium text-gray-900"><StarFilled /> {repairer?.reviews?.length ? repairer.reviews.reduce((sum, review) => sum + review.rating, 0) / repairer?.reviews?.length : 0} ({repairer?.reviews?.length})</p>
                                </div>
                                <div class=""></div>
                            </div>
                            <div class="mb-3"></div>


                            {(role && role == "client") && <div class="flex space-x-2 md:w-2/3 w-full m-auto">
                                <button onClick={isFav ? deleteFromFav : addToFav} class={`w-full rounded-lg border-2 bg-white px-4 py-1 font-medium text-gray-500 `}><HeartFilled className={isFav ? "text-blue-500 mr-2" : "mr-2"} />
                                    {
                                        isFav ? "Supprimer de favoris" : "Ajouter au favouris"
                                    }
                                </button>
                                <button onClick={showChildrenDrawer} class="w-full rounded-lg border-2 border-transparent bg-blue-600 px-4 py-1 font-medium text-white">Reserver</button>
                            </div>}

                        </div>
                    </div>
                </div>

                <Image.PreviewGroup

                    preview={{

                        visible: previewVisible,
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        onVisibleChange: () => { setPreviewVisible((prev) => !prev) }

                    }}
                >
                    <div className="flex w-full gap-2">
                        <div className='inline-grid gap-1 w-[66%]' >
                            {repairer.portfolios[0] && <Image width={"100%"}
                                height={200} className="rounded-md object-cover" src={repairer.portfolios[0].src} />}
                            {repairer.portfolios[1] && <Image width={"100%"}
                                height={100} className="rounded-md object-cover" src={repairer.portfolios[1].src} />}
                        </div>
                        <div className='inline-grid gap-2 w-[33%]'>
                            {repairer.portfolios[2] && <Image className="rounded-md object-cover"
                                width={"100%"}
                                height={150}
                                src={repairer.portfolios[2].src}
                            />}
                            <div className="relative">
                                {repairer.portfolios[3] && <Image className="rounded-md object-cover z-1"
                                    width={"100%"}
                                    height={150}
                                    src={repairer.portfolios[3].src}
                                />}
                                {/* <div onClick={handlePreviewOpen} className="absolute cursor-pointer z-0  rounded-t-sm bg-slate-900 bottom-1 opacity-80 right-0 p-2 text-white text-md">
                                    +5 photos
                                </div> */}
                            </div>
                        </div>
                    </div>
                </Image.PreviewGroup>



                <div className="desc mt-4">
                    <h3 className='title relative w-fit pb-1'>Description</h3>
                    {repairer.description ? <div dangerouslySetInnerHTML={{ __html: repairer.description }}></div> : "Pas de description"}
                </div>

                <Drawer
                    title="Confirmer votre reservation"
                    width={480}

                    onClose={onChildrenDrawerClose}
                    open={childrenDrawer}
                >
                    <ul className='p-2 bg-gray-50 rounded-md'>
                        <li className='flex py-2 items-center  border-b-2 border-white'><span className='font-medium'><EnvironmentOutlined /> Ville</span> <span className="ml-auto">{infos.city}</span></li>
                        <li className='flex py-2 items-center  border-b-2 border-white'>
                            <span className='font-medium'>
                                <MobileOutlined className='mr-2' />Modele</span>
                            <span className="ml-auto">{infos.modelName}</span>
                        </li>

                        <li className='flex py-2 items-center  border-b-2 border-white'>
                            <span className='font-medium'>
                                <BugOutlined className='mr-2' />Type de probleme</span>
                            <span className="ml-auto">{infos.problemName}</span>
                        </li>
                        <li className=' py-2 items-center border-b-2 border-white'>
                            <span className='font-medium pb-2'>Decscription</span>
                            <Form.Item

                                name="description"
                                className='mt-2'

                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your description!',
                                    },
                                ]}
                            > <TextArea value={reservation.description} onChange={handledescChange} showCount maxLength={100} placeholder="Description de votre probleme" />
                            </Form.Item>
                        </li>
                        <li className=' py-2 items-center border-b-2 border-white'>
                            <span className='font-medium pb-2'>Ajouter des images pour votre reservation (max 3 photos)</span>
                            <Form.Item
                                name="imgReservations"
                                className='mt-2'
                            >
                                <ImageReservationUploader tab={reservation.imgReservations} name="imgReservations" maxFiles={3} onUploadSuccess={handleImageUpload} />                                </Form.Item>
                        </li>
                        <li className='flex  text-slate-800 text-base'>
                            <span className='font-medium'>Total</span> <span className="ml-auto font-medium">{reservation.price} mad</span>
                        </li>
                        <li className='w-full'>
                            <button onClick={handleConfirm} class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
                                {
                                    loading ? <Spin
                                        indicator={
                                            <LoadingOutlined
                                                className='text-white mr-2'
                                                style={{
                                                    fontSize: 24,
                                                }}
                                                spin
                                            />
                                        }
                                    /> : <ShoppingOutlined className='mr-2' />
                                }


                                Confirmer({reservation.price} mad)  </button>
                        </li>
                    </ul>
                </Drawer>
            </Drawer >
            <AuthModal open={authOpen} setOpen={setOpen} />
        </>
    )
}

export default RepairerDrawer
