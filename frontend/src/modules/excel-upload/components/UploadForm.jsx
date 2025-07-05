import React, { useState } from 'react';
import { uploadExcelFile } from '../api';
import DefaultButton from '../../../ui/DefaultButton';
import UploadFileInput from '../.././../ui/UploadFileInput';
import './UploadForm.css'; 

export const UploadForm = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file) setSelectedFile(file);
        console.log(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            console.warn('Файл не выбран.');
            return;
        }

        setUploading(true);

        try {
            const responseData = await uploadExcelFile(selectedFile);
            onUploadSuccess && onUploadSuccess(responseData);
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        } finally {
            setUploading(false); 
            if (document.getElementById('excelFileInput')) {
                document.getElementById('excelFileInput').value = '';
            }
            setSelectedFile(null);
        }
    };

    return (
        <div className="upload-form-container">
            <form onSubmit={handleSubmit}>
                <UploadFileInput id={'excelFileInput'} 
                    text={'загрузить'} 
                    onChange={handleFileChange} 
                    />
                {selectedFile && <p>Выбран: {selectedFile.name}</p>}
                <DefaultButton text={'рассчитать'} 
                                isDisabled={!selectedFile || uploading}
                                onClick={handleSubmit}>
                    {uploading ? 'Загрузка...' : 'Загрузить файл'}
                </DefaultButton>
            </form>
        </div>
    );
};
