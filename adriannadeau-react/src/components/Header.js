import React from 'react';
import logo from '../assets/img/Unleashinginnovation-logo.png';

function Header() {
  return (
    <header className="header sticky-top">
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:support@ansoftwareservices.com">support@ansoftwareservices.com</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span> +1(506)703-5614</span>
            </i>
          </div>
          <div className="social-links d-none d-md-flex align-items-center">
            <a href="https://www.x.com/anadeau" className="twitter" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="https://www.facebook.com/ansoftwareservices/" className="facebook" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/adriannadeau" className="instagram" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/company/101774044/" className="linkedin" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="branding d-flex">
        <div className="container position-relative d-flex justify-content-between">
          <nav className="navbar">
            <div className="logo">
              <a href="/">
                <img
                  src={logo}
                  className="img-fluid"
                  alt="A.N. Software Services Logo"
                  style={{ height: "50px", width: "auto" }}
                />
              </a>
            </div>
          </nav>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="#" className="active">Home</a></li>
              <li><a href="#about">About</a></li>
              <li className="dropdown">
                <a href="#">
                  <span>Products</span> <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="https://smbbusiness.pro/" target="_blank" rel="noopener noreferrer">SMB Business Pro</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="https://itthoughtsadrian.wordpress.com/" target="_blank" rel="noopener noreferrer">Blog</a>
              </li>
              <li>
                <a href="#contact">Where?</a>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
          <a
            className="cta-btn d-none d-sm-block"
            href="https://bookmenow.info/book/MCAL-d18533fd-bfb1-4dba-8d2d-284780624f0a/free-consulation"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginBottom: "25px" }}
          >
            Free Consultation
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;