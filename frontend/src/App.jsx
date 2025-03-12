// import React from 'react'
// import Home from './components/Home'
// import Login from './components/Login'
// import Signup from './components/Signup'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import PageNotFound from './components/PageNotFound'
// import toast, { Toaster } from 'react-hot-toast';

// function App() {
//   const token=localStorage.getItem("jwt")
//   return (
//    <div>
//     <Routes> 
//       <Route path='/' element={token ? <Home /> : <Navigate to={"/login"} />}></Route>
//       <Route path="/login" element={<Login/>}></Route>
//       <Route path="signup" element={<Signup/>}></Route>
//       <Route path='*' element={<PageNotFound/>}></Route>
//     </Routes>
//     <Toaster />
//    </div>
//   )
// }

// export default App
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import PageNotFound from './components/PageNotFound';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("jwt"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
