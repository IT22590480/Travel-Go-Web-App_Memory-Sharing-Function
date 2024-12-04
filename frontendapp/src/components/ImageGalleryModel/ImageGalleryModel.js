import React from 'react';
import '../../styles/imageGalleryModel.css'

const ImageGalleryModal = ({ images, onClose }) => {
  return (
    <div className="modalStyle">
      <div className='modalContentStyle'>
       
        <div className="image-grid">
          {images.map((imageUrl, index) => (
            <img className='image' key={index} src={imageUrl} alt={`Image ${index}`} 
            style={{ margintop:'20px', height: '270px', width: '455px', margin: '10px' }}/>
          ))}
        </div>
        <span className="closeButtonStyle" onClick={onClose}>&times;</span>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
