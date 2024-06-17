import { s3JsonFile } from "../context/data/APIs";
export const rSave = async ({props}) => {

  const {CRN, PERIOD, START_DATE, END_DATE, UPDATED_START_DATE, UPDATED_END_DATE} = props.data;
    try{

        const convertedObject = {
            "key": CRN+PERIOD+START_DATE+END_DATE+UPDATED_START_DATE+UPDATED_END_DATE,
            "value": props
        };
        let keys = [convertedObject];

        props = {
            keys: keys,
            action:'write',
            bucket:process.env.REACT_APP_BUCKET,
            fileName:'back-office/newDates.json',
            user: props.user

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