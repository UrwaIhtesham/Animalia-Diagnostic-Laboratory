import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './results.css';

function Results() {
  const sampleFileProps = [
    {
      id: ":0:",
      size: 28 * 1024 * 1024, // 28 MB
      type: "application/pdf",
      name: "Bovine Viral Diarrhea (BVD) Result",
      url: process.env.PUBLIC_URL + '/assets/result.pdf',
    },
    {
      id: ":1:",
      size: 35 * 1024 * 1024, // 35 MB
      type: "application/pdf",
      name: "Foot and Mouth Disease (FMD) Result",
      url: process.env.PUBLIC_URL + '/assets/result.pdf',
    },
  ];

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = url.split('/').pop(); // Extract file name from URL
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleOpenPdf = (url) => {
    window.open(url, '_blank');
  };

 

  return (
    <div className="background">
      <div className='header'><h1>TESTS RESULTS</h1>
      <div className='vertical-line'></div>
      <p>Conducted with precision and vigilance, ensuring accurate and reliable <br />results every time</p></div>
      <div className='sectionss'>
        <div className="file-container">
          {sampleFileProps.map(file => (
            <div key={file.id} className="file-card">
              <img src={process.env.PUBLIC_URL + '/assets/pics/logoforADC.png'} alt="PDF Thumbnail" className="thumbnail" />
              <div className="file-info">
                <p className="file-name" onClick={() => handleOpenPdf(file.url)}>{file.name}</p>
                <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p>{file.type}</p>
              </div>
              <button className="download-button" onClick={() => handleDownload(file.url)}>
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Results;
