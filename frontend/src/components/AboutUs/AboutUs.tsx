import React, { useEffect, useState } from 'react';
import "./Pagestyle.css";

const AboutUs = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="page-container">

      {/* Top section with background image */}
      <div className="top-section">
        <div className="background"></div>
          <div className="top-content">
            <h2 className="title">THE FORGE</h2>
            <p className="description">
              The Forge provides a collaborative environment for students at Rensselaer to explore rapid prototyping and design. We promote communication and sharing of expertise between our members and volunteers. We also provide our members with access to a wide range of equipment - including but not limited to 3D printers, a laser cutter, and an electronics workstation. Additionally, we host workshops, design competitions, and outreach events every semester.
            </p>
            <div className="location">
              <span>Drop in and check us out: We're located in</span>
              <strong>CII 2037A</strong>
            </div>
          </div>
      </div>

      {/* White background content */}
      <div className="white-section">
        <div className="content-container">
          
          <h2>What We Offer</h2>
          <div className="services-grid">

            <div className="service-card">
              <h3>Equipment Access</h3>
              <p>Access to 3D printers, laser cutters, electronics workstations, and more.</p>
            </div>

            <div className="service-card">
              <h3>Workshops</h3>
              <p>Regular workshops on design, prototyping, and various maker skills.</p>
            </div>

            <div className="service-card">
              <h3>Community</h3>
              <p>Join a community of like-minded creators and innovators.</p>
            </div>

          </div>
          
          {/* Hours of Operation Section */}
          <h2>Hours of Operation</h2>
          <div className="hours-section">
            <p>Monday - Friday: 10:00 AM - 4:00 PM</p>
            <p>Saturday - Sunday: Closed</p>
          </div>

          {/* Training Slides Section */}
          <h2>Training Slides</h2>
          <div className="training-slides">
            <iframe src="https://docs.google.com/presentation/d/1CmwkK1Evvp_0BWViicU-pT_XDuFGact-4_kRH7R0WnE/embed?" frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          </div>

          <div className="training-slides">
            <iframe src="https://docs.google.com/presentation/d/1kb65644XnRrhrCGokEjaftZFlsJD40XSzA9jwwkEsno/embed?" frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          </div>

          <div className="training-slides">
            <iframe src="https://docs.google.com/presentation/d/13bkWqiG3Y7H6se2dV5ionpyZpqBgSz8bTrstZuc839Q/embed?" frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          </div>

          <div className="training-slides">
            <iframe src="https://docs.google.com/presentation/d/14hzSkw8vXyfpSizP4JA-aKf8_6uOOjVam2YJX1eX1fk/embed?" frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          </div>

          {/* Instagram Embed Section */}
          <h2>Instagram Posts</h2>
          <div className="instagram-section">
            <iframe src="https://www.juicer.io/api/feeds/the_forge_rpi/iframe" frameBorder="0" width="100%" height="1200"></iframe>
          </div>

          </div>
        </div>
      </div>
  );
};

export default AboutUs;