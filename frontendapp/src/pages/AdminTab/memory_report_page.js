import React, { useEffect, useState } from 'react'
import '../../styles/reportPage.css'
import searchIcon from '../../assets/search6.png'
import upBtn from '../../assets/upArrow.png'
import downBtn from '../../assets/downArrow.png'
import downloadBtn from '../../assets/DownloadBtn.png'
import backBtn from '../../assets/BackBtn.png'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function MemoryReportPage() {

  const [allImages, setAllImages] = useState([])
  const [displayImages, setDisplayImages] = useState([])
  const [searchLocation, setSearchLocation] = useState('')


  useEffect(() => {
    
    getImage()

  }, [])

  const navigate = useNavigate();

  const handleClickGoBack = () => {
    navigate('/admin');
  };


  const downloadReport = () => {
    // Calculate average view count per image
    const avgViewCount = calculateAverageViewCountPerImage();

    // Find image with highest view count
    const { highestViewCountImage } = findHighestLowestViewCounts();

    // Find image with lowest view count
    const { lowestViewCountImage } = findHighestLowestViewCounts();

    // Prepare data for all images in ascending order of view count
    const allImagesData = displayImages.map(image => ({
      'Memory ID': image._id,
      'View Count': image.viewCount,
      Photos: image.image.length,
      Date: image.date,
      Location: image.location
    }));

    // Sort allImagesData by 'View Count' in ascending order
  allImagesData.sort((a, b) => a['View Count'] - b['View Count']);

    // Prepare columns for the table
    const columns = [
      { title: 'Memory ID', dataKey: 'Memory ID' },
      { title: 'View Count', dataKey: 'View Count' },
      { title: 'Photos', dataKey: 'Photos' },
      { title: 'Date', dataKey: 'Date' },
      { title: 'Location', dataKey: 'Location' }
    ];

    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add content to the PDF document
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Report on view count of the memories', 10, 10);
    doc.setFontSize(11);
    doc.text(`Average View Count per Memory: ${avgViewCount}`, 10, 20);
    doc.text('Memory with Highest View Count:', 10, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(`Memory ID: ${highestViewCountImage._id}`, 20, 40);
    doc.text(`View Count: ${highestViewCountImage.viewCount}`, 20, 50);
    doc.text(`Photos: ${highestViewCountImage.image.length}`, 20, 60);
    doc.text(`Date: ${highestViewCountImage.date}`, 20, 70);
    doc.text(`Location: ${highestViewCountImage.location}`, 20, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Memory with Lowest View Count:', 10, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`Memory ID: ${lowestViewCountImage._id}`, 20, 100);
    doc.text(`View Count: ${lowestViewCountImage.viewCount}`, 20, 110);
    doc.text(`Photos: ${lowestViewCountImage.image.length}`, 20, 120);
    doc.text(`Date: ${lowestViewCountImage.date}`, 20, 130);
    doc.text(`Location: ${lowestViewCountImage.location}`, 20, 140);

    doc.setFont('helvetica', 'bold');
    doc.text('List of All Memories (Ascending Order by View Count):', 10, 150);
    doc.setFont('helvetica', 'normal');
    doc.autoTable(columns, allImagesData, { startY: 160 });

    // Save the PDF document
    doc.save('report.pdf');
  };


  const calculateAverageViewCountPerImage = () => {
    if (allImages.length === 0) {
      return 0; // Return 0 if there are no images
    }
  
    const totalViewCount = allImages.reduce((acc, image) => acc + image.viewCount, 0);
    const avgViewCount = totalViewCount / allImages.length;
    
    return avgViewCount.toFixed(2); // Limit to 2 decimal places

  };
  

  const findHighestLowestViewCounts = () => {
    if (displayImages.length === 0) {
      return { highestViewCountImage: null, lowestViewCountImage: null };
    }
  
    let highestViewCountImage = displayImages[0];
    let lowestViewCountImage = displayImages[0];
  
    for (let i = 1; i < displayImages.length; i++) {
      const image = displayImages[i];
      if (image.viewCount > highestViewCountImage.viewCount) {
        highestViewCountImage = image;
      }
      if (image.viewCount < lowestViewCountImage.viewCount) {
        lowestViewCountImage = image;
      }
    }
  
    return { highestViewCountImage, lowestViewCountImage };
  };

  const { highestViewCountImage, lowestViewCountImage } = findHighestLowestViewCounts();

  


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

  const sortImagesAscending = () => {
    const sortedImages = [...displayImages].sort((a, b) => a.viewCount - b.viewCount);
    setDisplayImages(sortedImages);
  };

  const sortImagesDescending = () => {
    const sortedImages = [...displayImages].sort((a, b) => b.viewCount - a.viewCount);
    setDisplayImages(sortedImages);
  };

  


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

<div>

  <div className='topsection'>
                <h1
      className='adminTabTitle'
      id='tabTitle'
      onClick={() => window.location.reload()}
      style={{ 
        textAlign: 'center' ,color: 'white' ,  fontFamily: 'Anton' }}
    > <br></br>
      Photography & Memory Sharing
      <br></br>
    </h1><br></br><h1 style={{ 
       textAlign: 'center' ,color: 'white' ,  fontFamily: 'Anton' }}>Report Generation</h1>
       <br></br>


          <div className='memoryAdder'>
              <div className='btnSection4'>

              <img src={backBtn} alt='back' title='Go back to Admin Tab' onClick={handleClickGoBack} style={{ paddingRight: '1px' }} />
              <img src={upBtn} alt='up' title='Descending Order' onClick={sortImagesDescending} style={{ paddingRight: '1px' }} />
              <img src={downBtn} alt='down' title='Ascending Order'onClick={sortImagesAscending} style={{ paddingRight: '5px' }} />
                
                
              </div>
            <div className='search-bar'>
              <input type='text' placeholder='Search Memory...' value={searchLocation} onChange={handleSearchInputChange} onKeyDown={handleKeyDown}  />
            </div>
            <div className='btnSection4'>
              <img src={searchIcon} style={{ paddingRight: '10px' }} onClick={handleSearch} alt='search button' title='Search' />
              <img src={downloadBtn} onClick={downloadReport} alt='search button' title='Download Report' />
            </div>
          </div>

          </div>

          <div class='hl_cards'>

          <div  className='memoryCardR' >
              <div className="cardR" id='cardR'>
                <div className="card-bodyR" id='card-bodyR'>
                <div style={{ justifyContent: 'center' }}>
                </div>
                <div class="card-text" style={{ justifyContent: 'center' }}>
                  <br></br>
                <b><h2>Average View Count</h2></b>
                <b><h2>   Per Memory</h2></b>
                <p style={{ textAlign: 'center', fontSize: '50px' }}>{calculateAverageViewCountPerImage()}</p>
                   </div>
                </div>
              </div>
            </div>

 {highestViewCountImage && ( 
          <div  className='memoryCardR' >
              <div className="cardR" id='cardR'>
                <div className="card-bodyR" id='card-bodyR'>
                <div class="card-text">
                <br></br>
                <h2>Highest View Count</h2>
                  <b> <span className='label'>Memory ID: </span></b>
                    <span className='location'>{highestViewCountImage._id}</span><br /> 
                    <b> <span className='label'>View Count: </span></b>
                    <span className='location'>{highestViewCountImage.viewCount}</span><br /> 
                    <b> <span className='label'>Photos: </span></b>
                    <span className='location'>{highestViewCountImage.image.length}</span><br /> 
                    <b><span className='label'>Date: </span></b>
                    <span className='date'>{highestViewCountImage.date}</span><br />
                    <b> <span className='label'>Location: </span></b>
                    <span className='location'>{highestViewCountImage.location}</span><br /> 
                  </div>
                </div>
              </div>
            </div>

            )}

{lowestViewCountImage && (

            <div  className='memoryCardR' >
              <div className="cardR" id='cardR'>
                <div className="card-bodyR" id='card-bodyR'>
                <div style={{ justifyContent: 'center' }}>
                </div>
                <div class="card-text" style={{ justifyContent: 'center' }}>
                <br></br>
                <h2>Lowest View Count</h2>
                  <b> <span className='label'>Memory ID: </span></b>
                    <span className='location'>{lowestViewCountImage._id}</span><br /> 
                    <b> <span className='label'>View Count: </span></b>
                    <span className='location'>{lowestViewCountImage.viewCount}</span><br /> 
                    <b> <span className='label'>Photos: </span></b>
                    <span className='location'>{lowestViewCountImage.image.length}</span><br /> 
                    <b><span className='label'>Date: </span></b>
                    <span className='date'>{lowestViewCountImage.date}</span><br />
                    <b> <span className='label'>Location: </span></b>
                    <span className='location'>{lowestViewCountImage.location}</span><br /> 
                   </div>
                </div>
              </div>
            </div>

    )}

</div>

  </div>

    
      <div className='imageGrid' style={{ display: 'flex', justifyContent: 'center' }}>
        {displayImages == null
          ? ''
          : displayImages.map((data, index) => (
            <div key={index} className='memoryCard' style={{ display: 'flex', justifyContent: 'center' }} >
              <div className="card" id='card'>
                <div className="card-body" id='card-body'>
                <div class="card-text">
                  <b> <span className='label'>Memory ID: </span></b>
                    <span className='location'>{data._id}</span><br /> 
                    <b> <span className='label'>View Count: </span></b>
                    <span className='location'>{data.viewCount}</span><br /> 
                    <b> <span className='label'>Photos: </span></b>
                    <span className='location'>{data.image.length}</span><br /> 
                    <b><span className='label'>Date: </span></b>
                    <span className='date'>{data.date}</span><br />
                    <b> <span className='label'>Location: </span></b>
                    <span className='location'>{data.location}</span><br /> 

                  </div>

                </div>

              </div>
            </div>
          ))}
      </div>
    </div >
  )
}
