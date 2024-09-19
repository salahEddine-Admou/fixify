import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ReservationApi from '../../../api/ReservationApi';
import { BugOutlined, CarOutlined, CheckCircleOutlined, ClockCircleOutlined, EnvironmentOutlined, LoadingOutlined, MobileOutlined, ShoppingOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Result, Spin, notification } from 'antd';
import { useParams } from 'react-router';

const NewRequest = ({ type }) => {

    const { id } = useParams();
    const { infos } = useSelector((state) => state.reservation);
    const [alreadyDelivered, setAlreadyDelivered] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const [loading, setloading] = useState(true)
    const [acceptLoading, setacceptLoading] = useState(false)
    const { user, role } = useSelector((state) => state.auth);
    const [reservation, setreservation] = useState({})
    const [acceptsuccess, setacceptsuccess] = useState(false)
    const [selected, setSelected] = useState(null);
    const [notfoundError, setnotfoundError] = useState("")

    useEffect(() => {
        const initialSelected = reservation.repairers?.find((repairer) => repairer.name === reservation.reparateur) || "undefind"
        setSelected(initialSelected);
    }, [reservation.reparateur]);


    const handleChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const selectedRepairer = reservation.repairers?.find((repairer) => repairer.id === selectedId);
        setSelected(selectedRepairer);
    };
    useEffect(() => {
        const getResrev = async () => {
            try {
                setloading(true)
                const { data } = await ReservationApi.getNewSingleRequest(id)
                setreservation(data)
            } catch (error) {

                setnotfoundError(error.response.data)
                setAlreadyDelivered(true)
            } finally {
                setloading(false)
            }


        }
        getResrev()
    }, [])

    const changeRepairer = async () => {
        setacceptLoading(true)
        console.log(reservation.id, selected.id);
        try {
            await ReservationApi.changeRepairer(reservation.id, selected.id, reservation.oldRepairerId);

            setacceptsuccess(true)
            api.open({
                message: 'Reservation re-affecte avec succes',

                icon: (
                    <SmileOutlined
                        style={{
                            color: '#108ee9',
                        }}
                    />
                ),
            });
        } catch (error) {
            alert("error")

        } finally {
            setacceptLoading(false)
        }

    }
    return (
        <div className="container flex items-center h-screen">
            {contextHolder}
            {

                loading ?
                    <Spin className='m-auto' />
                    :
                    !alreadyDelivered ?
                        <div className='w-2/3  m-auto'>
                            <h4 className='m-auto pb-2'>Reservation non resolue</h4>
                            <ul className='p-2 bg-gray-100 rounded-md '>
                                <li className='flex py-2 items-center  border-b-2 border-white'>
                                    <span className='font-medium'>
                                        <MobileOutlined className='mr-2' />Reparateur</span>
                                    <span className="ml-auto"><select
                                        id="repairer-selec no-shadow"
                                        value={selected.id}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {reservation.repairers.map((repairer) => (
                                            <option class="form-select p-4" key={repairer.id} value={repairer.id}>
                                                {repairer.name}
                                            </option>
                                        ))}
                                    </select></span>
                                </li>

                                <li className='flex py-2 items-center  border-b-2 border-white'>
                                    <span className='font-medium'>
                                        <UserOutlined className='mr-2' />Client</span>
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

                                <li className='flex py-2 items-center  border-b-2 border-white'>
                                    <span className='font-medium'>
                                        <BugOutlined className='mr-2' />Probleme</span>
                                    <span className="ml-auto">{reservation.probleme}</span>
                                </li>

                                <li className='flex py-2 items-center  border-b-2 border-white'>
                                    <span className='font-medium'>
                                        <ClockCircleOutlined className='mr-2' />Date</span>
                                    <span className="ml-auto">{reservation.date}</span>
                                </li>

                                {
                                    role == "admin" && <li className='w-full'>
                                        <button disabled={acceptsuccess} onClick={changeRepairer} class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
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


                                            {acceptsuccess ? "Affecte" : "Affecter"} </button>
                                    </li>
                                }

                            </ul>
                        </div> :
                        <Result
                            status="error"
                            className='m-auto'
                            title="la demande est deja affecte"
                            subTitle="La demande est deja affecte a un autre reparateur"
                        // extra={<Button type="primary">Aller à la liste des nouvelles commandes</Button>}
                        />

            }


        </div>

    )
}

export default NewRequest