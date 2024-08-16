import React from 'react';
const Navbar= () => {
    return (
        <header>
            <div id="nav-head" className="header-nav">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-md-3 no-padding col-sm-12 nav-img">
                            <button className="btn btn-info">Animalia Diagnostic Centre</button>
                            <a data-toggle="collapse" data-target="#menu" href="#menu">
                                <i className="fas d-block d-md-none small-menu fa-bars"></i>
                            </a>
                        </div>
                        <div id="menu" className="col-lg-8 col-md-9 d-none d-md-block nav-item">
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#services">Services</a></li>
                                <li><a href="#gallery">Gallery</a></li>
                                <li><a href="#contact">Contact Us</a></li>
                                <li><a href="#chatbot">Chatbot</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-2 d-none d-lg-block appoint">
                            <button className="btn btn-info">Book an Appointment</button>
                        </div>
                    </div>
                </div>
            </div>
            <script src="%PUBLIC_URL%/assets/js/jquery-3.2.1.min.js"></script>
            <script src="%PUBLIC_URL%/assets/js/popper.min.js"></script>
            <script src="%PUBLIC_URL%/assets/js/bootstrap.min.js"></script>
            <script src="%PUBLIC_URL%/assets/js/script.js"></script>
        </header>
    );
};

export default Navbar;
