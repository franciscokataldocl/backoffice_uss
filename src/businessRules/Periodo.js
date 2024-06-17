import { GetPeriodos, s3JsonFile } from '../context/data/APIs'
export const rPeriodos = async ({key, startCode}) => {
    try{
        let periodoResult = await GetPeriodos({props:{}});
        if (periodoResult.statusCode === 200){
            let _periodos = periodoResult.body.filter(row => Number(row.code) >= Number(startCode));
            let s3fileResult = await s3JsonFile({props:{
                bucket : process.env.REACT_APP_BUCKET,
                fileName: process.env.REACT_APP_FILENAME,
                key: key,
                action: 'read'
            }});
            let s3file = [];
            let info = {};
            if (s3fileResult.statusCode === 200){
                s3file = s3fileResult.body.value
                info = s3fileResult.body.record;
            };

            _periodos = _periodos.map((items) => ({
                ...items,
                isChecked: s3file.includes(items.code),
            }));
            return {
                statusCode: 200,
                info: info, 
                body: _periodos
            }      
        }else{
            return periodoResult;
        }        
    }catch(error){
        return {
            statusCode:500,
            message: error
        }
    }
}
export const rSort = async (periodos) => {
    try{
        periodos = periodos.sort((a, b) => {
            if (Number(a.code) < Number(b.code)) {
              return -1;
            }
            if (Number(a.code) > Number(b.code)) {
              return 1;
            }
            return 0;
          });
        return periodos;
    }catch(error){
        return periodos;
    }
}

export const rSave = async ({props}) => {
    try{
        props = {
            keys: [
                {
                    key: props.key,
                    value: props.value
                }
            ],
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