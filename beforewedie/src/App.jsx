import React, { useState , useEffect,lazy} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { API } from "./host";

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Users = lazy(() => import("./pages/Users"));
const AdminForm = lazy(() => import("./pages/Admin/AdminForm"));
const UpdateForm = lazy(() => import("./pages/Admin/UpdateForm"));
import Login from "./pages/auth/login";
const Layout = lazy(() => import("./layout/Layout"));
const UserProfile = lazy(() => import("./components/partials/header/Tools/UserProfile"));
const Trip = lazy(() => import("./pages/Trip"));
const TripDetails = lazy(() => import("./pages/TripDetails/TripDeatils"));
const AlertDetails = lazy(() => import("./pages/TripDetails/alert"));
const PitstopDetails = lazy(() => import("./pages/TripDetails/pitstop"));
const TransportDetails = lazy(() => import("./pages/TripDetails/transport"));
const TravellerDetails = lazy(() => import("./pages/TripDetails/traveller"));
const ProfileUser = lazy(() => import("./pages/Users/ProfileUser"));
const Club = lazy(() => import("./pages/Club"));
const Profileclub = lazy(() => import("./pages/Club/profileclub"));

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
          const response = await axios.get(`${API}/admin/getemail?email=${decodedEmail}`);
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
          <Route path="tripdetails" element={<TripDetails />} />
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
