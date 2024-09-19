import React, { useEffect, useState } from 'react';
import { Upload, Form, Row, Col, Select, Input, AutoComplete } from 'antd';
import { UserOutlined,PhoneOutlined, MailOutlined, LockOutlined, PictureOutlined, HomeOutlined, PoundOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import MasterInput from '../../forms/MasterInput';
import { useDispatch } from 'react-redux';
import { SignUpRepairer } from '../../../store/auth/authActions';
import AuthApi from '../../../api/AuthApi';
import UplaodApi from '../../../api/UploadApi';
import MultiImageUploader from '../../forms/MultiImageUploader';
import { cities } from '../../../data/cities';
import RepairerApi from '../../../api/repairerApi';

const RepairerSignup = ({ setSubmitType, submitType, setloginForm, setShowNotif, setSignupMode }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [imageUrl, setImageUrl] = useState(null);

    const validateAndCheckRib = async (_, value) => {
        const regex = /^\d{14}$/;
        if (!value || !value.match(regex)) {
            return Promise.reject(new Error('The RIB must be exactly 14 characters and numeric.'));
        }
        try {
            await RepairerApi.checkRib(value);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject('RIB is already taken');
        }
    };


    const checkCinAvailability = (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        return RepairerApi.checkCin(value)
            .then(response => {
                return Promise.resolve();
            })
            .catch(error => {
                return Promise.reject('Cin is already taken');
            });
    };

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
   

    const handleProfileUpload = async (options) => {
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

        } catch (error) {
            console.error('Error uploading image:', error);
            onError({ event: error });

        }
    };

    useEffect(() => {
        if (submitType == "repairer") {
            form.validateFields().then(values => {
                console.log("rep", values);
                dispatch(SignUpRepairer(values)).unwrap().then(() => {
                    setShowNotif(true)
                    setloginForm({})
                    form.resetFields();
                    setSubmitType("")
                })
                    .catch(() => setSubmitType(""))
            }).catch(error => {
                console.error('Validation failed:', error);
                setSubmitType("")
            });
        }
    }, [submitType])


    const onFinish = async (values) => {
        dispatch(SignUpRepairer(values));
    };


    const handleReturn = () => {
        setSignupMode("")
        form.resetFields()
    }


    return (


        <div className=' animate__animated animate__fadeIn'>
            <span className='font-medium text-base'> <LeftOutlined onClick={handleReturn} className='text-blue-500 cursor-pointer' /> Reparateur</span>
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
                <Row gutter={24}>
                    <Col span={12}>
                        <label className='font-semibold' htmlFor="">Image de profil</label>
                        <Form.Item hidden name="imageProfile">
                            <Input />
                        </Form.Item>
                        <Upload customRequest={handleProfileUpload} className='mt-2 block' name="files" multiple={false}>
                            {
                                imageUrl
                                    ? <img className="w-[60px] h-[60px] object-cover rounded-full animate__animated animate__fadeIn" src={imageUrl} alt="" />
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
                        <label className='font-semibold' htmlFor="">CIN</label>
                        <Form.Item
                            name="cin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre CIN!',
                                },
                                {validator:checkCinAvailability}
                            ]}
                        >
                            <MasterInput
                                placeholder="CIN"
                                icon={<UserOutlined />}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">Rib</label>
                        <Form.Item
                            name="rib"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre Rib!',
                                },
                                {
                                    validator: validateAndCheckRib
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
                        <label className='font-semibold' htmlFor="">Adresse</label>
                        <Form.Item
                            name="address"
                            hasFeedback

                            rules={
                                [
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
                    <Col xs={24} sm={12}>
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
                            <AutoComplete

                                size='large'

                                options={cities.map(city => { return { value: city.ville, label: city.ville } })}
                                placeholder="Selectionner une ville"
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                            {/* <Select icon={<HomeOutlined />} placeholder="Sélectionner unne ville" options={

                                cities.map(city => { return { value: city.ville, label: city.ville } })
                            } /> */}

                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">Email</label>
                        <Form.Item
                            name="email"
                            hasFeedback
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

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
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

                <Row gutter={16}>
                <Col xs={24} sm={12}>
                        <label className='font-semibold' htmlFor="">Numéro téléphone:</label>
                        <Form.Item
                            hasFeedback

                            name="phone"
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
                    <Col span={12}>
                        <label className='font-semibold' htmlFor="">Image d'identité (Recto/Verso)</label>
                        <Form.Item name="imageIdentity">
                            <MultiImageUploader form={form} name="imageIdentity" maxFiles={2}  />
                        </Form.Item>
                    </Col>
                </Row>

            </Form >
        </div >

    );
};

export default RepairerSignup;
