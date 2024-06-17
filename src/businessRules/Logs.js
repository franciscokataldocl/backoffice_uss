import { Logs, DownloadFile } from "../context/data/APIs";

export const rLogs = async () => {
    try{
        let s3fileResult = await Logs({props:{
            bucket : `${process.env.REACT_APP_BUCKET}`,
            action: 'read',
            prefix: 'log'
        }});
        if (s3fileResult.statusCode === 200){
            return {
                statusCode: 200,
                body: s3fileResult.body
            }
           
        };
        
        
    }catch(error){
        return {
            statusCode: 500,
            message: `Error - ${error.message}`
        };
    };
};

export const rDownloadFile = async(file) => {
    console.log('file_to_download', file)
    try{
        const downloadResult = await DownloadFile({props:{
            bucket : `${process.env.REACT_APP_BUCKET}`,
            key: file
        }});
        console.log('downloadResult', downloadResult)
        if (!downloadResult.hasOwnProperty('statusCode')) {
            return {
                statusCode: 200,
                body: downloadResult
            } 
        }else{
            return downloadResult;
        }
        
    }catch(error){
        return {
            statusCode: 500,
            message: `Error - ${error.message}`
        };
    };
}