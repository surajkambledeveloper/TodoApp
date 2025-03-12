import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const login = async (e) => {
    // before login ensures there's no old or invalid token causing issues.  every time a user logs in, they get a fresh token
    localStorage.removeItem("jwt");
    setLoading(true);
    e.preventDefault();
    const user = { email, password };
    try {
      const { data } = await axios.post(
        "http://localhost:4001/user/login",
        user,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(data);
      toast.success(data.message || "User loggedin successfully");

      localStorage.setItem("jwt", data.token);
      navigateTo("/");
      // console.log("Navigating to home...");

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
              Login
            </h1>
            <form onSubmit={login}>
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
                {" "}
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="mt-4 text-center text-gray-600">
                New user?{" "}
                <NavLink className="text-blue-600 hover:underline" to="/signup">
                  Signup
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
