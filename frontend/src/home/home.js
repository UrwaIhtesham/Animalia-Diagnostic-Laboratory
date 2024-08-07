import React from 'react';
import { useMediaQuery  } from "react-responsive";
import { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from '../chatbot/config';
import ActionProvider from '../chatbot/ActionProvider';
import MessageParser from '../chatbot/MessageParser';
import Modal from 'react-modal';
import { useLocation,useNavigate } from 'react-router-dom';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faSmile, faTooth, faPhone,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons';
function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  console.log("Email in Home", email);
  const [category, setCategory] = useState('All');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMobile = useMediaQuery({query: '(max-width:425px'});
  const isTablet = useMediaQuery({query: '(max-width: 768px'});

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);

  const toggleMenu =() => setIsMenuOpen(!isMenuOpen);
    const images = {
        Pet: [
            `${process.env.PUBLIC_URL}/assets/pics/cat-dog.jpeg`,
            `${process.env.PUBLIC_URL}/assets/pics/budgie.PNG`
        ],
        Poultry: [
            `${process.env.PUBLIC_URL}/assets/pics/chicken (1).png`
        ],
        Livestock: [
            `${process.env.PUBLIC_URL}/assets/pics/cow.jpeg`,
            `${process.env.PUBLIC_URL}/assets/pics/sheep.PNG`,
            `${process.env.PUBLIC_URL}/assets/pics/goat.PNG`,
            `${process.env.PUBLIC_URL}/assets/pics/buffalo.PNG`
        ],
  
    };

    const getFilteredImages = () => {
        if (category === 'All') {
            return Object.values(images).flat();
        }
        return images[category] || [];
    };
    const handleResultLink = (e) => {
        e.preventDefault();
        navigate('/results', {state: { email}});
    }
    const handleLabTestLink = (e) => {
        e.preventDefault();
        navigate('/labtest', {state: { email}});
    }
    const handleAppointmentLink = (e) => {
        e.preventDefault();  // Prevent the Link default navigation
        navigate('/appointment', { state: { email } });
      };
    return (
      <div>
        <div className={`container ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
            <header className="nav-bg">
                <h1>Animalia Diagnostic Centre</h1>
                <nav className='navbar'>
                    <div className={`toggle-button ${isMenuOpen?'active':''}`} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                    </div>
                    <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about" onClick={handleResultLink}>Results</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        <li><a href="#chatbot" onClick={openChatbot}>Chatbot</a></li>
                        <li><a href="#services" onClick={handleLabTestLink}>Lab test</a></li>
                        <li><a href="/appointment" onClick={handleAppointmentLink} >Book an Appointment</a></li>
                    </ul>
                </nav>
            </header>
            
            <Modal
        isOpen={isChatbotOpen}
        onRequestClose={closeChatbot}
        contentLabel="Chatbot Modal"
        ariaHideApp={false} 
        className="modal-overlay" 
        overlayClassName="modal-overlay"
        >
        <div className={`chat ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
        <div className="modal-content"> 
            <button className="chat-button" onClick={closeChatbot}>X</button> {/* Close button */}
            <Chatbot
                config={config} // your chatbot configuration
                messageParser={MessageParser} // your message parser component
                actionProvider={ActionProvider} // your action provider component
            />
        </div>
        </div>
      </Modal>
      
        <section className="features" id="features">
        <div className="feature-cards">
          <div className="feature">
            <FontAwesomeIcon icon={faTooth} size="3x" color="maroon" /><br />
            <h2>Newest Technologies</h2>
            <p>We utilize cutting-edge technology and modern diagnostic tools to ensure accurate and efficient care for your pets. 
                Our state-of-the-art equipment helps us provide the best possible treatment.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faUserMd} size="3x" color="maroon" /><br />
            <h2>Experienced Doctors</h2>
            <p>Our team of veterinarians is highly experienced and continuously updates their knowledge to stay current with the latest advancements in animal health. 
                Your pets are in expert hands with our dedicated professionals.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faSmile} size="3x" color="maroon" /><br />
            <h2>High Customer Satisfaction</h2>
            <p>We pride ourselves on delivering exceptional service and care to both pets and their owners. 
                Our commitment to personalized attention and compassionate care has earned us a reputation for high customer satisfaction.</p>
          </div>
        </div>
      </section>
      </div>

    <section className={`about ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`} id="about">
      <div className="sec">
        <div className="left">
            <img src={`${process.env.PUBLIC_URL}/assets/pics/kitten.jpeg`} alt="Cat" />
        </div>
        <div className="right">
            <div className="header">
                <h1 id="heading-1">Why choose Health Care with</h1>
                <h1 id="heading-2">Animalia Diagnostic Centre</h1>
            </div>
            <div className='hehe'>
                <h3 className='about-h3'>Our Commitment to Excellence</h3>
                <p className='about-p'>At Animalia Diagnostic Centre, we are dedicated to providing top-notch care using the latest medical advancements and a compassionate approach. 
                    Stay tuned for more details about our exceptional services and the benefits we offer to ensure your pet's health and well-being.</p>
            </div>
        </div>
      </div>
    </section>

            
    <section className={`achieve ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`} id="achievements">
        <div className='achievements'>
        <div className="container-2">
            <h1 className='achieve-h1'>Our Achievements in Numbers</h1>
            <p className='achieve-p'>We can talk for a long time about advantages of our Animal clinic before other medical treatment facilities. But you can read<br></br>
               the following facts in order to make sure of all pluses of our clinic:</p>
            <div className="achievement-cards">
                <div className="achievement-card">
                    <h3>12+</h3>
                    <hr className="divider" />
                    <p>Years of Experience</p>
                </div>
                <div className="achievement-card">
                    <h3>212+</h3>
                    <hr className="divider" />
                    <p>Happy Patients</p>
                </div>
                <div className="achievement-card">
                    <h3>52+</h3>
                    <hr className="divider" />
                    <p>Qualified Staff</p>
                </div>
                <div className="achievement-card">
                    <h3>18+</h3>
                    <hr className="divider" />
                    <p>Master Certifications</p>
                </div>
            </div>
        </div>
        </div>
    </section>
       
    <section className={`gal ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`} id="gallery">
        <div className='gallery'>
        <h2 id="gallery-heading">Our Gallery</h2>
        <div className="gallery-buttons">
            <button className="galleryimg" onClick={() => setCategory('All')}>All</button>
            <button className="galleryimg" onClick={() => setCategory('Pet')}>Pet</button>
            <button className="galleryimg" onClick={() => setCategory('Poultry')}>Poultry</button>
            <button className="galleryimg" onClick={() => setCategory('Livestock')}>Livestock</button>
                      
        </div>
        <div className="gallery-images">
            {getFilteredImages().map((src, index) => (
                <img key={index} src={src} alt={`Gallery ${index}`} />
            ))}
        </div>
        </div>
    </section>
    <div className={`cont ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
         <div className='color-div'>
            
             <section className="contact" id="contact">
                    <div className="contact-container">
                        <div className="contact-map">
                            <iframe
                                title='Map'
                                className='map-frame'
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345095075!2d144.95565131531677!3d-37.817327979751924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d8f31e6371d7!2sVictoria%20Harbour!5e0!3m2!1sen!2sau!4v1625791123451!5m2!1sen!2sau"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div className="contact-form">
                            <h2>Contact Form</h2>
                            <form className='form-control'>
                                <label>
                                    Name:
                                    <input type="text" name="name"/>
                                </label>
                                <label>
                                    Email Address:
                                    <input type="email" name="email"/>
                                </label>
                                <label>
                                    Mobile Number:
                                    <input type="tel" name="mobile"/>
                                </label>
                                <label>
                                 Message:
                                    <textarea name="message" placeholder="Enter Your Message"></textarea>
                                </label>
                                <button type="submit" className='submit-button'>Send Message</button>
                            </form>
                        </div>
                    </div>
                </section>
                </div>
                </div>
            <div className={`cont ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}> 
                <footer className="footer">
      <div className="centered-text">
        <p>&copy; 2024 Animalia Diagnostic Centre. All rights reserved.</p>
      </div>
      <div className='right-text'>
        <p><FontAwesomeIcon icon={faPhone} size="1x" color="white" /> 042 333333333</p>
        <p><FontAwesomeIcon icon={faEnvelope} size="1x" color="white" /> info@animalia.com</p>
      </div>
    </footer>
    </div>
        </div>
    );
}

export default Home;

