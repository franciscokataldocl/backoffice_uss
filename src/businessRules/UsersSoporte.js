import { s3JsonFile } from "../context/data/APIs";
import { v4 as uuidv4 } from 'uuid';


export const rSave = async (props) => {
  
    try{

       const convertedObject = {
            "key": uuidv4(),
            "value": props
        };
        let keys = [convertedObject];
  
        props = {
            action:'read',
            bucket:process.env.REACT_APP_BUCKET,
            fileName:'back-office/usersNodes.json',
            user: props.user.name
        }
    const lastJsonS3 = await s3JsonFile({props});

        if(Object.keys(lastJsonS3.body).length !== 0){
            const clave = Object.keys(lastJsonS3.body)[0];
            const valorInterno = lastJsonS3.body[clave]["value"];
            var dataS3 = {
                "key": clave,
                "value": valorInterno
            };

            keys.push(dataS3)
        }


        props = {
            keys: keys,
            action:'write',
            bucket:process.env.REACT_APP_BUCKET,
            fileName:'back-office/usersNodes.json',
            user: props.user.name
        }
        const saveResult = await s3JsonFile({props});
       
        return saveResult;
    }catch(error){
        return {
            statusCode:500,
            message: error
        }
    }
}