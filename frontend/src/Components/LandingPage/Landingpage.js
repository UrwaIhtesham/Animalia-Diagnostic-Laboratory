import React from "react";
import './LandingPage.css';

function LandingPage({ onSignIn, onSignUp }) {
    return (
        <div className="main">
            <div className="upper-half">
            <div className="background-image">
                    <img src="/images/pets.jpg" alt="Animalia" className="bg-img" />
                </div>
                
            </div>
            <div className="lower-half">
                <div className="title">
                    <h1>Animalia Diagnostic Centre</h1>
                </div>
                <p>New to our website? Join Now.</p>
                <br/>
                <div className="buttons">
                    <button onClick={onSignIn}>Sign in</button>
                    <button onClick={onSignUp}>Sign up</button>
                </div>
            </div>
        </div>
    )
};

export default LandingPage;