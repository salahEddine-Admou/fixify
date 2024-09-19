import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RepairerApi from '../../../../api/repairerApi';
import ReservationApi from '../../../../api/ReservationApi';
import { successToast,errorToast } from '../../../../utils';

const ReservationPopup = ({ showPopup, setShowPopup, reservation,fetchReservations }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [repairers, setRepairers] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(reservation)
        const fetchRepairers = async () => {
            try {
                // Remplacez cette ligne par votre méthode pour récupérer les réparateurs depuis votre API
                const repairersData = await RepairerApi.getAll();
                setRepairers(repairersData.data); // Mettre à jour l'état avec les données des réparateurs
            } catch (error) {
                console.error('Erreur lors de la récupération des réparateurs :', error);
            }
        };

        fetchRepairers(); // Appeler la fonction au chargement du composant
    }, []);

    const handleCancel = () => {
        setShowPopup(false);
    };

    const handleOk = () => {
        form.validateFields().then(async values => {
            setLoading(true);
            try {
                await ReservationApi.Affecter(reservation.ref,{
                    repairerId: values.repairer,
                    price: values.price,
                });
                successToast("Affecter avec succes")
                setLoading(false);
                setShowPopup(false); 
                fetchReservations();
            } catch (error) {
                errorToast('Erreur lors de l\'affectation de la réservation :', error);
                setLoading(false);
            }
        }).catch(info => {
            console.log('Validation Failed:', info);
        });
    };

    return (
        <Modal
            visible={showPopup}
            title={`Affectation pour la réservation ${reservation.ref}`}
            okText="Affecter"
            confirmLoading={loading}
            cancelText="Annuler"
            onCancel={handleCancel}
            onOk={handleOk}
            width={700}
        >
            <Form form={form} layout="vertical">
                <Row gutter={24} className='items-center'>
                    <Col xs={24} sm={12}>
                        <label className='font-semibold'>Réparateur</label>
                        <Form.Item
                    name="repairer"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez sélectionner un réparateur!',
                        },
                    ]}
                >
                    <Select placeholder="Sélectionner un réparateur">
                        {repairers.map(repairer => (
                            <Select.Option key={repairer.id} value={repairer.id}>
                                {repairer.username}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col xs={24} sm={10}>
                        <label className='font-semibold'>Prix</label>
                        <Form.Item
                            name="price"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer le prix!',
                                },
                            ]}
                        >
                            <Input
                                prefix="(Mad)"
                                style={{
                                    width: '100%',
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ReservationPopup;
