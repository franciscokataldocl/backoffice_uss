import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-uss-2023.png';
import AuthContext from '../context/authentication/AuthContext';

const Navigation = () => {
  const {logout, user} = useContext(AuthContext);
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} width="220" alt="" className="d-inline-block align-middle mr-2"/>
        </Link>
        <button className="navbar-toggler" type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link to="/Setting"><i className='fa fa-cog'> Configuración</i></Link></li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {user?.person?.name??'Usuario'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li>
                    <a className="btn dropdown-item" href='#'
                      onClick={()=>handleLogout()}
                    >
                      <i className='fa fa-sign-out'></i> Cerrar sesión</a>
                  </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
