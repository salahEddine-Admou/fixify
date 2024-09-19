import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Image } from 'antd';
import UploadApi from '../../api/UploadApi';

const PortfolioImageUploader = ({ form, name, maxFiles }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([])
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const handleUpload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const formData = new FormData();

        formData.append('file', file);
        const config = {
            headers: { "content-type": "multipart/form-data" },

        };

        try {
            const response = await UploadApi.uploadPortfolioImage(formData, config)
            const imgUrl = response.data.imageUrl


            const currentImageUrls = form.getFieldValue(name);

            if (Array.isArray(currentImageUrls)) {
                
                const updatedImageUrls = [...currentImageUrls, imgUrl];

                
                form.setFieldsValue({ [name]: updatedImageUrls });
            } else {
                
                form.setFieldsValue({ [name]: [imgUrl] });
            }
            onSuccess(file);
           
            console.log('Uploaded image URL:', imgUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            onError({ event: error });

        }
    };
    return (
        <>
            <Upload listType="picture-card"

                onPreview={handlePreview}
                onChange={handleChange} fileList={fileList} customRequest={handleUpload} name="files" >

                {fileList.length < maxFiles ? uploadButton : null}

            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )
            }
        </>
    )
}

export default PortfolioImageUploader;
