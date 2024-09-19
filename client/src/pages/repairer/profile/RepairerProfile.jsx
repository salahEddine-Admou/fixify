import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Upload, message, Select, Breadcrumb, Descriptions } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined, PoundOutlined, PlusOutlined, EditOutlined, PhoneOutlined } from '@ant-design/icons';
import Adminlayout from '../../../layouts/AdminLayout';
import { Editor } from '@tinymce/tinymce-react';
import RepairerApi from '../../../api/repairerApi';
import MultiImageUploader from '../../../components/forms/MultiImageUploader';
import UplaodApi from '../../../api/UploadApi';
import PortfolioImageUploader from '../../../components/forms/PortfolioImageUploader';
import { updateRepairer } from '../../../api/supportTechniqueApi';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../../../api/AuthApi';
import MasterInput from '../../../components/forms/MasterInput';
import { errorToast, successToast } from '../../../utils';

const { Option } = Select;

const RepairerProfile = () => {
    const [repairer, setRepairerInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [form] = Form.useForm();
    const [portfolios, setPortfolios] = useState([]);
    const [gender, setGender] = useState(null);

    const handleGenderChange = (value) => {
        setGender(value);
        form.setFieldsValue({ gender: value });
    };

    const handleRemovePortfolio = (url) => {
        const updatedPortfolios = portfolios.filter(photo => photo.src !== url);
        setPortfolios(updatedPortfolios);
        form.setFieldsValue({ imagePortfolio: updatedPortfolios.map(cin => (cin.src)) });
    };

    useEffect(() => {
        const fetchRepairer = async () => {
            try {
                const username = localStorage.getItem('user');
                if (username) {
                    const response = await RepairerApi.getByUsername(username);
                    const repairerData = response.data;
                    setRepairerInfo(repairerData);
                    form.setFieldsValue(repairerData);
                    if (repairerData.imageProfile) {
                        setImageUrl(repairerData.imageProfile);
                    }
                    if (repairerData.portfolios && repairerData.portfolios.length > 0) {
                        setPortfolios(repairerData.portfolios);
                    }
                    form.setFieldsValue({ imagePortfolio: repairerData.portfolios.map(pro => (pro.src)) });
                    setGender(repairerData.gender ? "true" : "false");
                }
            } catch (error) {
                console.error('Error fetching repairer info:', error);
            }
        };
        fetchRepairer();
    }, []);

    const emailChangePassword = async (id) => {
        try {
            await RepairerApi.emailChangePassword(id);
            successToast("Vérifiez votre email");
        } catch (error) {
            errorToast(error);
        }
    };

    const handleEditorChange = (content, editor) => {
        form.setFieldsValue({ description: content });
    };

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            await updateRepairer(repairer.id, values);
            message.success('Réparateur mis à jour avec succès.');
        } catch (error) {
            message.error('Une erreur s\'est produite lors de la mise à jour du profil.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (options) => {
        const { onSuccess, onError, file } = options;
        const formData = new FormData();
        formData.append('file', file);
        const config = {
            headers: { "content-type": "multipart/form-data" },
        };
        try {
            const response = await UplaodApi.uploadCinImage(formData, config);
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
        <Adminlayout>
            {repairer ? (
                <>
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
                                            <span>Modifier réparateur</span>
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
                            scrollToFirstError
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="id" hidden>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                            <Col xs={24} sm={12}>
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
                                <Col xs={24} sm={12}>
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
                                                message: 'Le numéro téléphone doit contenir au moins 10 caractères!',
                                            },
                                        ]}
                                    >
                                        <MasterInput
                                            placeholder="Numéro"
                                            icon={<PhoneOutlined />}
                                        />
                                    </Form.Item>
                                </Col>
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
                                        <Select placeholder="Sélectionner un genre" onChange={handleGenderChange} options={[
                                            { value: true, label: 'Homme' },
                                            { value: false, label: 'Femme' },
                                        ]} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
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
                                <Col xs={24} sm={12}>
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
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="username"
                                    >
                                        <Input prefix={<UserOutlined />} hidden />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
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
                                        showUploadList={false}
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
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <label className="font-semibold">Description</label>
                                    <Form.Item name="description" initialValue={repairer.description}>
                                        <Input hidden />
                                    </Form.Item>
                                    <Editor
                                        apiKey='1f19wmhy9x425pq5wx7dzrtfe7zec3rho30lry4rjivz7d5e'
                                        init={{
                                            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                        }}
                                        onEditorChange={handleEditorChange}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <label className="font-semibold">Portfolio d'images (Vous avez le droit d'ajouter 5 images maximum)</label>
                                    <Form.Item name="imagePortfolio" initialValue={repairer && repairer.portfolios ? repairer.portfolios.map(image => image.src) : []}>
                                        <Input type="hidden" />
                                        <Upload
                                            name="imagePortfolio"
                                            listType="picture-card"
                                            multiple={true}
                                            fileList={portfolios.map((image, index) => ({
                                                uid: index,
                                                name: `Image ${index + 1}`,
                                                status: 'done',
                                                url: image.src,
                                            }))}
                                            onRemove={(file) => handleRemovePortfolio(file.url)}
                                        >
                                        </Upload>
                                        {portfolios.length < 5 && (
                                            <Form.Item name="imagePortfolio">
                                                <PortfolioImageUploader form={form} name="imagePortfolio" maxFiles={5 - portfolios.length} />
                                            </Form.Item>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loading} onClick={() => onFinish()}>Enregistrer</Button>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item>
                                        <Button type="primary" onClick={() => emailChangePassword(repairer.id)}>Changer Password</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="cin"
                                    >
                                        <Input prefix={<UserOutlined />} hidden />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="rib"
                                    >
                                        <Input prefix={<PoundOutlined />} hidden />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="email"
                                        >
                                            <Input prefix={<MailOutlined />} hidden />
                                        </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="password"
                                    >
                                        <Input.Password prefix={<LockOutlined />} hidden />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </Adminlayout>
    );
};

export default RepairerProfile;
