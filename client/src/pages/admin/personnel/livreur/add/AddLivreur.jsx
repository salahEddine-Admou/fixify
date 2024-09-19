import React, { useState } from 'react';
import { UserOutlined, MailOutlined, LockOutlined, PictureOutlined, HomeOutlined } from '@ant-design/icons';
import { Form, Row, Col, Select, Button, Upload, Breadcrumb, message } from 'antd';
import MasterInput from '../../../../../components/forms/MasterInput';
import AdminLayout from '../../../../../layouts/AdminLayout';
import { createLivreur } from '../../../../../api/LivreurApi';

const AddLivreur = () => {
    const [loading, setLoading] = useState(false);
    const [livreurs, setLivreurs] = useState([]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            // Assumez que la fonction createLivreur est définie et importée correctement
            const newLivreur = await createLivreur(values);
            message.success('Le livreur a été ajouté avec succès.');
            setLivreurs([newLivreur, ...livreurs]);
        } catch (error) {
            message.error('Une erreur s\'est produite lors de l\'ajout du livreur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center">
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            href: '',
                            title: (
                                <>
                                    <span>Ajouter un  Livreur</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            <div className='mt-3'>
                <Form
                    name="register"
                    onFinish={onFinish}
                    className='mt-3'
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    {/* Votre contenu de formulaire ici */}
                </Form>
            </div>
        </AdminLayout>
    );
};

export default AddLivreur;
