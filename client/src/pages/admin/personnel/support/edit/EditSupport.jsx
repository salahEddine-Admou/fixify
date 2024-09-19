import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Upload, message, Breadcrumb, Select } from 'antd';
import { UserOutlined, MailOutlined, HomeOutlined, PlusOutlined, EditOutlined,LockOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../../layouts/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { getSupportTechniqueById, updateSupportTechnique } from '../../../../../api/supportTechniqueApi';
import UploadApi from '../../../../../api/UploadApi';
import './EditSupport.css';

const EditSupport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchSupport = async () => {
            try {
                const support = await getSupportTechniqueById(id);
                form.setFieldsValue({
                    ...support,
                    password: '' // Assurez-vous que le champ du mot de passe est vide pour qu'il ne soit pas pré-rempli avec le mot de passe encodé
                });
                if (support.imageProfile) {
                    setImageUrl(support.imageProfile);
                }
            } catch (error) {
                console.error('Error fetching support:', error);
            }
        };
        fetchSupport();
    }, [form, id]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await updateSupportTechnique(id, values);
            message.success('Support technique mis à jour avec succès.');
            navigate('/admin/support');
        } catch (error) {
            message.error('Une erreur s\'est produite lors de la mise à jour du support technique.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (options) => {
        const { onSuccess, onError, file } = options;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await UploadApi.uploadCinImage(formData);
            const imgUrl = response.data.imageUrl;
            form.setFieldsValue({ imageProfile: imgUrl });
            setImageUrl(imgUrl);
            onSuccess(file);
        } catch (error) {
            console.error('Error uploading image:', error);
            onError({ event: error });
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
                                    <span>Modifier support</span>
                                </>
                            ),
                        },
    
                    ]}
                />
            </div>
            <div className="mt-6">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Row gutter={16}>
                    <Col span={12}>
    <label className="font-semibold">Image de profil</label>
    <Form.Item name="imageProfile" hidden>
        <Input />
    </Form.Item>
    <Upload
        customRequest={handleUpload}
        name="files"
        multiple={false}
        maxCount={1}
        listType="picture-card"
        showUploadList={false} // Désactiver l'affichage de la liste
    >
        {imageUrl ? (
            <div className="avatar-upload">
                <div className="avatar-preview">
                    <img src={imageUrl} alt="Image de profil" className="avatar-image" />
                    <EditOutlined className="edit-icon" onClick={() => document.querySelector('.ant-upload-select-picture-card').click()} /> {/* Lorsque l'utilisateur clique sur l'icône de modification, ouvrir la boîte de dialogue de téléchargement */}
                </div>
            </div>
        ) : (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 3 }}>Télécharger</div>
            </div>
        )}
    </Upload>
</Col>
                    
                    
                        <Col span={12}>
                            <label className="font-semibold">Nom d'utilisateur</label>
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez saisir le nom d\'utilisateur',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <label className="font-semibold">Prénom</label>
                            <Form.Item
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez saisir le prénom',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <label className="font-semibold">Nom</label>
                            <Form.Item
                                name="lastName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez saisir le nom',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} />
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
                            <label className="font-semibold">Ville</label>
                            <Form.Item
                                name="city"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez saisir la ville',
                                    },
                                ]}
                            >
                                <Input prefix={<HomeOutlined />} />
                            </Form.Item>
                        </Col>
                        
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                            <label className="font-semibold">Adresse</label>
                            <Form.Item
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez saisir l\'adresse',
                                    },
                                ]}
                            >
                                <Input prefix={<HomeOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <label className="font-semibold">Email</label>
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez saisir l\'email',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Veuillez saisir un email valide',
                                    },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} />
                            </Form.Item>
                        </Col>
                        
                    </Row>

                    <Row gutter={16}>
                    <Col span={12}>
                            <label className="font-semibold">Mot de passe</label>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez saisir le mot de passe',
                                    },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <label className="font-semibold">Confirmation du mot de passe</label>
                            <Form.Item
                                name="confirm"
                                dependencies={['password']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez confirmer le mot de passe',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>Enregistrer</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </AdminLayout>
    );
};

export default EditSupport;