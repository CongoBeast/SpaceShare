import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SidebarNavbar from './components/sidebar'
import MarketOffers from './components/offers';
import AboutPage from './pages/about'
import ProfilePage from './pages/profile';
import AuthPage from './pages/auth.js';
import TopNavBar from "./components/TopNavBar";
import NotificationsPage from './pages/notifications.js';
import MyOffersPage from './pages/myoffers.js';
import OfferRequestsPage from './pages/offerRequests.js';
import RequestResponses from './pages/requestResponse.js'


function App() {
  return (

    // <div className="d-flex">
    //   <SidebarNavbar />
    //   <div className="content flex-grow-1">
    //     <MarketOffers />
    //   </div>
    // </div>

    <Router>
    <div className="d-flex">
      <SidebarNavbar />

      <div className="container-fluid">
      <TopNavBar />
        <Routes>
          <Route path="/" element={<MarketOffers />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/myoffers" element={<MyOffersPage />} />
          <Route path="/myrequests" element={<RequestResponses />} />
          <Route path="/offerrequests" element={<OfferRequestsPage/>}></Route>
        </Routes>
      </div>
    
    </div>
    </Router>
  );
}

export default App;
