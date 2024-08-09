import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './results.css';
import JSZip from 'jszip';

function Results() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const email = location.state?.email || localStorage.getItem('userEmail'); // Use localStorage fallback

    useEffect(() => {
        const fetchFiles = async () => {
            if (!email) {
                console.error('No email found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post("http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/Results", {
                    email
                }, { responseType: 'arraybuffer' });

                // Create a JSZip instance and load the ArrayBuffer
                const zip = new JSZip();
                const zipContent = await zip.loadAsync(response.data);
                
                // Prepare an array of file objects
                const fileArray = await Promise.all(
                    Object.keys(zipContent.files).map(async (relativePath) => {
                        const zipEntry = zipContent.files[relativePath];
                        const blob = await zipEntry.async('blob');
                        const fileURL = URL.createObjectURL(blob);
                        
                        // Set MIME type based on whether the file is a PDF
                        const fileType = 'application/pdf';
                
                        return {
                            name: zipEntry.name,
                            url: fileURL,
                            size: blob.size,
                            type: fileType
                        };
                    })
                );

                setFiles(fileArray);
                console.log(fileArray);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching files:', error);
                setLoading(false);
            }
        };

        fetchFiles();
    }, [email]); // Include email in dependency array

    const handleDownload = (file) => {
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = file.url;
    
        // Append the .pdf extension if the file type is 'application/pdf'
        const fileNameWithExtension = file.type === 'application/pdf' && !file.name.endsWith('.pdf')
            ? `${file.name}.pdf`
            : file.name;
    
        link.download = fileNameWithExtension; // Ensure the file name and extension are set correctly
        document.body.appendChild(link); // Append the link to the document
        link.click(); // Trigger the download
        document.body.removeChild(link); // Remove the link from the document
    };

    return (
        <div className="background">
            <div className='header-hehe'>
                <h1>TESTS RESULTS</h1>
                <div className='vertical-line'></div>
                <p>Conducted with precision and vigilance, ensuring accurate and reliable <br />results every time</p>
            </div>
            <div className='sectionss'>
                <div className="file-container">
                    {loading ? (
                        <p>Loading files...</p>
                    ) : files.length > 0 ? (
                        files.map(file => (
                            <div key={file.name} className="file-card">
                                <img src={process.env.PUBLIC_URL + '/assets/pics/logoforADC.PNG'} alt="File Thumbnail" className="thumbnail" />
                                <div className="file-info">
                                    <p className="file-name">{file.name}</p>
                                    <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    <p>{file.type}</p>
                                </div>
                                <button className="download-button" onClick={() => handleDownload(file)}>
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No files available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Results;
