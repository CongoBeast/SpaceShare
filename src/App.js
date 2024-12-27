import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SidebarNavbar from './components/sidebar'
import MarketOffers from './components/offers';
import AboutPage from './pages/about'
import ProfilePage from './pages/profile';



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
      <div className="content flex-grow-1">
        <nav className="navbar navbar-expand-md navbar-dark bg-primary">
          <div className="container-fluid">
            <span className="navbar-brand">LuggageSpace</span>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<MarketOffers />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
