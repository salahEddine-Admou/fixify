import React, { useState } from 'react';
import RepairerApi from '../../api/repairerApi';
import { successToast,errorToast } from '../../utils';
import { Upload,UploadProps } from 'antd';

function ExcelUploadRepairer() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await RepairerApi.uploadExcelFile(formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            successToast(response.data);
        } catch (error) {
            errorToast("Failed to upload file: " + error.message);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default ExcelUploadRepairer;