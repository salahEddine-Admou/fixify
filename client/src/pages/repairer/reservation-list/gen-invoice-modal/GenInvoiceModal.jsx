import { CheckCircleFilled, HeartFilled, StarFilled, EnvironmentOutlined, MobileOutlined, BugOutlined, ShoppingOutlined, SmileOutlined, LoadingOutlined, CloseCircleOutlined, UserAddOutlined, PhoneFilled, PhoneOutlined, CalendarOutlined, ContactsFilled, CheckOutlined, CloseOutlined, } from '@ant-design/icons';
import { Form, Input, Modal, Spin, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import ReservationApi from '../../../../api/ReservationApi';
import InvoiceDocument from './InvoiceDocument';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { togglePaid } from '../../../../store/front/reservationAction';

const GenInvoiceModal = ({ setshowInvoiceModal, showInvoiceModal, reservation, setReservation }) => {

    const { user, role } = useSelector((state) => state.auth);
    const [loading, setloading] = useState(false)
    const dispatch = useDispatch()
    const switchActiveStyles = {
        backgroundColor: '#198754', // Green background color when checked
        borderColor: '#198754', // Green border color when checked
    };
    const switchInctiveStyles = {
        backgroundColor: '#dc3545', // Green background color when checked
        borderColor: '#dc3545', // Green border color when checked
    };
    useEffect(() => {
        setinvoice({ description: "", reservationId: reservation.id })

    }, [reservation.id])

    const [invoice, setinvoice] = useState({
        reservationId: reservation.id,
        description: ""
    })
    const generatePDF = async () => {
        const doc = <InvoiceDocument reservation={reservation} description={invoice.description} />;
        const blob = await pdf(doc).toBlob();
        saveAs(blob, `Facture #${reservation.ref}.pdf`);
    };
    const [form] = Form.useForm();
    const handledescChange = (e) => {
        setinvoice({ reservationId: reservation.id, description: e.target.value })
    }
    const handleCancel = () => {
        setshowInvoiceModal(false);
    };
    const handleSubmit = async () => {
        setloading(true)
        try {
            await ReservationApi.genInvoice(invoice)
            await generatePDF()
            setshowInvoiceModal(false)
        } catch (error) {
            alert("error while gnerating invoice")
            console.log(error);

        }
        setloading(false)
    }


    const handleTogglePaid = ({ reservId, mode, id }) => {

        dispatch(togglePaid({ reservId, id, mode })).unwrap()
            .then(setReservation({
                ...reservation,
                invoices: reservation.invoices.map((invoice, index) =>
                    index === 0 ? { ...invoice, paid: mode } : invoice
                )
            }))
    }
    return (
        <Modal
            open={showInvoiceModal}
            title={reservation?.invoices?.length > 0 ? `La facture #${reservation.ref}` : "Generer  la facture"}
            okText={reservation?.invoices?.length > 0 ? "Ok" : "Generer"}
            cancelText="Annuler"
            onCancel={handleCancel}
            onOk={() => {
                reservation?.invoices?.length > 0 ? setshowInvoiceModal(false) :
                    handleSubmit()
            }}
            confirmLoading={loading}
        >
            <Form
                form={form}
                name="my-form"
                initialValues={{ remember: true }}

            >
                <ul className='p-2 bg-gray-50 rounded-md'>
                    {
                        (role == "admin" && reservation) && <li className='flex py-2 items-center  border-b-2 border-white'><span className='font-medium'><CalendarOutlined /> Paye</span> <span className="ml-auto">

                            <Switch
                                checked={reservation?.invoices[0]?.paid}
                                onChange={(checked) => handleTogglePaid({ reservId: reservation.id, mode: checked ? true : false, id: reservation.invoices[0].id })}
                                checkedChildren={<CheckOutlined />} // Icon when checked
                                unCheckedChildren={<CloseOutlined />} // Icon when unchecked
                                 // Apply custom styles when checked
                            />
                        </span></li>
                    }

                    <li className='flex py-2 items-center  border-b-2 border-white'><span className='font-medium'><CalendarOutlined /> Date</span> <span className="ml-auto">{reservation.date}</span></li>
                    <li className='flex py-2 items-center  border-b-2 border-white'><span className='font-medium'><UserAddOutlined /> Client</span> <span className="ml-auto">{reservation.client}</span></li>
                    <li className='flex py-2 items-center  border-b-2 border-white'><span className='font-medium'><EnvironmentOutlined /> Addresse</span> <span className="ml-auto">{reservation.address}</span></li>
                    <li className='flex py-2 items-center  border-b-2 border-white'><span className='font-medium'><PhoneOutlined /> Telephone</span> <span className="ml-auto">{reservation.phone}</span></li>
                    <li className='flex py-2 items-center  border-b-2 border-white'>
                        <span className='font-medium'>
                            <MobileOutlined className='mr-2' />Modele</span>
                        <span className="ml-auto">{reservation.model}</span>
                    </li>

                    <li className='flex py-2 items-center  border-b-2 border-white'>
                        <span className='font-medium'>
                            <BugOutlined className='mr-2' />Type de probleme</span>
                        <span className="ml-auto">{reservation.problem ? reservation.problem:"Autre"}</span>
                    </li>

                    <li className=' pb-2 items-center border-b-2 border-white'>
                        <span className='font-medium pb-2'>Decscription</span>

                    </li>
                    {
                        reservation?.invoices?.length > 0 ? <p> {reservation?.invoices[0].description}</p> : <TextArea onChange={handledescChange} showCount maxLength={100} placeholder="Description de votre probleme" />
                    }


                    <li className='flex  text-slate-800 text-base'>
                        <span className='font-medium'>Total</span> <span className="ml-auto font-medium">{reservation.price}  mad</span>
                    </li>
                    <Form.Item
                        name="reservationId"
                        className='mt-2'
                        hidden
                        initialValue={reservation.id}

                    > <Input />
                    </Form.Item>

                </ul>
            </Form>
        </Modal>
    )
}

export default GenInvoiceModal