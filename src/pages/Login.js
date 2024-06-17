/* Employee */
import React from "react";
import "../assets/css/login.css";
import logo from "../assets/images/logo-uss-2023.png";

const Login = () => {
    return (
        <div className="wrapper">
            <div id="contact-form">
                <div className="row">
                    <div className="col-md-12">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                    </div>
                        <h1 className="text-title text-center m-t"><b>Administrar los parámetros del sincronizador </b></h1>
                        <p className="text-left">
                            En este sitio podras realizar:
                            <li>Configuración de parametros</li>
                            <li>Accesos</li>
                            <li>Ver Logins</li>
                            <li>Activar o desactivar sincronizador</li>
                        </p>
                        <div className="ibox-content">
                            <a href={process.env.REACT_APP_URL_LOGIN}
                            
                                id="btn-start"
                                className="btn btn btn-outline-primary">
                                <i className="fa fa-windows"></i> Iniciar Sesión
                            </a>
                            <br/>
                            <small><strong>Importante:</strong> para acceder utiliza tu email USS y tu clave de acceso a tu computador. </small>
                            <br />
                            <a href="" target="_blank"><small>Olvidaste tu contraseña?</small></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
