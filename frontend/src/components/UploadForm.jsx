import React from 'react';
import './uploadForm.css'; 

const UploadForm = () => {
  // Cargar imagenes al server
  const handleUpload = async (e) => {
    const files = e.target.files; 
    if (!files.length) return;  

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]); 

         // Fetchear el archivo al backend
        await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData 
        });
      }
      window.location.reload();  
    } catch (error) {
      console.error('Skill issue lmaoooo:', error);  
    }
  };

  return (
    <div className="upload-container">
      <label className="upload-button">
        <span className="button-icon">🐠</span>
        <span className="button-text">Agregar peces</span>
        <input 
          type="file" 
          onChange={handleUpload} 
          multiple 
          accept="image/*"  
          className="hidden-input"  
        />
      </label>
    </div>
  );
};

export default UploadForm;
