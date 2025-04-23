import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  
  return (
    <nav className="fixed top-0 w-full bg-gray-900 text-white py-4 px-8 flex justify-between items-center shadow-lg z-50">
      {/* Wrapped "Jaisone" with Link to navigate to Home */}
      <Link to="/" className="text-2xl font-bold hover:text-red-500">
        Jaisone
      </Link>

      <ul className="flex space-x-6">
        {[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
          { name: "Contact", path: "/Contact" },

          { name: "Login", path: "/login" }
        ].map((item) => (
          <li key={item.name}>
            <Link to={item.path} className="hover:text-red-500">{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
