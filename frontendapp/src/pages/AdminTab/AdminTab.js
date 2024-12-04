import React, { useEffect, useState } from 'react'
import '../../styles/adminTab.css'
import addNew from '../../assets/add4.png'
import searchIcon from '../../assets/search6.png'
import discardBtn from '../../assets/x-button.png'
import reportBtn from '../../assets/report_btn.png'
import axios from 'axios'
import ImageGalleryModal from '../../components/ImageGalleryModel/ImageGalleryModel'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function AdminTab() {
  const [showBox, setShowBox] = useState(false)
  const [locationColor, setLocationColor] = useState(getRandomColor())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [displayLocation, setDisplayLocation] = useState(false)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [allImages, setAllImages] = useState([])
  const [displayImages, setDisplayImages] = useState([])
  const [searchLocation, setSearchLocation] = useState('')
  const [editingMemoryId, setEditingMemoryId] = useState(null)

  const [imageArray, setImageArray] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImages, setModalImages] = useState([])

  const navigate = useNavigate();

  const handleClickReport = () => {
    navigate('/memory_report_page');
  };


  useEffect(() => {
    
    getImage()

  }, [])

  const openModal = (imageList) => {
    setModalOpen(true)
    setModalImages(imageList)

  }



  const closeModal = () => {
    setModalOpen(false)
    setModalImages([])
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const submitImage = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    imageArray.forEach((file) => {
      formData.append('image', file)
    })

    formData.append('description', description) // Append the description
    formData.append('location', location) // Append the location
    formData.append('date', date) // Append the date

    try {
      await axios.post('http://localhost:5000/api/image/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setImageArray([])
      setDescription('')
      setLocation('')
      setDate('')
      setShowBox(false)
      getImage() // Refresh images after successful upload
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Display the error message to the user
        console.error('Error uploading image:', error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        console.error('Error uploading image:', error);
        toast.error(error);
      }
    }
  }

  const onInputChange = (e) => {
    setImageArray([...imageArray, ...e.target.files])
  }


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

  
  const toggleBox = () => {
    setShowBox(!showBox)
    setEditingMemoryId(null) // Clear editing memory id when toggling box
  }

  const closeBox = () => {
    setShowBox(false)
    setEditingMemoryId(null) // Clear editing memory id when closing box
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Check if all input fields are not empty
    if (!description || !location || !date || !imageArray.length) {
      toast.error('Please fill out all input fields.'); // Display toast error message
      return;
    }
  
    // If all input fields are filled out, proceed with form submission
    submitImage(e);
  };

  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/image/${imageId}`)
      getImage() // Refresh images after successful deletion
    } catch (error) {
      console.error('Error deleting image:', error)
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

  const startEditMemory = (memoryId) => {
    const memoryToEdit = allImages.find((image) => image._id === memoryId)
    setDescription(memoryToEdit.description)
    setLocation(memoryToEdit.location)
    setDate(memoryToEdit.date)
    setEditingMemoryId(memoryId)
    setShowBox(true)
  }

  const handleUpdateMemory = (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Check if all input fields are not empty
    if (!description || !location || !date || !imageArray.length) {
      // Display toast error message
    toast.error('Please fill out all input fields.');
      return;
    }
  
    // If all input fields are filled out, proceed with update action
    updateMemory(e);
  };
  

  const updateMemory = async (e) => {

    e.preventDefault()

    const formData = new FormData()

    imageArray.forEach((file) => {
      formData.append('image', file)
    })

    formData.append('description', description) // Append the description
    formData.append('location', location) // Append the location
    formData.append('date', date) // Append the date

    try {
      await axios.patch(`http://localhost:5000/api/image/${editingMemoryId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })


      setImageArray([])
      setDescription('')
      setLocation('')
      setDate('')
      setEditingMemoryId(null)
      getImage() // Refresh images after successful update
      setShowBox(false) // Close the box after update
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Display the error message to the user
        console.error('Error uploading image:', error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        console.error('Errorrr uploading image:', error);
        toast.error(error);
      }
    }
  }

  function getRandomColor() {
    
    let color = '#0b51e9'
    
    return color
  }

  const options = {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }

  const formattedDate = currentDate.toLocaleDateString('en-US', options)

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format


  return (
    <div className='adminTab'>

      <div className='topsection'>
        <br></br>
        <br></br>
        <br></br>
      <h1
  className='adminTabTitle'
  id='tabTitle'
  onClick={() => window.location.reload()}
  style={{ cursor: 'pointer', textAlign: 'center',  textAlign: 'center' ,color: 'white' ,  fontFamily: 'Anton' }} >   
  Photography & Memory Sharing
</h1>
<h1 style={{ 
       textAlign: 'center' ,color: 'white' ,  fontFamily: 'Anton' }}>Admin Dashboard</h1>

<br></br>

      <div className='memoryAdder'>
        <div className='btnSection4'>

        <img src={reportBtn} alt='generate-report' title='generate report' onClick={handleClickReport} style={{ paddingRight: '10px' }} />
        <img src={addNew} alt='addNewMemory' title='Add Memory' onClick={toggleBox} style={{ paddingRight: '10px' }} />
          
          
        </div>
        <div className='search-bar'>
          <input type='text' placeholder='Search Memory...' value={searchLocation} onChange={handleSearchInputChange} onKeyDown={handleKeyDown}  />
        </div>
        <div className='btnSection4'>
          <img src={searchIcon} onClick={handleSearch} alt='search button' title='Search' />
        </div>
      </div>
      </div>
      {showBox && (

        
          editingMemoryId?(
        
        <div className='memoryBox'>
          <div className='boxDescription'>
            {displayLocation ? (
              <span className='locationTag' id='locationTag' style={{ color: locationColor }}>
                @{city}, {country}, {formattedDate}
              </span>
            ) : (
              <span className='locationTag' id='locationTag' style={{ color: locationColor }}>
                {formattedDate}
              </span>
            )}
            <textarea
              type='text'
              className='description-textarea' /* Add a class for styling */
              placeholder='Write your description here..'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required  // Make textarea required
            />
            <input
              type='text'
              className='location-input'
              placeholder='Location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required  // Make location input required
            />
            <input
              type='date'
              className='date-input'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required  // Make date input required
              max={today} // Set the max attribute to today's date
            />
          </div>
          <div className='imageUploadSection'>
            <form onSubmit={(e) => submitImage(e)}>
              <input type='file' accept='image/*' multiple onChange={onInputChange} required />

              <button id='updateMemoryBtn' onClick={handleUpdateMemory} > Update Memory</button>
            </form>
          </div>
          <div className='btnSection'>
            <span className='memoryRecord' id='memoryRecord' style={{ color: locationColor }}>
              {allImages.length} Memories Added
            </span>
            
            
            <div className='btnSection3'>
              <img src={discardBtn} alt='discardBtn' title='Discard' onClick={closeBox} />
            </div>
            
          </div>

        </div>


      ) :

      <div className='memoryBox'>
        <div className='boxDescription'>
          {displayLocation ? (
            <span className='locationTag' id='locationTag' style={{ color: locationColor }}>
              @{city}, {country}, {formattedDate}
            </span>
          ) : (
            <span className='locationTag' id='locationTag' style={{ color: locationColor }}>
              {formattedDate}
            </span>
          )}
          <textarea
            type='text'
            className='description-textarea' /* Add a class for styling */
            placeholder='Write your description here..'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type='text'
            className='location-input'
            placeholder='Location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type='date'
            className='date-input'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today} // Set the max attribute to today's date
          />
        </div>
        <div className='imageUploadSection'>
          <form onSubmit={handleSubmit}>
            <input type='file' accept='image/*' multiple onChange={onInputChange} />
            <button type='submit' className='button' id='submitBtn'>Submit</button>
          </form>
        </div>
        <div className='btnSection'>
          <span className='memoryRecord' id='memoryRecord' style={{ color: locationColor }}>
            {allImages.length} Memories Added
          </span>
      
          
          <div className='btnSection3'>
            <img src={discardBtn} alt='discardBtn' title='Discard' onClick={closeBox} />
          </div>
          
        </div>

      </div>
      )
}
    
      <div className='imageGrid'>
        {displayImages == null
          ? ''
          : displayImages.map((data, index) => (
            <div key={index} className='memoryCard' >
              <div className="card" id='card'>
                <div className="card-body" id='card-body'  >
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
{data.image && data.image.length > 4 && (
  <p style={{ cursor: 'pointer', textDecoration: 'underline', textAlign: 'center' }} onClick={() => openModal(data.image)}>{`+${data.image.length - 3} more images`}</p>
)}


                  <div class="card-text">
                    <b> <span className='label'>Location: </span></b>
                    <span className='location'>{data.location}</span><br /> 
                    <b><span className='label'>Date: </span></b>
                    <span className='date'>{data.date}</span><br />
                    <b><span className='label'>Description: </span></b>
                    <span className='description' id='memdescription'>{data.description}</span>
                  </div>
                  <div className='cardActions' >
                    <a href="#" class="btn btn-danger" id='deleteButton' onClick={() => deleteImage(data._id)}>Delete</a>
                    <a href="#" class="btn btn-primary" id='updateButton' onClick={() => startEditMemory(data._id)}>Update</a>
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
