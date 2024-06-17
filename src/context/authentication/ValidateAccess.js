import { s3JsonFile } from "../data/APIs";

export const ValidateAccess = async(user) => {
    try{
        let s3fileResult = await s3JsonFile({props:{
            bucket : process.env.REACT_APP_BUCKET,
            fileName: process.env.REACT_APP_FILENAME_ACCESS,
            key: 'administrators',
            action: 'read'
        }});
        if (s3fileResult.statusCode === 200){
            const access = s3fileResult.body.value.includes(user);
            if (access){
                return {
                    statusCode: 200
                }
            }
        };
        return {
            statusCode: 404,
            message: `No fue posible validar la identidad del usuario ${user}`
        }
    }catch(error){
        return {
            statusCode: 500,
            message: `No fue posible validar la identidad del usuario ${user}`
        }
    }
}