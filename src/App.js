import logo from './logo.svg';
// import {BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import {HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import RequestResponses from './pages/requestResponse.js';
import ChatPage from './ChatPage/ChatPage.js';
import ShipperCardPage from './pages/ShipperCardPage.jsx';
import ShipperDashboard from './pages/shippers-dashboard.js'
import AuthShipperPage from './pages/auth-shippers.js'
import ShipperProfile from './pages/ShipperProfile.js'
import ManageShipments from './pages/manageShipments.js'
import TrackShipment from './pages/track.js'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

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
          <Route path="/chat" element={<ChatPage/>}></Route>
          <Route path="/shippers" element={<ShipperCardPage/>}></Route>
          <Route path="/shipper-dashboard" element={<ShipperDashboard/>}></Route>
          <Route path="/auth-shipper" element={<AuthShipperPage/>}></Route>
          <Route path="/shipper-profile/:companyName" element={<ShipperProfile/>}></Route>
          <Route path="/manage-shipments" element={<ManageShipments/>}></Route>
          <Route path="/track" element={<TrackShipment/>}></Route>
        </Routes>
      </div>
        <Analytics />
        <SpeedInsights />
    </div>
    </Router>
  );
}

export default App;
