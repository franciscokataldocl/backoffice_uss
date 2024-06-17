import React, { useContext } from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// import Logs from '../../pages/Logs';
import Setting from '../../pages/Setting';
import Navigation from '../../components/Navigation';

import AuthContext from '../../context/authentication/AuthContext';
import Login from '../../pages/Login';
import Notify from '../../components/Notification';
import { ToastContainer } from 'react-toastify';

const RRouter = () => {
    const {isAccess, isLoggedIn } = useContext(AuthContext);
    return (
        <Router>
            {(isLoggedIn && (isAccess?.access??null)) ? (
                <div className='container-md'>
                    <div className='header' style={{margin:'2px'}}>
                    <Navigation/>
                </div>
                <div className='body'>
                    <Routes>
                        <Route path="/" element={<Setting />} />
                        <Route path="/Setting" element={<Setting />} />
                    </Routes>
                    </div>
                </div>
                ) : (
                    <div>
                        <Login/>
                        {isAccess.message &&
                            Notify({
                                props: {
                                    message: isAccess.message,
                                    type: 'warning'
                                }
                            })
                        }
                        <ToastContainer />
                    </div>                    
                )
            }
        </Router>
    );
}

export default RRouter;
