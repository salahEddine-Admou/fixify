import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../../store/blogpage/blogAction';
import BlogItem from './item/BlogItem';
import { Row, Col, Spin, Alert, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { blue } from '@ant-design/colors';

const Blog = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading) return <div className='h-[90vh] flex items-center justify-center' ><Spin /></div>;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  const filteredBlogs = blogs.filter((blog) =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ marginTop: '80px', paddingRight: '20px', paddingLeft: '20px' }}>
      <Row justify="end" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <Input
            placeholder="Rechercher un blog"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '300px',
              borderRadius: '7px',
              borderColor: blue.primary,
              boxShadow: '0 0 2px rgba(0, 0, 0, 0.1)',

            }}
            suffix={<SearchOutlined style={{ color: blue.primary, fontSize: '1.2em', marginRight: '3px' }} />}
          />
        </Col>
      </Row>
      <Row gutter={[19, 19]}>
        {filteredBlogs.map((blog) => (
          <Col key={blog.id} md={8} >
            {/* Adjust the paddingLeft value to control the spacing */}
            <BlogItem blog={blog} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Blog;
