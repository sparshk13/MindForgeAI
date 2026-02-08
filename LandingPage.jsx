// File: src/pages/LandingPage.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AboutImg from "../assets/about.png";
import Card1 from "../assets/card1.png";
import Card2 from "../assets/card2.png";
import Card3 from "../assets/card3.png";
import heroVideo from "../assets/hero-bg.mp4";
import learnImg from "../assets/learn.png";
import fitImg from "../assets/fit.png";
import confuseImg from "../assets/confuse.png";
import roadmapImg from "../assets/roadmap.png";
import recallImg from "../assets/recall.png";
import {toast, ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

export default function LandingPage() {
  const scrollRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // login redirect
  const handleFeatureAccess = (path) => {
    const isLoggedIn = localStorage.getItem("token");
    if (isLoggedIn){
      navigate(path);
    }else{
      toast.warn("Please login or Signup");
      localStorage.setItem("rediectAfterLogin", path);
    }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white text-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
        <div className="relative z-10 text-white justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" data-aos="fade-down">
            Personalized AI Learning for Every Mind
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 text-white text-center" data-aos="fade-up">
            Unlock smarter learning paths with AI-driven skill detection, concept tracking, and revision tools.
          </p>
          <div className="flex gap-8 justify-center" data-aos="zoom-in">
            <Link to="/signup" className="bg-primary text-white px-6 py-3 rounded-md shadow-md hover:shadow-lg hover:bg-[#0f3c8c] transition-all">
              Get Started
            </Link>
            <Link to="/login" className="bg-accent text-white px-6 py-3 rounded-md shadow-md hover:shadow-lg hover:bg-orange-600 transition-all">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Why MindForgeAI Section */}
      <section className="bg-[#f5faff] py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4" data-aos="fade-up">
            Why Choose MindForgeAI?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Discover the core strengths that make MindForgeAI a smarter and more personalized AI learning platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[{ title: "Short & Impactful", desc: "Learn at your own pace, on your own schedule. MindForgeAI eliminates unnecessary steps and delivers what you need—when you need it.", bg: Card1 },
            { title: "Focused on Personalization", desc: "Stop learning what you already know. MindForgeAI adapts to your skill level and progress, guiding you straight to what matters most.", bg: Card2 },
            { title: "AI-Powered Efficiency", desc: "Our intelligent system analyzes your performance in real-time and delivers bite-sized, personalized lessons — saving you hours of ineffective studying.", bg: Card3 }]
            .map((item, idx) => (
              <div
                key={idx}
                className="relative bg-cover bg-center rounded-xl shadow text-white overflow-hidden group"
                style={{ backgroundImage: `url(${item.bg})`, minHeight: "280px" }}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-all duration-300 rounded-xl" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <h3 className="text-xl font-semibold text-accent mb-2">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary" data-aos="fade-up">
          Platform Features
        </h2>

        <div className="relative overflow-hidden">
          <button
            onClick={() => scrollRef.current.scrollBy({ left: -360, behavior: "smooth" })}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary text-white p-2 rounded-full shadow-md hover:bg-accent transition"
          >
            ◀
          </button>
          <button
            onClick={() => scrollRef.current.scrollBy({ left: 360, behavior: "smooth" })}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary text-white p-2 rounded-full shadow-md hover:bg-accent transition"
          >
            ▶
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 max-w-full px-2 md:px-10 snap-x scroll-smooth overflow-x-auto scrollbar-hide"
          >
            {[{
              title: "Roadmap",
              desc: "Career roadmap generator tailored to personal goals.",
              to: "/roadmap",
              img: learnImg
            },
            {
              title: "Learn",
              desc: "AI that customizes learning material based on individual styles.",
              to: "/learn&quiz",
              img: fitImg
            },
            {
              title: "Confusion Detector",
              desc: "Find and fix areas of misunderstanding with AI help. Our model identifies weak areas from your interactions.",
              to: "/confusion-detector",
              img: confuseImg
            },
            {
              title: "Recall Card",
              desc: "Engaging, visual recall aids for concept mastery.",
              to: "/recallcard",
              img: roadmapImg
            },
            {
              title: "Progress Card",
              desc: "Monitors retention and schedules personalized revisions",
              to: "/progresscard",
              img: recallImg
            }].map((item, idx) => (
              <div
                to={item.to}
                key={idx}
                onClick={() => handleFeatureAccess(item.to)}
                className=" cursor-pointer min-w-[300px] max-w-[360px] h-[360px] bg-secondary rounded-xl p-6 shadow hover:shadow-xl transition-all snap-center shrink-0"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="w-full h-32 bg-white rounded-md mb-4 flex items-center justify-center">
                  <img src={item.img} alt={item.title} className=" w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{item.title}</h3>
                <p className="text-sm text-white leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 py-24 bg-gradient-to-r from-secondary to-[#eef7ff] text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary" data-aos="fade-up">How It Works</h2>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          MindForgeAI combines AI-driven diagnostics and personalized content to ensure your learning is efficient and tailored to your pace.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: "📈", title: "Skill Scan", desc: "Analyze your learning goals with AI." },
            { icon: "🧠", title: "Understand Concepts", desc: "Use interactive cards & lessons." },
            { icon: "🤖", title: "Fix Confusions", desc: "Let AI detect and resolve weak areas." },
            { icon: "🚀", title: "Track Progress", desc: "Revise using personalized schedules." },
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-md shadow hover:shadow-lg transition-all"
              data-aos="fade-up"
              data-aos-delay={idx * 150}
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h4 className="text-xl font-semibold text-primary mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-20 bg-[#f0f8ff]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2" data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-4 text-primary">About MindForgeAI</h2>
            <p className="text-gray-700">
              MindForgeAI is your personal AI education platform — bridging the gap between confusion and confidence. From skill scanning to micro-lessons and adaptive revision, MindForge guides your learning intelligently.
            </p>
          </div>
          <div className="md:w-1/2" data-aos="fade-left">
            <img src={AboutImg} alt="about" className="rounded-md shadow-md w-full" />
          </div>
        </div>
      </section>

      <Footer />
      <ToastContainer position="top-center" autoClose={3000}/>
    </div>
  );
}
