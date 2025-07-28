import logo from './logo.svg';
import './App.css';

import React from "react";
import "./assets/vendor/bootstrap/css/bootstrap.min.css";
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "./assets/vendor/aos/aos.css";
import "./assets/vendor/fontawesome-free/css/all.min.css";
import "./assets/vendor/glightbox/css/glightbox.min.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";
import "./assets/css/main.css";

const App = () => {
  return (
    <>
      <header className="header sticky-top">
        <div className="topbar d-flex align-items-center">
          <div className="container d-flex justify-content-center justify-content-md-between">
            <div className="contact-info d-flex align-items-center">
              <i className="bi bi-envelope d-flex align-items-center">
                <a href="mailto:contact@example.com">support@ansoftwareservices.com</a>
              </i>
              <i className="bi bi-phone d-flex align-items-center ms-4">
                <span> +1(506)703-5614</span>
              </i>
            </div>
            <div className="social-links d-none d-md-flex align-items-center">
              <a href="https://www.x.com/anadeau" className="twitter" target="_blank">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://www.facebook.com/ansoftwareservices/" className="facebook" target="_blank">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/adriannadeau" className="instagram" target="_blank">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/101774044/" className="linkedin" target="_blank">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="branding d-flex">
          <div className="container position-relative d-flex justify-content-between">
            <nav className="navbar">
              <div className="why-box"></div>
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
                      <a href="https://smbbusiness.pro/" target="_blank">SMB Business Pro</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="https://itthoughtsadrian.wordpress.com/">Blog</a>
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
              style={{ marginBottom: "25px" }}
            >
              Free Consultation
            </a>
          </div>
        </div>
      </header>
      <main className="main">
        <section id="hero" className="hero section">
          <div className="container position-relative">
            <div className="content row gy-4">
              <div className="col-lg-4 d-flex align-items-stretch">
                <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
                  <a href="index.html">
                    <img
                      src="/assets/img/Unleashinginnovation-logo.png"
                      className="img-fluid"
                      alt="A.N. Software Services Logo"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </a>
                  <h3>Why Choose A.N Software Services?</h3>
                  <h3>We act as your full-time IT staff — so you can focus on growing your business.</h3>
                </div>
              </div>
              <div className="col-lg-8 d-flex align-items-stretch">
                <div className="d-flex flex-column">
                  <div className="welcome position-relative" data-aos="fade-down" data-aos-delay="100">
                    <h2>A.N. Software Services: Your Full-Time IT Department Without the Overhead.</h2>
                  </div>
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="300">
                    <p>
                      <strong>Your On-Demand IT Team:</strong> Access experienced tech professionals and AI-powered
                      solutions, with 20+ years of expertise, without the overhead of in-house hires.
                      <br />
                      <br />
                      <strong>Complete System Management:</strong> From servers to software, we monitor, maintain, and
                      optimize your entire IT environment.
                      <br />
                      <br />
                      <strong>Cybersecurity Protection:</strong> Safeguard your business with proactive threat
                      monitoring, security audits, and data protection strategies.
                      <br />
                      <br />
                      <strong>24/7 Technical Support:</strong> Get reliable, responsive help when you need it — no
                      waiting, no hassle.
                      <br />
                      <br />
                      <strong>Technology Strategy & Consulting:</strong> Align your IT infrastructure with your business
                      goals through expert guidance and planning.
                      <br />
                      <br />
                      <strong>Cloud Services & Remote Solutions:</strong> Modernize operations with secure cloud
                      hosting, data backup, and remote work solutions.
                      <br />
                      <br />
                      <strong>Software Updates & Maintenance:</strong> Keep your systems fast, secure, and up to date
                      with scheduled updates and performance checks.
                      <br />
                      <br />
                      <strong>Custom Reporting & Insights:</strong> Gain clarity with tailored IT reports, usage stats,
                      and health checks for smarter decision-making.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default App;
