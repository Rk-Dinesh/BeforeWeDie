import React, { useState , useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { API } from "./host";

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Dashboard from "./pages/dashboard";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import AdminForm from "./pages/Admin/AdminForm";
import UpdateForm from "./pages/Admin/UpdateForm";
import Login from "./pages/auth/login";
import Layout from "./layout/Layout";
import UserProfile from "./components/partials/header/Tools/UserProfile";
import Trip from "./pages/Trip";
import TripDeatils from "./pages/TripDetails/TripDeatils";
import AlertDetails from "./pages/TripDetails/alert";
import PitstopDetails from "./pages/TripDetails/pitstop";
import TransportDetails from "./pages/TripDetails/transport";
import TravellerDetails from "./pages/TripDetails/traveller";
import ProfileUser from "./pages/Users/ProfileUser";
import Club from "./pages/Club";

import Profileclub from "./pages/Club/profileclub";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const decodedToken = token ? jwtDecode(token) : null;
  const initialUserData = { role: "" };
  const [userData, setUserData] = useState(initialUserData);

  useEffect(() => {
    if (decodedToken) {
      const decodedEmail = decodedToken.email;

      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${API}/getemail?email=${decodedEmail}`);
          const responseData = response.data;
          setUserData(responseData.role);
        } catch (error) {
          console.log(error);
        }
      };

      fetchUserData();
    }
  }, [decodedToken]);

  const Current_user = userData;
  console.log("user", Current_user);

  if (!token) {
    // Handle the case where token is null
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} />
      <Routes>
        <Route path="" element={<Login setToken={setToken} />} />
       
        <Route path="/*" element={token ? <Layout token={token}/> : <Navigate to='/' />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<Users Current_user ={Current_user}/>} />
          <Route path="admin" element={<Admin Current_user ={Current_user}/>} />
          <Route path="trip" element={<Trip Current_user ={Current_user}/>} />
          <Route path="club" element={<Club Current_user ={Current_user}/>} />
          <Route path="tripdetails" element={<TripDeatils />} />
          <Route path="alert" element={<AlertDetails />} />
          <Route path="pitstop" element={<PitstopDetails />} />
          <Route path="transport" element={<TransportDetails />} />
          <Route path="traveller" element={< TravellerDetails/>} />

          <Route path="form" element={<AdminForm />} />
          <Route path="updateform" element={<UpdateForm Current_user ={Current_user}/>} />
          <Route path="profile" element={<UserProfile token={token} Current_user ={Current_user}/>} />
          <Route path="userprofile" element={<ProfileUser/>} />
          <Route path="clubprofile" element={<Profileclub/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
