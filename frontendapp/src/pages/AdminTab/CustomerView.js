import React, { useEffect, useState } from 'react'
import '../../styles/customerView.css'
import searchIcon from '../../assets/search6.png'
import bkk1 from '../../styles/bk_images/bk2.jpg'

import axios from 'axios'
import ImageGalleryModal from '../../components/ImageGalleryModel/ImageGalleryModel'
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerView() {

  const [allImages, setAllImages] = useState([])
  const [displayImages, setDisplayImages] = useState([])
  const [searchLocation, setSearchLocation] = useState('')

 
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImages, setModalImages] = useState([])


  useEffect(() => {
    
    getImage()

  }, [])

  const openModal = async (imageList, imageId) => {
    // Increment view count for each image
    try {
      await axios.patch(`http://localhost:5000/api/image/increment-view/${imageId}`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }

    // Open modal
    setModalOpen(true);
    setModalImages(imageList);
  };

  const closeModal = () => {
    setModalOpen(false)
    setModalImages([])
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

 



  const getImage = async () => {
    try {
      const result = await axios.get('http://localhost:5000/api/image/')
      setAllImages(result.data.data)
      setDisplayImages(result.data.data)

      console.log(allImages)
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  


  const handleSearch = () => {
    if (searchLocation && searchLocation.trim() !== "") {
      const filteredImages = allImages.filter((image) =>
        image.location.toLowerCase().includes(searchLocation.toLowerCase()) || image.location.toLowerCase().indexOf(searchLocation.toLowerCase()) !== -1
      )
      setDisplayImages(filteredImages)
    } else {
      setDisplayImages(allImages)
    }
  }



  const handleSearchInputChange = (e) => {
    setSearchLocation(e.target.value)
  }


  return (
    
    <div className='adminTab'>

<div className='top_area' id='top_area' >
                <h1
      className='adminTabTitle'
      id='tabTitle'
      onClick={() => window.location.reload()}
      style={{ 
        cursor: 'pointer', textAlign: 'center' ,color: 'white' ,  fontFamily: 'Anton' , fontSize: '6em'}}
    > <br></br>
      Photography & Memory Sharing
      <br></br>
    </h1><br></br>


          <div className='memoryAdder'>
            <div className='search-bar'>
              <input type='text' placeholder='Search Memory...' value={searchLocation} onChange={handleSearchInputChange} onKeyDown={handleKeyDown}  />
            </div>
            <div className='btnSection4'>
              <img src={searchIcon} onClick={handleSearch} alt='search button' title='Search' />
            </div>
          </div>

  </div>

  <div className='secondArea'>
  <div className='imageGrid' style={{ display: 'flex' }}>
    <div className='box01' style={{ display: 'flex', width: '100%' }}>
      <div style={{ flex: '1',paddingLeft: '60px',paddingTop: '20px' }}>
        {/* Left side: Picture */}
        <b><p style={{ fontFamily: 'Anton' , fontSize: '3em' }} >Experience the real Sri Lanka</p></b>
        <br></br>
        <p style={{ fontFamily: 'Anton' , fontSize: '1.5em',marginRight:'20px' }} >
              Embark on an adventure through Sri Lanka's stunning vistas and rich culture! 
              Immerse yourself in breathtaking photos and captivating tales of exploration. 
              Photography & Memory Sharing brings the beauty of Sri Lanka to your screen, inviting you to discover, dream, and journey with us.</p>
      </div>
      <div style={{ flex: '1', padding: '0px' }}>
        {/* Right side: Text */}
        <img src={bkk1} alt="Your Image" style={{ maxWidth: '100%', height: 'auto' , borderRadius:2}} />
        
      </div>
    </div>
  </div>
</div>

    
      <div className='imageGrid'>
        {displayImages == null
          ? ''
          : displayImages.map((data, index) => (
            <div key={index} className='memoryCard' >
              <div className="card" id='card'>
                <div className="card-body" id='card-body'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className='imageContainer'>
                    {data.image && data.image.length > 0 && (
                      <>
                        {data.image.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image || 'http://localhost:5000/static/images/defaultImage.png'}
                            alt={`Memory ${index + 1}`}
                            className="card-img-top"
                            style={{ height: '270px', width: '400px', margin: '10px' }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div style={{ overflowY: 'auto' }}>
                {data.image && data.image.length > 4 && (
                  <p style={{ cursor: 'pointer', textDecoration: 'underline', textAlign: 'center' }} onClick={() => openModal(data.image,data._id)}>{`+${data.image.length - 3} more images`}</p>
                )}
                </div>


                  <div class="card-text">
                    <b> <span className='label'>Location: </span></b>
                    <span className='location'>{data.location}</span><br /> 
                    <b><span className='label'>Date: </span></b>
                    <span className='date'>{data.date}</span><br />
                    <b><span className='label'>Description: </span></b>
                    <span className='description' id='memdescription' style={{ textAlign: 'justify' }}>{data.description}</span>

                  </div>

                </div>

              </div>

              {modalOpen && (
                <ImageGalleryModal images={modalImages} onClose={closeModal} />
              )}
            </div>
          ))}
      </div>
    </div >
  )
}
