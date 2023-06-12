import { Routes, Route, Link } from 'react-router-dom';
import logo from '../logo.png';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Loader from '../utility/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeCompnent = React.lazy(() => import('./Homepage'));
const CityComponent = React.lazy(() => import('./Citypage'));

const Navbar = () => {
  const location = useLocation();
  const [navbarStyle, setNavbarStyle] = useState({ homeStyle: '', cityStyle: '' });
  const isLoader = useSelector<RootState>((state) => state?.loader?.isLoading);

  useEffect(() => {
    if (location.pathname === '/') {
      setNavbarStyle({ homeStyle: 'navbar-menu-button', cityStyle: '' });
    } else {
      setNavbarStyle({ homeStyle: '', cityStyle: 'navbar-menu-button' });
    }
  }, [location]);

  return (
    <>
      <div className="main-container">
        <ul className="navbar">
          <div>
            <img src={logo} height={'100%'} width={'100%'} alt="Logo" />
          </div>
          <li className="navbar-menu">
            <Link to="/" className={`${navbarStyle?.homeStyle}`}>
              <p>
                <i className="fa-solid fa-house-chimney-window"></i>
              </p>
              Home
            </Link>
          </li>
          <li className="navbar-menu">
            <Link to="/cities" className={`${navbarStyle?.cityStyle}`}>
              <p>
                <i className="fa-solid fa-tree-city"></i>
              </p>
              Cities
            </Link>
          </li>
        </ul>
        <div className="main-containt">
        <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={
                <React.Suspense fallback={<Loader />}>
                  <HomeCompnent />
                </React.Suspense>
              }
            />
            <Route
              path="cities"
              element={
                <React.Suspense fallback={<Loader />}>
                  <CityComponent />
                </React.Suspense>
              }
            />
          </Routes>
        </div>
      </div>
      {isLoader && <Loader />}
    </>
  );
};

export default Navbar;
