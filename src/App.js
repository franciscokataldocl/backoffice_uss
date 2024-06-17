import { useContext, useEffect } from 'react';

import './assets/css/App.css';
import AuthContext from '../src/context/authentication/AuthContext';
import {o365} from '../src/context/authentication/o365';

import RRouter from './context/routes/RRouter';
import { Footer } from './components/Footer';

function App() {
    const {login, settingAccess} = useContext(AuthContext);
    const urlParams = new URLSearchParams(window.location.search);
    useEffect(() => {
        // Obtener el valor del parámetro 'code' de la URL para O365    
        const code = urlParams.get('code');
        if (code) {
            window.history.pushState(null, null, window.location.origin);
            const validateO365 = async(code) => {
                await o365({code, login, settingAccess});
            }
            validateO365(code);
        }
    }, []);
    return (
        <div className="App">
            <RRouter/>
            <Footer />
        </div>
    );
}

export default App;
