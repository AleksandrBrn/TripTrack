import DefaultButton from '@/ui/DefaultButton';
import UploadFileInput from '@/ui/UploadFileInput';
import './UploadForm.css';

export const UploadForm = ({ onUpload, onChange, isLoading }) => {
  return (
    <div className="upload-form-container">
      <UploadFileInput text={'загрузить'} onChange={onChange} />
      <DefaultButton text={'рассчитать'} onClick={onUpload} isDisabled={isLoading}></DefaultButton>
    </div>
  ); 
}; 
