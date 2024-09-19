import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Spin, Alert, Input, Button, Form, Modal, Select, Upload, message, Breadcrumb } from 'antd';
import { PlusOutlined, UploadOutlined, HomeOutlined } from '@ant-design/icons';
import AdminLayout from '../../../layouts/AdminLayout';
import BlogItem from '../../../pages/blog/item/BlogItem';
import blogApi from '../../../api/BlogApi';
import ModelApi from '../../../api/ModelAPI';
import ProblemTypeApi from '../../../api/ProblemTypeApi';
import { fetchBlogs, deleteExistingBlog } from '../../../store/blogpage/blogAction';
import UploadApi from '../../../api/UploadApi';

const { Option } = Select;

const GuidesAdmin = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);
  const [visible, setVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [models, setModels] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAllBlogs();
    fetchModels();
  }, [dispatch]);

  const fetchAllBlogs = async () => {
    dispatch(fetchBlogs());
  };

  const fetchModels = async () => {
    try {
      const response = await ModelApi.getAll();
      setModels(response.data);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const fetchProblems = async (modelId) => {
    try {
      const response = await ProblemTypeApi.getByModel(modelId);
      setProblems(response.data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    }
  };

  const openAddBlogModal = () => {
    setVisible(true);
    setCurrentBlog(null);
    setImagePreview(null);
    setImageFile(null);
    setImageUrl(null);
    setSelectedModel(null);
    setProblems([]);
    form.resetFields(); // Reset form fields
  };

  const handleEdit = async (blog) => {
    setCurrentBlog(blog);
    setVisible(true);
    if (blog.imageBlog) {
      setImagePreview(blog.imageBlog);
      setImageUrl(blog.imageBlog);
    }
    if (blog.modelId) {
      setSelectedModel(blog.modelId);
      await fetchProblems(blog.modelId); // Fetch problems for the selected model
    }
    form.setFieldsValue({
      name: blog.name,
      description: blog.description,
      model: blog.modelId,
      problem: blog.problemId,
    });
  };

  const handleDelete = async (id) => {
    try {
      await blogApi.deleteBlog(id);
      dispatch(deleteExistingBlog(id));
      fetchAllBlogs(); // Refresh the blog list
    } catch (error) {
      console.error('Failed to delete the blog:', error);
    }
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;

    if (!file) {
      message.error('Fichier invalide');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpload = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await UploadApi.uploadImage(formData);
      if (response.data && response.data.imageUrl) {
        const imgUrl = response.data.imageUrl;
        console.log('URL de l\'image téléchargée:', imgUrl);
        setImageUrl(imgUrl);
        onSuccess(file);
      } else {
        throw new Error('Le téléchargement de l\'image a échoué');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      onError({ event: error });
    }
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    fetchProblems(modelId);
  };

  const handleAddOrEdit = async (values) => {
    try {
      const requestData = {
        name: values.name,
        description: values.description,
        modelId: values.model,
        problemId: values.problem,
        imageBlog: imageUrl, // Assurez-vous que l'URL de l'image est ajoutée ici
      };

      console.log('Données de la demande:', requestData);

      let response;
      if (currentBlog) {
        response = await blogApi.updateBlog(currentBlog.id, requestData);
      } else {
        response = await blogApi.createBlog(requestData);
      }

      fetchAllBlogs(); // Refresh the blog list
      setVisible(false);
      setCurrentBlog(null);
      setImageFile(null);
      setImagePreview(null);
      setImageUrl(null); // Réinitialiser l'état de l'URL de l'image après la soumission
      form.resetFields(); // Reset form fields after submission
    } catch (error) {
      console.error('Échec de la sauvegarde du blog:', error);
    }
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-3">
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
                    <span>Les Blogs</span>
                  </>
                ),
              },
            ]}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddBlogModal}
        >
          Ajouter Blog
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        {blogs.map((blog) => (
          <Col key={blog.id} xs={24} sm={12} md={8} lg={6}>
            <BlogItem
              blog={blog}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={() => handleDelete(blog.id)}
            />
          </Col>
        ))}
      </Row>

      <Modal
        title={currentBlog ? 'Modifier Blog' : 'Ajouter Blog'}
        visible={visible}
        onCancel={() => { setVisible(false); setCurrentBlog(null); }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrEdit}
        >
          <Form.Item
            name="name"
            label="Blog Name"
            rules={[{ required: true, message: 'Please enter the blog name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the blog description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Image"
            rules={[{ required: true, message: 'Please upload an image' }]}
          >
            <Upload
              customRequest={handleProfileUpload}
              // beforeUpload={() => false}
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Telecharger  Image</Button>
            </Upload>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />
            )}
          </Form.Item>
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please select the model' }]}
          >
            <Select value={currentBlog ? currentBlog.modelId : undefined} onChange={handleModelChange}>
              {models.map(model => (
                <Option key={model.id} value={model.id}>{model.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="problem"
            label="Problem"
            rules={[{ required: true, message: 'Please select the problem' }]}
          >
            <Select value={currentBlog ? currentBlog.problemId : undefined} disabled={!selectedModel}>
              {problems.map(problem => (
                <Option key={problem.id} value={problem.id}>{problem.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentBlog ? 'Modifier' : 'Ajouter'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default GuidesAdmin;
