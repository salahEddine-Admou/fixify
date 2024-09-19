import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Image } from 'antd';
import UplaodApi from '../../api/UploadApi';
const MultiImageUploader = ({ form, name, maxFiles  }) => {
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
            const response = await UplaodApi.uploadCinImage(formData, config)
            const imgUrl = response.data.imageUrl


            const currentImageUrls = form.getFieldValue(name);

            if (Array.isArray(currentImageUrls)) {
                // Push the new image URL to the array
                const updatedImageUrls = [...currentImageUrls, imgUrl];

                // Set the updated array back to the imageIdentity field
                form.setFieldsValue({ [name]: updatedImageUrls });
            } else {
                // If the current value is not an array, initialize a new array with the imgUrl and set it to the field
                form.setFieldsValue({ [name]: [imgUrl] });
            }
            onSuccess(file);
            // setFileList([...fileList], newCinImage)
            // You can further process the response, such as updating state or form fields
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

export default MultiImageUploader