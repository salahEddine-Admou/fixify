import React from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, Upload, Button, Form, Row, Col, Select,Spin } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PictureOutlined, HomeOutlined,PoundOutlined } from '@ant-design/icons';
import MasterInput from '../../../../../components/forms/MasterInput';
import AdminLayout from '../../../../../layouts/AdminLayout';
import { useDispatch } from 'react-redux';
import { SignUpRepairer } from '../../../../../store/dashboard/repairer/repairerAction';


const AddRepairer = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        console.log('Received values:', values);
        dispatch(SignUpRepairer(values));
       // form.resetFields();
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
                                    <span>Ajouter Repairer</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            <div className='mt-3'>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    className='mt-3'
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <label className='font-semibold' htmlFor="">Prénom</label>
                            <Form.Item
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre prénom!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="Prénom"
                                    icon={<UserOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <label className='font-semibold' htmlFor="">Nom</label>
                            <Form.Item
                                name="lastName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre nom de famille!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="Nom de famille"
                                    icon={<UserOutlined />}
                                />
                                
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <label className='font-semibold' htmlFor="">UserName</label>
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre UserName!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="UserName"
                                    icon={<UserOutlined />}
                                />
                                
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">CIN</label>
                            <Form.Item
                                name="cin"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre CIN!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="CIN"
                                    icon={<UserOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Rib</label>
                            <Form.Item
                                name="rib"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre Rib!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="Rib"
                                    icon={<PoundOutlined />}
                                />
                            </Form.Item>
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
                                        message: 'Veuillez entrer votre adresse!',
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
                                        message: 'Veuillez entrer votre ville!',
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
                                    {
                                        type: 'email',
                                        message: 'L\'email n\'est pas valide!',
                                    },
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre email!',
                                    },
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
                            <label className='font-semibold' htmlFor="">Mot de passe</label>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre mot de passe!',
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
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Confirmation mot de passe</label>
                            <Form.Item
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez confirmer votre mot de passe!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Les deux mots de passe que vous avez entrés ne correspondent pas!'));
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
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Image de profil</label>
                            <Form.Item name="imageProfile">
                                <Upload.Dragger className='bg-gray-200' name="files" multiple={false}>
                                    <p className="ant-upload-drag-icon">
                                        <PictureOutlined />
                                    </p>
                                    <p className="ant-upload-text"> Veuillez glisser vos fichiers dans cette zone ou les télécharger</p>
                                    <p className="ant-upload-hint">Un seul téléchargement suffit.</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Image d'identité</label>
                            <Form.Item name="imageIdentity">
                                <Upload.Dragger className='bg-gray-200' name="files" multiple={false}>
                                    <p className="ant-upload-drag-icon">
                                        <PictureOutlined />
                                    </p>
                                    <p className="ant-upload-text">Veuillez glisser vos fichiers dans cette zone ou les télécharger</p>
                                    <p className="ant-upload-hint">Un seul téléchargement suffit.</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            SignUp
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            
        </AdminLayout>
    );
};

export default AddRepairer;
