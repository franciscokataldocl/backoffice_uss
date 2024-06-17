/* o365 */
import {ValidateO365, GenerateToken} from "../data/APIs";
import { ValidateAccess } from "./ValidateAccess";
export const o365 = async ({code, login, settingAccess}) => {
    try {
        let _body = {
            code: code
        }
        const ValidateO365Result = await ValidateO365({props: _body});
        console.log('ValidateO365Result', ValidateO365Result.body)
        if (ValidateO365Result.statusCode === 200){
            const {data, error_desc} = ValidateO365Result.body;
            console.log('data_error_desc', data, error_desc)
            if (data){
                const validateAccess = await ValidateAccess((data?.mail??'').toString().toLowerCase());
                if (validateAccess.statusCode === 200){
                    const tokenResult = await GenerateToken({props: {
                        data: _body,
                        options: {expiresIn: '1h'}
                    }});
                    if (tokenResult.statusCode === 200){
                        _body = {
                            person:{
                                username: data.mail.toString().toLowerCase(),
                                name: data.displayName,
                                mail: data.mail.toString().toLowerCase()
                            },
                            token: tokenResult?.body.token??null
                        };
                        login(_body);
                        settingAccess ({access: true,message: null});
                    }else{
                        settingAccess ({
                            access: false,
                            message: `Error - Obtener token - ${tokenResult.message}`
                        });
                    }
                }else{
                    settingAccess ({
                        access: false,
                        message: `Error - valida acceso - ${validateAccess.message}`
                    });
                }
            }else{
                settingAccess ({
                    access: false,
                    message: `Error - usuario no encontrado - ${error_desc}`
                });
            }
        } else{
            settingAccess ({
                access: false,
                message: `Error - Validar el usuario - ${ValidateO365Result.message}`
            });
        }
    }catch (error) {
        settingAccess ({
            access: false,
            message: `Error general- al validar la cuanta del usuario - ${error}`
        });
    }
}