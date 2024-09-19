
import React, { useEffect, useRef, useState } from 'react'
import { Form, Select, Col, Row, Input, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { UserOutlined, MailOutlined,HomeOutlined, LockOutlined,PhoneOutlined, PoundOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import "./livreurSignup.css"
import { registerClient } from '../../../store/auth/authActions';

import AuthApi from '../../../api/AuthApi';
import MasterInput from '../../forms/MasterInput';
import UplaodApi from '../../../api/UploadApi';
const { Option } = Select;
const ClientSignup = ({ setSubmitType, submitType, setloginForm, setShowNotif, setSignupMode }) => {
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const dispatch = useDispatch()
    const [imageUrl, setImageUrl] = useState(null);


    const checkUsernameAvailability = (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        return AuthApi.checkUsername({ username: value, email: "" })
            .then(response => {
                return Promise.resolve();
            })
            .catch(error => {
                return Promise.reject('Username is already taken');
            });
    };
    const checkEmailAvailability = (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        return AuthApi.checkUsername({ username: "", email: value })
            .then(response => {
                return Promise.resolve();
            })
            .catch(error => {
                return Promise.reject('Email is already taken');
            });
    };

    useEffect(() => {
        if (submitType == "client") {
            form.validateFields().then(values => {
                dispatch(registerClient(values)).unwrap().then(() => {
                    setShowNotif(true)
                    setloginForm({})
                    form.resetFields();
                    setSubmitType("")
                }).catch(() => setSubmitType(""))
            }).catch(error => {
                console.error('Validation failed:', error);
                setSubmitType("")
            });
        }
    }, [submitType])



    const validatePasswordConfirmation = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    });

    const handleUpload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const formData = new FormData();
        formData.append('file', file);
        const config = {
            headers: { "content-type": "multipart/form-data" },

        };

        try {
            const response = await UplaodApi.uploadCinImage(formData, config)
            const imgUrl = response.data.imageUrl
            form.setFieldsValue({ imageProfile: imgUrl })
            setImageUrl(imgUrl)
            onSuccess(file);

            // You can further process the response, such as updating state or form fields
            console.log('Uploaded image URL:', imgUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            onError({ event: error });

        }
    };


    const handleReturn = () => {
        setSignupMode("")
        form.resetFields()
    }
    return (
        <div className='animate__animated animate__fadeIn'>
            <span className='font-medium text-base'> <LeftOutlined onClick={handleReturn} className='text-blue-500 cursor-pointer' /> Client</span>
            <Form
                form={form}
                name="my-form"
                className='pt-2'
                initialValues={{ remember: true }}
                ref={formRef}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <label className='font-semibold' htmlFor="">Image de profil</label>
                        <Form.Item hidden name="imageProfile">
                            <Input />
                        </Form.Item>
                        <Upload customRequest={handleUpload} className='mt-2 block' name="files" multiple={false}>
                            {
                                imageUrl
                                    ? <img className="w-auto h-[60px] object-cover rounded-full animate__animated animate__fadeIn" src={imageUrl} alt="" />
                                    : <div className='cursor-pointer p-3 h-[60px] flex items-center justify-center w-[60px] rounded-full border border-blue-500'><PlusOutlined className='text-blue-500 ' /></div>
                            }

                        </Upload>
                    </Col>
                    <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">UserName</label>
                        <Form.Item
                            hasFeedback

                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre UserName!',
                                },
                                { validator: checkUsernameAvailability }
                            ]}
                        >
                            <MasterInput
                                placeholder="UserName"
                                icon={<UserOutlined />}
                            />

                        </Form.Item>
                    </Col>
                </Row>
               
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
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
                    <Col xs={24} sm={12}>
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

                </Row>
                <Row gutter={24}>
                <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">Numéro téléphone:</label>
                        <Form.Item
                            hasFeedback

                            name="numero"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre numéro téléphone!',
                                },
                                {
                                    min: 10,
                                    message: 'Le numéro téléphone doit contenir au moins 10 !',
                                },

                               
                            ]}
                        >
                            <MasterInput
                                placeholder="numero"
                                icon={<PhoneOutlined />}
                            />

                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">Adresse:</label>
                        <Form.Item
                            hasFeedback
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre Address!',
                                },
                               
                            ]}
                        >
                            <MasterInput
                                placeholder="address"
                                icon={<HomeOutlined />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
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
                    <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">Email</label>
                        <Form.Item
                            hasFeedback
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
                                { validator: checkEmailAvailability }
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
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">Mot de passe</label>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre mot de passe!',
                                },
                                {
                                    min: 6,
                                    message: 'Le mot de passe doit contenir au moins 6 caractères!',
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
                    <Col xs={24} sm={12}>
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


            </Form>
        </div>
    )
}

export default ClientSignup