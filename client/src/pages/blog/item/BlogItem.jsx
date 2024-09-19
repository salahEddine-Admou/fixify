import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Drawer, Modal } from 'antd';
import { ReadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteExistingBlog } from '../../../store/blogpage/blogAction';

const { confirm } = Modal;

const BlogItem = ({ blog, isAdmin, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const showConfirm = () => {
    confirm({
      title: 'Êtes-vous sûr de vouloir supprimer ce blog ?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        handleDelete();
      },
    });
  };

  const handleDelete = () => {
    dispatch(deleteExistingBlog(blog.id));
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <>
      <div className="mx-auto max-w-md mb-3 md:mb-0 overflow-hidden rounded-lg bg-white shadow-md md:h-[500px] h-[550px] relative">
        <div style={{ position: 'relative' }}>
          <img
            src={blog.imageBlog}
            className="aspect-video w-full object-cover"
            style={{ height: '200px' }}
            alt=""
          />
          {isAdmin && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => onEdit(blog)}
                style={{ marginRight: '8px' }}
              />
              <Button
                type="danger"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={showConfirm}
                style={{ backgroundColor: '#1890ff', color: '#fff' }}
              />
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="mb-1 text-sm text-primary-500">
            Andrea Felsted • <time>18 Nov 2022</time>
          </p>
          <h3 className="text-xl font-medium text-gray-900">{truncateDescription(blog.name, 15)} ...</h3>
          <p className="mt-1 text-gray-500">{truncateDescription(blog.description, 10)}...</p>
          <div className="mt-4 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
              {blog.problem}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
              {blog.model}
            </span>

          </div>
          <Button className="absolute bottom-4" type="primary" icon={<ReadOutlined />} onClick={showDrawer} >
            Lire plus
          </Button>
        </div>
      </div>

      <Drawer
        title={blog.name}
        width={700}
        onClose={onClose}
        visible={visible}
      >
        <div className="overflow-hidden rounded-lg bg-white shadow-md  relative">
          <div style={{ position: 'relative' }}>
            <img
              src={blog.imageBlog}
              className="aspect-video w-full object-cover"
              style={{ height: '200px' }}
              alt=""
            />
            {isAdmin && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(blog)}
                  style={{ marginRight: '8px' }}
                />
                <Button
                  type="danger"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={showConfirm}
                  style={{ backgroundColor: '#1890ff', color: '#fff' }}
                />
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="mb-1 text-sm text-primary-500">
              Andrea Felsted • <time>18 Nov 2022</time>
            </p>
            <h3 className="text-xl font-medium text-gray-900">{blog.name}</h3>
            <p className="mt-1 text-gray-500">{blog.description}</p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                {blog.problem}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                {blog.model}
              </span>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default BlogItem;
