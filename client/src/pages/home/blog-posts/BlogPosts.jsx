import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BlogItem from '../../blog/item/BlogItem';
import { Col, Row } from 'antd';
import { fetchBlogs } from '../../../store/blogpage/blogAction';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';

const BlogPosts = () => {
    const { blogs, loading, error } = useSelector((state) => state.blogs);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);
    return (
        <>
            <div className="flex items-center justify-between ">
                <h2 className="fw-bolder md:text-2xl text-base title pb-2 w-fit relative">Guides techniques</h2>
                <Link to="/blog" className='text-blue-500 ml-auto font-semibold cursor-pointer'>Voir plus <RightOutlined /></Link>
            </div>

            <Row className='pt-3'>
                {blogs.slice(0, 3).map((blog) => (
                    <Col key={blog.id} className='md:pl-3 pl-0' md={8}  >
                        {/* Adjust the paddingLeft value to control the spacing */}
                        <BlogItem blog={blog} />
                    </Col>
                ))}
            </Row>

        </>
    )
}

export default BlogPosts