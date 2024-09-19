import React, { useState } from 'react'
import { Input, Select, Upload, Button, Form, Row, Col, Breadcrumb,message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PictureOutlined, HomeOutlined ,PlusOutlined} from '@ant-design/icons';
import MasterInput from '../../../../../components/forms/MasterInput';
import { DashboardNavbar } from '../../../../../components/navbar/DashboardNavbar';
import Adminlayout from '../../../../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { createSupportTechnique } from '../../../../../api/supportTechniqueApi';
import AuthApi from '../../../../../api/AuthApi';
import UplaodApi from '../../../../../api/UploadApi';


const AddSupport = () => {
    const [loading, setLoading] = useState(false);
    const [supports, setSupports] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();
    const [form] = Form.useForm();

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

    const onFinish = async (values) => {
        try {
            console.log(values);
            setLoading(true);
            const newSupport = await createSupportTechnique(values);
            message.success('Le support technique a été ajouté avec succès.');

            setSupports([newSupport, ...supports]);
             // Redirection vers la liste des supports après succès
            navigate('/admin/support');
        } catch (error) {
            message.error('Une erreur s\'est produite lors de l\'ajout du support technique.');
        } finally {
            setLoading(false);
        }
    };
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
                                    <span>Ajouter support</span>
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
                    form={form}
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Row gutter={16}>
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
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Nom d'utilisateur</label>
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                    { validator: checkUsernameAvailability }
                                ]}
                            >
                                <MasterInput
                                    placeholder="Username"
                                    icon={<UserOutlined />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
    
                    <Row gutter={16}>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Prenom</label>
                            <Form.Item
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="First Name"
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
                                        message: 'Please input your last name!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="Last Name"
                                    icon={<UserOutlined />}
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
                            <label className='font-semibold' htmlFor="">Ville</label>
                            <Form.Item
                                name="city"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your city!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="City"
                                    icon={<UserOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Address</label>
                            <Form.Item
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your address!',
                                    },
                                ]}
                            >
                                <MasterInput
                                    placeholder="Address"
                                    icon={<UserOutlined />}
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
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
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
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Mot de passe</label>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <MasterInput
                                    type="password"
                                    placeholder="Password"
                                    icon={<LockOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <label className='font-semibold' htmlFor="">Confirmation du mot de passe</label>
                            <Form.Item
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <MasterInput
                                    type="password"
                                    placeholder="Confirm Password"
                                    icon={<LockOutlined />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Soumettre
                        </Button>
                    </Form.Item>
                </Form>
            </div>
    
        </Adminlayout>
    )
}    


export default AddSupport