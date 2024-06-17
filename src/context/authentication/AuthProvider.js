// AuthProvider.js
import React, { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import AuthContext from './AuthContext';
import { RemoveLocalStorage, SetLocalStorage } from '../data/LocalStorage';
import { ValidateSession } from './Session';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAccess, setIsAccess] = useState({access: false, message: null});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const checkAuthentication = async () => {
        const validateSessionResult = await ValidateSession();
        if (validateSessionResult.statusCode === 200) {
            const newUserInfo = validateSessionResult.body?.person??null;
            if (!isEqual(newUserInfo, user?.person)) {
                setUser({ person: newUserInfo });
            }    
            setIsLoggedIn(true);
            settingAccess ({access: true,message: null});
        } else {
            // La sesión no es válida
            setUser(null);
            setIsLoggedIn(false);
            setIsAccess({access: false, message: null});
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    const settingAccess = (access) => {
        try{
            setIsAccess(access);
        }catch(error){
            setIsAccess({access: false, message: error});
        }
    }
    const login = (userData) => {
        SetLocalStorage("authToken", userData);
        delete userData.token
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUser(null);
        RemoveLocalStorage("authToken");
        setIsLoggedIn(false);
        setIsAccess({access: false, message: null});
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn, user, isAccess, login, logout, checkAuthentication, settingAccess 
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
