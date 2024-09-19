import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Select, Upload, Button, Form, Row, Col, Breadcrumb, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PictureOutlined, HomeOutlined } from '@ant-design/icons';
import MasterInput from '../../../../../components/forms/MasterInput';
import Adminlayout from '../../../../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { getLivreurById , updateLivreur } from '../../../../../api/LivreurApi';

const EditLivreur = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [livreur, setLivreur] = useState(null);

    useEffect(() => {
        const fetchLivreur = async () => {
            try {
                const data = await getLivreurById(id);
                setLivreur (data);
            } catch (error) {
                message.error('Une erreur s\'est produite lors de la récupération du Livreur .');
            }
        };
        fetchLivreur ();
    }, [id]);

    const onFinish = async (values) => {
        console.log(values)
        try {
            setLoading(true);
            await updateLivreur (id, values);
            message.success('Le Livreur  a été mis à jour avec succès.');
            navigate('/admin/livreur');
        } catch (error) {
            message.error('Une erreur s\'est produite lors de la mise à jour du Livreur .');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Adminlayout>
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
                                    <span>Modifier Le Livreur </span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            {livreur  && (
                <div className='mt-3'>
                    <Form
                        name="register"
                        onFinish={onFinish}
                        className='mt-3'
                        initialValues={{
                            id: livreur.id,
                            username: livreur.username,
                            firstName: livreur.firstName,
                            lastName: livreur.lastName,
                            gender: livreur.gender,
                            address: livreur.address,
                            city: livreur.city,
                            email: livreur.email,
                            password: livreur.password,
                            confirm: livreur.profilePic,
                            
                        }}
                        scrollToFirstError
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Prénom</label>
                                <Form.Item
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez saisir le prénom!',
                                        },
                                    ]}
                                >
                                    <MasterInput
                                        placeholder="Prénom"
                                        icon={<UserOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Nom</label>
                                <Form.Item
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez saisir le nom!',
                                        },
                                    ]}
                                >
                                    <MasterInput
                                        placeholder="Nom"
                                        icon={<UserOutlined />}
                                    />
                                </Form.Item>
                                <Form.Item
                                        name="id"  
                                        style={{ display: 'none' }} 
                            >   </Form.Item>
                            <Form.Item
                                        name="username"  
                                        style={{ display: 'none' }} 
                            >   </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Genre</label>
                            <Form.Item
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner votre genre!',
                                    },
                                ]}
                            >
                                <Select placeholder="Sélectionner un genre" options={[
                                    { value: true, label: 'Homme' },
                                    { value: false, label: 'Femme' },
                                ]} />
                            </Form.Item>
                        </Col>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Adresse</label>
                                <Form.Item
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez saisir l\'adresse!',
                                        },
                                    ]}
                                >
                                    <MasterInput
                                        placeholder="Adresse"
                                        icon={<HomeOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Ville</label>
                                <Form.Item
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez saisir la ville!',
                                        },
                                    ]}
                                >
                                    <MasterInput
                                        placeholder="Ville"
                                        icon={<HomeOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Email</label>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { type: 'email', message: 'Veuillez saisir une adresse e-mail valide!' },
                                        { required: true, message: 'Veuillez saisir l\'adresse e-mail!' },
                                    ]}
                                >
                                    <MasterInput
                                        type="text"
                                        placeholder="Email"
                                        icon={<MailOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Nom d'utilisateur</label>
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez saisir le nom d\'utilisateur!',
                                        },
                                    ]}
                                >
                                    <MasterInput
                                        placeholder="Nom d'utilisateur"
                                        icon={<UserOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Mot de passe</label>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez saisir le mot de passe!',
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <MasterInput
                                        type="password"
                                        placeholder="Mot de passe"
                                        icon={<LockOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Confirmation du mot de passe</label>
                                <Form.Item
                                    name="confirm"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez confirmer le mot de passe!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Les deux mots de passe ne correspondent pas!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <MasterInput
                                        type="password"
                                        placeholder="Confirmer le mot de passe"
                                        icon={<LockOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <label className='font-semibold' htmlFor="">Photo de profil</label>
                                <Form.Item
                                    name="profilePic"
                                >
                                    <Upload.Dragger className='bg-gray-200' name="files" multiple={false}>
                                        <p className="ant-upload-drag-icon">
                                            <PictureOutlined />
                                        </p>
                                        <p className="ant-upload-text">Cliquez ou faites glisser un fichier dans cette zone pour le télécharger</p>
                                        <p className="ant-upload-hint">Support d'upload unique.</p>
                                    </Upload.Dragger>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Enregistrer
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </Adminlayout>
    );
};

export default EditLivreur;
