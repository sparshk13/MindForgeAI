import React from "react";
import Footer from "../components/Footer"

export default function Dashboard() {
  return (
    <div className="min-h-screen flex  flex-col font-inter">
      <div className="flex flex-1">
        {/* sidebar */}
      <aside className="w-64 bg-secondary text-white flex flex-col py-8 px-6 space-y-6">
      <h2 className="text-2xl font-bold">MindForgeAI</h2>

  {/* Navigation Links - stacked one under another */}
  <nav className="flex flex-col space-y-4">
    <a href="roadmap" className="text-white hover:text-accent">Roadmap</a>
    <a href="learn&quiz" className="text-white hover:text-accent">Learn & Quiz</a>
    <a href="confusion-detector" className="text-white hover:text-accent">Confusion Detector</a>
    <a href="recallcard" className="text-white hover:text-accent">Recall Card</a>
    <a href="progresscard" className="text-white hover:text-accent">Progress Card</a>

     {/* Push logout to bottom */}
      <a
      href="/LandingPage"
      onClick={(e) => {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
      }}
      className="text-white hover:text-accent"  > 
        Logout
      </a>
  
      </nav>
    </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#f9fafe] p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome </h1>
            <p className="text-gray-500">Continue your learning journey</p>
          </div>
          {/* <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          /> */}
        </div>

        {/* Course & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1a213d] text-white p-6 rounded-lg md:col-span-2">
            <h2 className="text-lg mb-2">Continue Course</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Python for Beginners</h3>
              </div>
              <button className="bg-blue-600 px-4 py-2 text-white rounded-md hover:bg-blue-700">Resume</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg mb-2 text-gray-800">Progress Overview</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-gray-300" strokeWidth="3.8" fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="text-blue-600" strokeWidth="3.8" fill="none" strokeDasharray="75, 100"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-blue-600">75%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">4 of 5 modules completed</p>
            </div>
          </div>
        </div>

        {/* Skills Summary */}
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Skills Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Programming", level: "Advanced", value: 80, color: "bg-orange-400" },
              { label: "Machine Learning", level: "Intermediate", value: 65, color: "bg-blue-400" },
              { label: "Mathematics", level: "Basic", value: 40, color: "bg-gray-400" },
            ].map((skill, idx) => (
              <div key={idx}>
                <p className="text-sm text-gray-600">{skill.label}</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2 mb-1">
                  <div className={`${skill.color} h-3 rounded-full`} style={{ width: `${skill.value}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">{skill.value}% - {skill.level}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Growth Chart (Static) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Knowledge Growth</h2>
          <div className="w-full h-40 bg-gray-100 rounded flex items-end justify-between px-4">
            {[20, 35, 50, 70, 85, 100].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-2 bg-blue-600" style={{ height: `${val}px` }}></div>
                <p className="text-xs mt-1 text-gray-500">{["Mar", "Apr", "May", "Jun", "Jul", "Aug"][idx]}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div/>
      </div>
      <Footer/>
    </div>
  );
}
