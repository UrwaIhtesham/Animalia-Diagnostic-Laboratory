import React from "react";
import { useMediaQuery  } from "react-responsive";
import './LandingPage.css';

function LandingPage({ onSignIn, onSignUp }) {

        const isMobile = useMediaQuery({query: '(max-width:425px'});
        const isTablet = useMediaQuery({query: '(max-width: 768px'});
    return(
        <div className={`ma ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
            <div className="main">
            <div className="upper-half">
            <div className="background-image">
            </div>
                
            </div>
            <div className="lower-half">
                <div className="title">
                    <h1>Animalia Diagnostic Centre</h1>
                </div>
                <p>New to our website? Join Now.</p>
                <br/>
                <div className="buttons">
                    <button className="btn-hover" onClick={onSignIn}>Sign in</button>
                    <button className="btn-hover" onClick={onSignUp}>Sign up</button>
                </div>
            </div>
            </div>
        </div>
    )
};

export default LandingPage;