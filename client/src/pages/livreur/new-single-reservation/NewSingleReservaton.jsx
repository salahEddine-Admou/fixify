import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ReservationApi from '../../../api/ReservationApi';
import { BugOutlined, CarOutlined, CheckCircleOutlined, EnvironmentOutlined, LoadingOutlined, MobileOutlined, PhoneOutlined, ShoppingOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Collapse, Result, Spin, notification } from 'antd';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const NewSingleReservaton = ({ type }) => {

    const { id } = useParams();
    const [alreadyDelivered, setAlreadyDelivered] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const [loading, setloading] = useState(true)
    const [acceptLoading, setacceptLoading] = useState(false)
    const { user, role } = useSelector((state) => state.auth);
    const [reservation, setreservation] = useState({})
    const [acceptsuccess, setacceptsuccess] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        const getResrev = async () => {
            setloading(true)
            const { data } = await ReservationApi.getNewSingleReservation(id)
            data.deliveries.map(d => {
                if (type == "aller") {
                    if (d.deliveryType == "FromClientToRepairer") {

                        setAlreadyDelivered(true)
                    }
                } if (type == "retour") {
                    if (d.deliveryType == "FromRepairerToClient") {

                        setAlreadyDelivered(true)
                    }
                } else {
                    if (d.deliveryType == "FromRepairerToRepairer") {
                        setAlreadyDelivered(true)
                    }
                }


            })
            setreservation(data)
            setloading(false)
        }
        getResrev()
    }, [])


    const items = searchParams.get("reservtype") == "from-rep-to-rep" ? [
        {
            key: '1',
            label: 'Reparateur source',
            children: <ul className='p-2 bg-gray-100 rounded-md '>
                <li className='flex py-2 items-center  border-b-2 border-white'>

                    <span className='font-medium'>
                        <UserOutlined className='mr-2' />Nom / Prenom</span>
                    <span className="ml-auto">{reservation.oldReparateur}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>

                    <span className='font-medium'>
                        <EnvironmentOutlined className='mr-2' />Adresse</span>
                    <span className="ml-auto">{reservation.oldrepAddress}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <MobileOutlined className='mr-2' />Telephone</span>
                    <span className="ml-auto">{reservation.oldrepPhoneNumber}</span>
                </li>
            </ul>

        },
        {
            key: '2',
            label: 'Reparateur destination',
            children: <ul className='p-2 bg-gray-100 rounded-md '>
                <li className='flex py-2 items-center  border-b-2 border-white'>

                    <span className='font-medium'>
                        <UserOutlined className='mr-2' /> Nom / Prenom</span>
                    <span className="ml-auto">{reservation.reparateur}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <EnvironmentOutlined className='mr-2' />Adresse</span>
                    <span className="ml-auto">{reservation.repAddress}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <PhoneOutlined className='mr-2' />Telephone</span>
                    <span className="ml-auto">{reservation.repPhoneNumber}</span>
                </li>
            </ul>
        },
        {
            key: '3',
            label: 'Appareil ',
            children: <ul className='p-2 bg-gray-100 rounded-md '>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <UserOutlined className='mr-2' />modele</span>
                    <span className="ml-auto">{reservation.model}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <EnvironmentOutlined className='mr-2' />Probleme</span>
                    <span className="ml-auto">{reservation.probleme}</span>
                </li>

            </ul>

        },
    ] : [
        {
            key: '1',
            label: 'Reparateur ',
            children: <ul className='p-2 bg-gray-100 rounded-md '>
                <li className='flex py-2 items-center  border-b-2 border-white'>

                    <span className='font-medium'>
                        <UserOutlined className='mr-2' />Nom / Prenom </span>
                    <span className="ml-auto">{reservation.reparateur}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>

                    <span className='font-medium'>
                        <EnvironmentOutlined className='mr-2' />Adresse  </span>
                    <span className="ml-auto">{reservation.repAddress}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>

                    <span className='font-medium'>
                        <MobileOutlined className='mr-2' />Telephone</span>
                    <span className="ml-auto">{reservation.repPhoneNumber}</span>
                </li>
            </ul>

        },
        {
            key: '2',
            label: 'Client ',
            children: <ul className='p-2 bg-gray-100 rounded-md '>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <UserOutlined className='mr-2' />Nom / Prenom</span>
                    <span className="ml-auto">{reservation.client}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <EnvironmentOutlined className='mr-2' />Addresse</span>
                    <span className="ml-auto">{reservation.addresse ? reservation.addresse : <Badge status="error" text="Non definie" />}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <MobileOutlined className='mr-2' />Telephone</span>
                    <span className="ml-auto">{reservation.phone}</span>
                </li>
            </ul>

        },
        {
            key: '3',
            label: 'Appareil ',
            children: <ul className='p-2 bg-gray-100 rounded-md '>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <UserOutlined className='mr-2' />modele</span>
                    <span className="ml-auto">{reservation.model}</span>
                </li>
                <li className='flex py-2 items-center  border-b-2 border-white'>
                    <span className='font-medium'>
                        <EnvironmentOutlined className='mr-2' />Probleme</span>
                    <span className="ml-auto">{reservation.probleme}</span>
                </li>

            </ul>

        }

    ];

    const acceptReservation = async () => {
        setacceptLoading(true)
        if (searchParams.get("reservtype") == "from-rep-to-rep")
            await ReservationApi.acceptReservation(user, reservation.id, "r2r");
        else
            await ReservationApi.acceptReservation(user, reservation.id, type);
        setacceptLoading(false)
        setacceptsuccess(true)
        api.open({
            message: 'Livraison accepte avec succes',

            icon: (
                <SmileOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
        });
    }
    return (
        <div className="md:container flex items-center h-screen ">
            {contextHolder}
            {

                loading ?
                    <Spin className='m-auto' />
                    :
                    !alreadyDelivered ?
                        <div className='md:w-2/3  sm:w-full px-3 md:px-0 m-auto'>
                            <h4 className='m-auto mb-2 text-lg sm:text-center md:text-left md:text-2xl'>Nouvelle reservation <br />
                                {searchParams.get("reservtype") == "from-rep-to-rep" && "(Reaparateur  => reparateur)"}

                                {
                                    type == "aller" ? "(Client => Reparateur)" : "(Reparateur => Client)"
                                }
                            </h4>
                            <Collapse items={items} defaultActiveKey={['1', '2']} />
                            {
                                role == "livreur" &&

                                <ul className='pl-0'>
                                    <li className='w-full'>
                                        <button disabled={acceptsuccess} onClick={acceptReservation} class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
                                            {
                                                !acceptsuccess ?
                                                    acceptLoading ? <Spin
                                                        indicator={
                                                            <LoadingOutlined
                                                                className='text-white mr-2'
                                                                style={{
                                                                    fontSize: 24,
                                                                }}
                                                                spin
                                                            />
                                                        }
                                                    /> : <CarOutlined className='mr-2' />
                                                    : <CheckCircleOutlined className='mr-2' />
                                            }


                                            {acceptsuccess ? "Accepted" : "Accepter"} </button>
                                    </li>
                                </ul>
                            }


                        </div> :
                        <Result
                            status="error"
                            className='m-auto'
                            title="Livraison déjà effectuée"
                            subTitle="Cette commande a déjà été prise en charge par un autre livreur."
                            extra={<Button type="primary">Aller à la liste des nouvelles commandes</Button>}
                        />

            }


        </div >

    )
}

export default NewSingleReservaton