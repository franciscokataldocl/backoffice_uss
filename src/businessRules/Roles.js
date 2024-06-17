import { s3JsonFile } from "../context/data/APIs";
export const rRoles = async () => {
    try{
        let s3fileResult = await s3JsonFile({props:{
            bucket : process.env.REACT_APP_BUCKET,
            fileName: process.env.REACT_APP_FILENAME,
            action: 'read'
        }});
        const keys ={};
        let info = {};
        if (s3fileResult.statusCode === 200){
            const _body = s3fileResult.body;
            const fkeys = Object.keys(s3fileResult.body).filter(key => key.includes('role'));
            for (const key in fkeys) {
                if (_body.hasOwnProperty(fkeys[key])) {                    
                    keys[fkeys[key]] = _body[fkeys[key]].value
                    if (_body.hasOwnProperty(fkeys[key])){
                        info = _body[fkeys[key]].record;
                    }
                }
            }
        };
        return {
            statusCode: 200,
            info: info, 
            body: keys
        }
    }catch(error){
        return {
            statusCode:500,
            message: error
        }
    }
}
export const rSave = async ({props}) => {
    try{
        let keys = []
        for (const key in props.form) {
            if (props.form.hasOwnProperty(key)) {
                const value = props.form[key];
                keys.push({
                    key: key.trim(),
                    value: value.trim()
                })
            }
        }

        props = {
            keys: keys,
            action:'write',
            bucket:process.env.REACT_APP_BUCKET,
            fileName:process.env.REACT_APP_FILENAME,
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