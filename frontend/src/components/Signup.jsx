import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = { username, email, password };
    try {
      const { data } = await axios.post(
        "http://localhost:4001/user/signup",
        user,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      toast.success(data.message || "User registered successfully");
      localStorage.setItem("jwt", data.token);
      navigateTo("/login");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.errors || "server error");
      } else {
        toast.error("Cannot connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
            <h1 className="mb-3 text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
              Signup
            </h1>
            <form onSubmit={register}>
              {/*username*/}
              <div className="mb-4">
                <label className="block font-semibold">Username</label>
                <input
                  className="w-full p-3 border border-gray-400  rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
              </div>

              {/*email*/}
              <div className="mb-4">
                <label className="block font-semibold">Email</label>
                <input
                  className="w-full p-3 border border-gray-400  rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  type="email"
                  placeholder="Enter your email "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>

              {/*password*/}
              <div className="mb-4">
                <label className="block font-semibold">Password</label>
                <input
                  className="w-full p-3 border border-gray-400  rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>

              {/*Signup button*/}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-900 duration-300 rounded-xl font-semibold p-3"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
              <p className="mt-4 text-center text-gray-600">
                Already have an account?{" "}
                <NavLink className="text-blue-600 hover:underline" to="/login">
                  Login
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
