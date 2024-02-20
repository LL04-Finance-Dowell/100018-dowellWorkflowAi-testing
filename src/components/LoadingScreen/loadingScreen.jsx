import React from "react";
import "./loadingScreen.css"

const LoadingScreen = () => {
    return (
        <div style={{ marginTop: '15px' }}>
          <div className="loading-screen">
            <div className="loader"></div>
            <div className="content-placeholder"></div>
          </div>
        </div>
    );
};

export default LoadingScreen;
