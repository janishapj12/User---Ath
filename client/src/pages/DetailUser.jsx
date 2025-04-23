import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";

const DetailUser = () => {
  const { id } = useParams();
  const { isLoggedin, logout } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedin) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/user/profile/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setUserData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        logout();
        toast.error(error.response?.data?.message || "Failed to load profile");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isLoggedin, navigate, logout]);

  
  const handleLogout = async () => {
    try {
      await axios.post(`http://localhost:4000/api/user/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      setUserData(null);
      isLoggedin(false);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-6">
      <Navbar />
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src={assets.home_vi} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="bg-slate-900 shadow-lg rounded-2xl p-10 max-w-md w-full text-center relative z-10">
        {loading ? (
          <Skeleton height={200} />
        ) : userData ? (
          <>
            {/* Profile Avatar */}
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
              <img
                src={assets.user_id}
                alt="User Avatar"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
              />
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-indigo-300 dark:text-white">
                {userData.name || "User Profile"}
              </h2>
              <p className="text-gray-500">{userData.email}</p>

              {/* Account Details */}
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Account Details
                </h2>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Member Since
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Account Status
                    </span>
                    <span className="text-sm font-semibold text-lime-400">Active</span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-6 w-full bg-gradient-to-r from-teal-900 to-gray-700 text-white py-2 px-4 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No user data found
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailUser;
