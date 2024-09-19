import { CheckCircleFilled, HeartFilled, StarFilled, SearchOutlined, EnvironmentOutlined, MobileOutlined, BugOutlined, ShoppingOutlined, SmileOutlined, LoadingOutlined, CloseCircleOutlined, PlusOutlined, } from '@ant-design/icons';
import { Button, Drawer, Popconfirm, Form, Image, Modal, Rate, Space, Spin, notification, Avatar, Input, Empty, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea';
import { useSelector } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import ProblemTypeApi from '../../../../api/ProblemTypeApi';
import AuthModal from '../../../../components/auth/AuthModal';
import ReservationApi from '../../../../api/ReservationApi';
import RepairerApi from '../../../../api/repairerApi';
import RepairerSearchform from './RepairerSearchform';
import ReviewApi from '../../../../api/ReviewApi';
import { successToast, errorToast } from '../../../../utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import "./RepairerDetail.css"



const RepairerDetail = ({ marques, problemTypes, modeles, setSearchData, page, setrepairers, setPage }) => {
    const { user, role } = useSelector((state) => state.auth);
    const { id } = useParams();
    const [repairer, setRepairer] = useState({});

    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedDeviceType, setSelectedDeviceType] = useState(null);
    const [authOpen, setOpen] = useState(false);
    const [isFav, setisFav] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const [loading, setloading] = useState(true)
    const [reservLoading, setReservLoading] = useState(false)
    const [price, setPrice] = useState({ id: "", price: "" })
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [searchFormVisible, setSearchFormVisible] = useState(false);
    const [filteredMarques, setFilteredMarques] = useState([]);
    const [filteredModeles, setFilteredModeles] = useState([]);
    const [filteredProblemTypes, setFilteredProblemTypes] = useState([]);
    const [rating, setRating] = useState(0);
    const [form] = Form.useForm();


    const showSearchForm1 = () => {
        setDrawerVisible(true);
        setSearchFormVisible(true);
    };

    const addToFav = async () => {
        await RepairerApi.addToFav(id, user)
        setisFav(true)
    }
    const deleteFromFav = async () => {
        await RepairerApi.deleteFromFav(id, user)
        setisFav(false)
    }

    // Fonction pour fermer le tiroir et réinitialiser la visibilité du formulaire de recherche
    const closeDrawer = () => {
        setDrawerVisible(false);
        setSearchFormVisible(false);
    };

    const [reservation, setReservation] = useState({
        priceId: "",
        price: "",
        repairerId: repairer.id,
        username: user,
        description: ""
    })
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const { infos } = useSelector((state) => state.reservation);
    const [showSearchForm, setShowSearchForm] = useState(false);

    // Fonction pour afficher le formulaire de recherche
    const handleSearchClick = () => {
        setShowSearchForm(true);
    };



    const handledescChange = (e) => {
        setReservation({ ...reservation, description: e.target.value })
    }
    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
    };

    const handlePreviewOpen = () => {
        setPreviewVisible(true);
    };
    const [newReview, setNewReview] = useState('');
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

    const handleAddReview = () => {
        setIsReviewModalVisible(true);
    };

    const handleDeleteReview = async (reviewId) => {
        setloading(true);
        try {
            await ReviewApi.deleteReview(reviewId);
            await fetchRepairer();
            successToast('Avis supprimé avec succès');
        } catch (error) {
            errorToast('Une erreur est survenue lors de la suppression de l\'avis.');
        } finally {
            setloading(false);
        }

    };

    const handleReviewModalOk = async () => {
        setloading(true);

        try {
            const values = await form.validateFields();
            const extendedValues = await {
                ...values,
                client: user,
                repairerId: repairer.id
            };
            console.log(extendedValues);

            await ReviewApi.addReview(extendedValues);
            await fetchRepairer();
            successToast('Avis ajouté avec succès');
            setIsReviewModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
            setIsReviewModalVisible(false);
            form.resetFields();
        }
    };

    const handleReviewModalCancel = () => {
        setIsReviewModalVisible(false);
        setNewReview('');
    };
    const handleConfirm = async () => {

        setReservLoading(true)
        try {
            await ReservationApi.create(reservation)
            setReservLoading(false)
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
            setloading(false)
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

    const fetchRepairer = async () => {

        try {
            setloading(true)

            const response = await RepairerApi.getRepairerProfile(id);

            setRepairer(response.data);
            if (marques && modeles && problemTypes && infos) {
                setFilteredMarques(marques.filter(marque => response.data.marques.includes(marque.id)));
                setFilteredModeles(modeles.filter(modele => response.data.modeles.includes(modele.id)));
                setFilteredProblemTypes(problemTypes.filter(problemType => response.data.problemTypes.includes(problemType.id)));
                const totalResponse = await ProblemTypeApi.getTotal(infos.modelId, infos.problemId);
                setPrice({ id: totalResponse.data.id, price: totalResponse.data.price });
                setReservation({ ...reservation, priceId: totalResponse.data.id, price: totalResponse.data.price });
            }
            setloading(false);
        } catch (error) {
            alert("error")
            console.error('Error fetching repairer details:', error);
            setloading(false);
        }
    };


    useEffect(() => {


        fetchRepairer();

    }, [id]);

    useEffect(() => {
        const handleIsFav = async () => {
            try {
                let { data } = await RepairerApi.isFav(id, user);
                return data;
            } catch (error) {
                console.error('Error fetching favorite status:', error);
                return false;
            }
        };

        const fetchData = async () => {
            const result = await handleIsFav();
            setisFav(result);
        };

        fetchData();




    }, [id]);





    return (
        <>
            {contextHolder}
            {
                loading ?

                    <div className="h-[80vh] justify-center flex items-center mt-[80px] mx-[10px]">
                        <Spin />
                    </div>
                    : <>  <div className="row mt-[80px] mx-[30px]">
                        <div className="col-md-9">
                            <div className="mx-auto w-full text-left ">
                                <div class="m-auto mb-4  pl-4  items-center rounded-xl border pt-1 pb-4 text-center w-full md:flex-row md:items-start md:text-left">

                                    <div class="w-full">

                                        <div className="flex gap-2 w-fit m-auto items-center my-3">
                                            <div>
                                                {repairer.profilePhoto ? (
                                                    <img className="h-20 m-auto rounded-circle object-cover md:w-20" src={repairer.profilePhoto} alt="" />
                                                ) : (
                                                    <Avatar size={74} className="mr-2" icon={<UserOutlined />} />
                                                )}
                                            </div>

                                            <div className='inline-grid text-left'>
                                                <h1 class="text-xl font-medium text-gray-700">  {repairer.firstName + " " + repairer.lastName} <CheckCircleFilled className='text-blue-500 text-sm ml-1' /></h1>
                                                <div class="text-sm font-medium text-gray-500">Senior Reparateur</div>
                                            </div>

                                        </div>
                                        <div class="flex justify-evenly w-full mt-1">
                                            <div class="flex flex-col items-center rounded-xl md:bg-gray-100  md:px-4 md:py-1">
                                                <p class="text-sm font-medium text-gray-500">Réservations réussies</p>
                                                <p class="text-xl font-medium text-gray-900">{repairer.totalSuccessfulReservations || 0}</p>
                                            </div>
                                            <div class="flex flex-col items-center rounded-xl md:bg-gray-100  md:px-4 md:py-1">
                                                <p class="text-sm font-medium text-gray-500">Total appareils</p>
                                                <p class="text-xl font-medium text-gray-900">{repairer.totalModels || 0}</p>
                                            </div>
                                            <div class="flex flex-col items-center rounded-xl md:bg-gray-100  md:px-4 md:py-1">
                                                <p class="text-sm font-medium text-gray-500">Rate</p>
                                                <p class="text-xl font-medium text-gray-900"><StarFilled /> {repairer.reviews && repairer.reviews.length > 0 ? repairer.reviews.reduce((sum, review) => sum + review.rating, 0) / repairer.reviews.length : 0} ({repairer.reviews && repairer.reviews.length > 0 ? repairer.reviews.length : 0})</p>
                                            </div>
                                            <div class=""></div>
                                        </div>


                                        <div class="mb-3"></div>


                                        {(role && role == "client" && repairer.reparations) && <div class="flex space-x-2 w-2/3 m-auto">
                                            <button onClick={isFav ? deleteFromFav : addToFav} class={`w-full rounded-lg border-2 bg-white px-4 py-1 font-medium text-gray-500 `}><HeartFilled className={isFav ? "text-blue-500 mr-2" : "mr-2"} />
                                                {
                                                    isFav ? "Supprimer de favoris" : "Ajouter au favouris"
                                                }
                                            </button>
                                            <button onClick={showSearchForm1} class="w-full rounded-lg border-2 border-transparent bg-blue-600 px-4 py-1 font-medium text-white">Reserver</button>
                                        </div>}

                                    </div>
                                </div>
                            </div>

                            {repairer.portfolios && repairer.portfolios.length > 0 &&

                                <Image.PreviewGroup >
                                    <div className="flex w-full gap-2">
                                        <div className='inline-grid gap-1'>
                                            {
                                                repairer.portfolios[0] && <Image
                                                    height={300} style={{ width: "500px" }} className="rounded-md object-cover" src={repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[0].src : ''}
                                                    onClick={() => handlePreviewOpen(repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[0].src : '')}></Image>
                                            }
                                            {
                                                repairer.portfolios[1] &&
                                                <Image
                                                    height={200} style={{ width: "500px" }} className="rounded-md object-cover" src={repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[1].src : ''}
                                                    onClick={() => handlePreviewOpen(repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[1].src : '')}></Image>
                                            }
                                        </div>
                                        <div className='inline-grid gap-2'>
                                            {
                                                repairer.portfolios[2] &&
                                                <Image className="rounded-md object-cover"
                                                    style={{ width: "500px" }}
                                                    height={250}
                                                    src={repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[2].src : ''}
                                                    onClick={() => handlePreviewOpen(repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[2].src : '')}></Image>
                                            }
                                            {
                                                repairer.portfolios[3] &&
                                                <div className="relative">
                                                    <Image className="rounded-md object-cover z-1"
                                                        style={{ width: "500px" }}
                                                        height={250}
                                                        src={repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[3].src : ''}
                                                        onClick={() => handlePreviewOpen(repairer.portfolios && repairer.portfolios.length > 0 ? repairer.portfolios[1].src : '')}></Image>
                                                    {/* <div onClick={handlePreviewOpen} className="absolute cursor-pointer z-0  rounded-t-sm bg-slate-900 bottom-1 opacity-80 right-0 p-2 text-white text-md">
    </div> */}
                                                </div>
                                            }

                                        </div>
                                    </div>
                                </Image.PreviewGroup>
                            }
                            <div className="desc mt-4 ">
                                <h3 className='title relative w-fit pb-1'>Description</h3>
                                {repairer.description ? <div dangerouslySetInnerHTML={{ __html: repairer.description }}></div> : "Pas de description"}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div>
                                <h5 className='m-auto mb-2 flex'>Avis
                                    {role === "client" && (
                                        <>
                                            <button className='mr-1 ms-auto btn btn btn-outline-primary rounded-circle justify-center w-6 h-6 flex items-center' onClick={handleAddReview} >
                                                <PlusOutlined />
                                            </button>
                                        </>)}
                                </h5>
                                <div className="text-xl font-medium text-gray-700 max-h-[70vh] rounded-lg bg-gray-100 p-2 overflow-x-hidden  overflow-y-scroll">
                                    {repairer.reviews &&


                                        repairer?.reviews?.length > 0 ? (
                                        repairer.reviews.map((review, index) => (
                                            <>
                                                <div key={index} className="flex m-auto items-center my-3">

                                                    <div className='left-side mr-2'>
                                                        {review.client.imageProfile ? (
                                                            <img className="h-10 m-auto rounded-circle object-cover md:w-11" src={review.client.imageProfile} alt="" />
                                                        ) : (
                                                            <Avatar size={30} className="mr-2" icon={<UserOutlined />} />
                                                        )}
                                                    </div>

                                                    <div className='mid-side ' >
                                                        <h1 className="text-base font-medium text-gray-700 mr-2 -mb-2">{review.client.firstName + " " + review.client.lastName}</h1>
                                                        <Rate disabled defaultValue={review.rating} className="text-sm font-small -mt-2" />
                                                        <div className="text-sm font-small text-gray-500">{review.content}</div>
                                                    </div>

                                                    <div className="right-side ms-auto">
                                                        {user === review.client.username && (
                                                            <>
                                                                <Popconfirm
                                                                    title="Êtes-vous sûr de vouloir supprimer ce commentaire ?"
                                                                    onConfirm={() => handleDeleteReview(review.id)}
                                                                    okText="Oui"
                                                                    cancelText="Non"
                                                                >
                                                                    <DeleteOutlined
                                                                        className="text-red-500 cursor-pointer text-lg"
                                                                    />
                                                                </Popconfirm>
                                                                {/* <EditOutlined
                                                                    className="text-gray-500 ml-2 cursor-pointer"

                                                                /> */}
                                                            </>
                                                        )}
                                                    </div>


                                                </div>
                                                {
                                                    ((index + 1) !== repairer?.reviews?.length) && <hr />

                                                }

                                            </>

                                        ))
                                    ) : (
                                        <div className='h-[50vh] flex items-center justify-center'>
                                            <Empty
                                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                                description={
                                                    <Typography.Text className='block text-blue-400'>
                                                        Aucun avis pour le moment
                                                    </Typography.Text>
                                                } />
                                        </div>

                                    )}
                                </div>
                            </div>


                            {/* Bouton pour ajouter un avis */}
                            {/* <div className="mt-4">
                                <button onClick={handleAddReview} className=' rounded-md border-2 border-transparent bg-blue-600 px-4 py-1 font-medium text-white'>Ajouter un avis</button>
                            </div> */}
                        </div>
                    </div>

                        {/* Popup pour ajouter un avis */}
                        <Modal
                            title="Ajouter un avis"
                            visible={isReviewModalVisible}
                            onOk={handleReviewModalOk}
                            onCancel={handleReviewModalCancel}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    name="content"
                                    label="Commentaire"
                                    rules={[{ required: true, message: 'Commentaire est vide' }]}
                                >
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item
                                    name="rating"
                                    label="Note"
                                    rules={[{ required: true, message: 'Note est vide' }]}
                                >
                                    <Rate

                                        allowHalf
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>


                        <Drawer
                            title="Formulaire de recherche"
                            width={480}
                            onClose={closeDrawer}
                            visible={searchFormVisible} // Affichez le deuxième tiroir uniquement lorsque searchFormVisible est true
                            placement="right"
                        >
                            {/* Affichez le formulaire de recherche ici */}
                            <RepairerSearchform
                                marques={filteredMarques} // Assurez-vous que marques est défini et passé en tant que props
                                modeles={filteredModeles} // Assurez-vous que modeles est défini et passé en tant que props
                                problemTypes={filteredProblemTypes} // Assurez-vous que problemTypes est défini et passé en tant que props
                                setSearchData={setSearchData}
                                setSelectedDeviceType={setSelectedDeviceType}
                                selectedDeviceType={selectedDeviceType}
                                setReservation={setReservation}
                                reservation={reservation}
                                page={page}
                                setrepairers={setrepairers}
                                setPage={setPage}
                                repairerCity={repairer.city}
                                reparations={repairer.reparations}
                                setChildrenDrawer={setChildrenDrawer}
                                repairer={repairer}
                            // Passez la ville du réparateur ici

                            />
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
                                    <li className='flex  text-slate-800 text-base'>
                                        <span className='font-medium'>Total</span> <span className="ml-auto font-medium">{reservation.price} mad</span>
                                    </li>
                                    <li className='w-full'>
                                        <button onClick={handleConfirm} class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
                                            {
                                                reservLoading ? <Spin
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
                        </Drawer>

                        <AuthModal open={authOpen} setOpen={setOpen} /></>
            }

        </>
    )
}

export default RepairerDetail