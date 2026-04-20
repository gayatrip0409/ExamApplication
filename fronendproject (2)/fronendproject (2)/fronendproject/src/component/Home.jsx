import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [init, setInit] = useState(true);

  const services = [
    {
      title: "Course Management",
      desc: "Create and manage your courses easily.",
      icon: "bi bi-journal-text",
    },
    {
      title: "Exam Scheduling",
      desc: "Schedule exams with smart tools and reminders.",
      icon: "bi bi-calendar2-event",
    },
    {
      title: "Question Bank",
      desc: "Manage a vast collection of exam questions.",
      icon: "bi bi-archive-fill",
    },
    {
      title: "Result Tracking",
      desc: "Track and analyze student performance.",
      icon: "bi bi-graph-up-arrow",
    },
  ];

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => {
      setAnimate(false);
      if (init) setInit(false); // Disable init after first animation cycle
    }, 600);
    return () => clearTimeout(timeout);
  }, [currentIndex, init]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === services.length - 1 ? prev : prev + 1));
  };

  return (
    <>
      {/* Home Section */}
      <section
        id="home"
        className="text-white text-center d-flex align-items-center justify-content-center position-relative"
        style={{
          backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/069/244/144/small_2x/international-relations-student-studying-us-china-trade-war-case-studies-from-textbooks-and-laptops-in-campus-library-in-stock-concept-and-empty-space-on-the-left-side-set-2-photo.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          zIndex: 1,
        }}
      >

        {/* Overlay for better readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: -1,
          }}
        ></div>

        <div className="container px-4">
          <h1 className="display-4 fw-bold mb-3 animate-fade-in">
            Welcome to Exam Application
          </h1>
          <p className="lead animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Manage exams easily and efficiently with powerful tools.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light" style={{ minHeight: "100vh" }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ fontSize: "3rem" }}>
            About Us
          </h2>
          <div className="row align-items-center">
            {/* Text */}
            <div className="col-md-6" style={{ fontSize: "1.25rem", lineHeight: "1.6" }}>
              <p className="lead mb-4">
                <i className="bi bi-lightbulb-fill text-primary me-2"></i>
                Welcome to the <strong>Exam Application System</strong> – a smart solution
                designed to streamline the entire examination process.
              </p>
              <p className="mb-4">
                <i className="bi bi-gear-wide-connected text-success me-2"></i>
                Our system simplifies the creation, scheduling, and tracking of exams for
                schools, colleges, and training centers. Students can register, receive
                updates, and access their admit cards effortlessly.
              </p>
              <p>
                <i className="bi bi-speedometer2 text-warning me-2"></i>
                Administrators can manage exam applications, set schedules, and monitor
                progress from a centralized dashboard. We are committed to providing a{" "}
                <strong>secure</strong>, <strong>reliable</strong>, and{" "}
                <strong>user-friendly</strong> platform.
              </p>
            </div>

            {/* Image */}
            <div className="col-md-6 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2910/2910761.png"
                alt="About ExamApp"
                className="img-fluid"
                style={{ maxHeight: "350px", marginTop: "20px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-5"
        style={{ background: "#f9f9ff", minHeight: "100vh" }}
      >
        <div className="container">
          <h2 className="text-center mb-5 fw-bold display-6 text-dark">Our Services</h2>
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn btn-outline-primary me-3"
              onClick={handlePrev}
              aria-label="Previous Service"
              disabled={currentIndex === 0}
              style={{
                width: "50px",
                height: "50px",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "15px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e7eaff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <div
              key={currentIndex}
              className={`card text-center border-0 shadow service-card ${
                animate ? "animate-slide-in" : ""
              } ${init ? "animate-init-fade-scale" : ""}`}
              style={{
                minHeight: "500px",
                padding: "60px 40px",
                borderRadius: "30px",
                backgroundColor: "#ffffff",
                maxWidth: "600px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-4">
                  <i className={`${services[currentIndex].icon} fs-1 text-primary`}></i>
                </div>
                <h5
                  className="card-title fw-bold fs-4 mb-3"
                  style={{ fontSize: "1.75rem" }}
                >
                  {services[currentIndex].title}
                </h5>
                <p
                  className="card-text text-muted px-2"
                  style={{ fontSize: "1.25rem" }}
                >
                  {services[currentIndex].desc}
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline-primary ms-3"
              onClick={handleNext}
              aria-label="Next Service"
              disabled={currentIndex === services.length - 1}
              style={{
                width: "50px",
                height: "50px",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "15px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e7eaff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Animation Style */}
        <style jsx>{`
          /* Slide in animation for services */
          .animate-slide-in {
            animation: slideIn 0.5s ease forwards;
            box-shadow: 0 8px 20px rgba(78, 84, 200, 0.25);
            transform-origin: center;
          }

          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateX(${currentIndex % 2 === 0 ? "-60px" : "60px"}) scale(0.95);
              box-shadow: none;
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
              box-shadow: 0 8px 20px rgba(78, 84, 200, 0.25);
            }
          }

          /* Initial load fade and scale */
          .animate-init-fade-scale {
            animation: initFadeScale 0.7s ease forwards;
          }

          @keyframes initFadeScale {
            0% {
              opacity: 0;
              transform: scale(0.85);
              filter: blur(5px);
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: blur(0);
            }
          }

          /* Fade in for home text */
          .animate-fade-in {
            opacity: 0;
            animation: fadeInText 1s ease forwards;
          }

          @keyframes fadeInText {
            to {
              opacity: 1;
            }
          }
        `}</style>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-4"
        style={{ minHeight: "100vh", color: "black" }}
      >
        <div className="container">
          <h2 className="fw-bold mb-4" style={{ fontSize: "1.8rem" }}>
            Contact Us
          </h2>
          <div className="row g-4 align-items-start">
            <div className="col-lg-6">
              <div
                className="bg-white text-dark p-3 rounded-3"
                style={{ boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)" }}
              >
                <form>
                  <div className="mb-3 position-relative">
                    <i className="bi bi-person-fill position-absolute top-50 translate-middle-y ms-2 text-primary fs-6"></i>
                    <input
                      type="text"
                      className="form-control ps-4 py-2 rounded-pill border-0 shadow-sm"
                      placeholder="Your Name"
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <i className="bi bi-envelope-fill position-absolute top-50 translate-middle-y ms-2 text-primary fs-6"></i>
                    <input
                      type="email"
                      className="form-control ps-4 py-2 rounded-pill border-0 shadow-sm"
                      placeholder="Your Email"
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <i className="bi bi-chat-left-text-fill position-absolute top-0 mt-2 ms-2 text-primary fs-6"></i>
                    <textarea
                      rows="4"
                      className="form-control ps-4 pt-3 rounded-3 border-0 shadow-sm"
                      placeholder="Your Message"
                      required
                      style={{ fontSize: "0.9rem" }}
                    ></textarea>
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn text-white fw-semibold py-2 rounded-pill"
                      style={{
                        background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
                        fontSize: "1rem",
                        boxShadow: "0 6px 15px rgba(78, 84, 200, 0.4)",
                        transition: "background 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(90deg, #3b3dbb, #6e73ff)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(90deg, #4e54c8, #8f94fb)")
                      }
                    >
                      <i className="bi bi-send-fill me-1"></i> Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="bg-white text-dark p-3 rounded-3"
                style={{ boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)" }}
              >
                <h4
                  className="mb-3"
                  style={{ color: "#5857f9", fontWeight: "600", fontSize: "1.3rem" }}
                >
                  <i className="bi bi-geo-alt-fill me-2"></i>Location
                </h4>
                <p className="mb-2" style={{ fontSize: "0.95rem" }}>
                  <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                  <strong>Address:</strong> Pune, Maharashtra 411052
                </p>
                <p className="mb-2" style={{ fontSize: "0.95rem" }}>
                  <i className="bi bi-telephone-fill me-2 text-success"></i>
                  <strong>Phone:</strong> +91-8983258348
                </p>
                <p className="mb-2" style={{ fontSize: "0.95rem" }}>
                  <i className="bi bi-envelope-fill me-2 text-info"></i>
                  <strong>Email:</strong> testpoint@org.com
                </p>
                <p className="fst-italic mt-2 text-secondary" style={{ fontSize: "0.85rem" }}>
                  <i className="bi bi-info-circle me-2"></i>
                  We are here to help you with any questions or concerns. Feel free to reach out!
                </p>
                <div className="ratio ratio-16x9 rounded shadow-sm overflow-hidden mt-3">
                  <iframe
                    title="Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.9022377998237!2d73.79499297496462!3d18.53376888256898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf86b9cc6885%3A0x5060003b19e5c219!2sGiri&#39;s%20TECH%20HUB%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1694590839394!5m2!1sen!2sin"
                    style={{ border: 0, borderRadius: "10px" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}