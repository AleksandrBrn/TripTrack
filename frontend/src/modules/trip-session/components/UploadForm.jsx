import DefaultButton from '@/ui/DefaultButton';
import UploadFileInput from '@/ui/UploadFileInput';
import './UploadForm.css';

export const UploadForm = ({ onUpload, onChange, isDisabled, isLoading }) => {
  return (
    <div className="upload-form-container" style={{margin: '0 auto', textAlign: 'center'
    }}>
      <UploadFileInput text={'загрузить'} onChange={onChange} />
      <DefaultButton 
        text={'рассчитать'} 
        onClick={onUpload} 
        isDisabled={isDisabled}
        isLoading={isLoading}
      >
      </DefaultButton>
    </div>
  ); 
}; 
