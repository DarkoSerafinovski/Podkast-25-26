import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api";

export default function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const linksToDisplay = [{ name: "Svi Podkasti", path: "/podcasts" }];

  const handleLogoutAction = async () => {
    try {
      await api.post("/logout");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const activeStyle =
    "text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1";
  const inactiveStyle =
    "text-gray-600 hover:text-indigo-600 transition-colors font-medium";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center py-4">
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/podcasts" className="flex items-center space-x-2">
              <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                Podcast<span className="text-indigo-600">Hub</span>
              </span>
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {linksToDisplay.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  isActive ? activeStyle : inactiveStyle
                }
              >
                {name}
              </NavLink>
            ))}

            <button
              onClick={handleLogoutAction}
              className="ml-4 px-5 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-red-600 transition-all duration-300 text-sm shadow-md"
            >
              Odjavi se
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <span className="text-2xl">{isOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fadeIn">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {linksToDisplay.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-bold text-gray-700 hover:bg-indigo-50 rounded-xl"
              >
                {name}
              </NavLink>
            ))}
            <button
              onClick={handleLogoutAction}
              className="w-full text-left px-4 py-3 text-base font-bold text-red-600 bg-red-50 rounded-xl mt-4"
            >
              Odjavi se
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
