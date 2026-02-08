import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function DashNavbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef();

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const services = [
    "Roadmap",
    "Learn & Quiz",
    "Confusion Detector",
    "Progress Card",
    "Recall Card",
  ];

  return (
    <nav
      className="bg-white shadow-md px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10"
      ref={dropdownRef}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <div className="w-10 h-10 rounded-full bg-[#1a213d] flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-[#1025f9]">MindForgeAI</h1>
      </div>

      {/* Right-aligned Buttons */}
      <div className="flex items-center gap-4 ml-auto relative">
        {/* Services Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("services")}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Services
          </button>

          {activeDropdown === "services" && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
              <ul className="py-2 text-sm text-gray-700">
                {(() => {
                  const routeMap = {
                    "Roadmap": "/roadmap",
                    "Learn & Quiz": "/learn&quiz",
                    "Confusion Detector": "/confusion-detector",
                    "Progress Card": "/progresscard",
                    "Recall Card": "/recallcard",
                  };

                  return services.map((feature, idx) => {
                    const route = routeMap[feature] || "/";
                    return (
                      <li key={idx}>
                        <Link
                          to={route}
                          className="block px-4 py-2 hover:bg-gray-100 transition"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {feature}
                        </Link>
                      </li>
                    );
                  });
                })()}
              </ul>
            </div>
          )}
        </div>

        {/* Dashboard Button */}
        <Link
          to="/dashboard"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Dashboard
        </Link>

        {/* History Dropdown */}
          <div className="relative">
            {/* <button
              onClick={() => toggleDropdown("history")}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              History
            </button> */}

            {activeDropdown === "history" && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
            <ul className="py-2 text-sm text-gray-700">
            <li>
            <Link
              to="/roadmap-history"
              className="block px-4 py-2 hover:bg-gray-100 transition"
              onClick={() => setActiveDropdown(null)}
              >
              Roadmap History
              </Link>
            </li>
            <li>
            <Link
            to="/quiz-history"
            className="block px-4 py-2 hover:bg-gray-100 transition"
            onClick={() => setActiveDropdown(null)}
            >
            Learn & Quiz History
            </Link>
            </li>
            <li>
          <Link
            to="/progresscard-history"
            className="block px-4 py-2 hover:bg-gray-100 transition"
            onClick={() => setActiveDropdown(null)}
          >
            Progress Card History
          </Link>
        </li>
        <li>
          <Link
            to="/recallcard-history"
            className="block px-4 py-2 hover:bg-gray-100 transition"
            onClick={() => setActiveDropdown(null)}
          >
            Recall Card History
          </Link>
        </li>
        <li>
          <Link
            to="/confusiondetector-history"
            className="block px-4 py-2 hover:bg-gray-100 transition"
            onClick={() => setActiveDropdown(null)}
          >
            Confusion Detector History
          </Link>
        </li>
      </ul>
    </div>
  )}
</div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("profile")}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow hover:bg-blue-700 transition"
          >
            U
          </button>

          {activeDropdown === "profile" && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 p-4 text-sm text-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1025f9] text-white flex items-center justify-center font-bold">
                  U
                </div>
                <div>
                  <div className="font-semibold text-gray-900">user</div>
                  <div className="text-xs text-gray-500">user@gmail.com</div>
                </div>
              </div>
              <hr className="my-2" />
              <ul className="space-y-2">
                {/* <li className="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
                  View Profile
                </li> */}
              <li
                className="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer text-red-500 font-semibold"
                onClick={() => {
                  localStorage.clear();        //  clear stored tokens/session
                  sessionStorage.clear();      //  optional
                  window.location.href = "/";  //  redirect to landing page
                    }}
                >
                Logout
              </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
