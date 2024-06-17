import { GetLocalStorage } from '../data/LocalStorage';

export const ValidateSession = async() => {
    try{
        const storedToken = JSON.parse(GetLocalStorage('authToken'));
        const token = storedToken?.token??null;
        if (token){            
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            if (!isTokenExpired(tokenData)) {
                delete storedToken.token
                return {
                    statusCode: 200,
                    body: storedToken
                }
            }
        }
        return {
            statusCode: 100,
            message: 'Su Session ha expirado'
        }
        // return{
        //     statusCode:200,
        //     body: 'storedToken'
        // }
      
    }catch(error){
        return {
            statusCode: 500,
            message: error
        }
    }
}

const isTokenExpired = (tokenData) => {
    const expirationTime = tokenData.exp * 1000; // La fecha de vencimiento del token en milisegundos
    return Date.now() > expirationTime;
  };