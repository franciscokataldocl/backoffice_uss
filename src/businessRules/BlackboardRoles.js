import { s3JsonFile } from "../context/data/APIs";
export const rRoles = async ({key , handlEdit, handlDelete}) => {
    try{
        let s3fileResult = await s3JsonFile({props:{
            bucket : process.env.REACT_APP_BUCKET,
            fileName: process.env.REACT_APP_FILENAME,
            key: key,
            action: 'read'
        }});
        let s3file = [];
        let info = {};
        if (s3fileResult.statusCode === 200){
            let rows = await Promise.all(
                s3fileResult.body.value.map(rol => {
                    let row = {
                        adminCode: rol.adminCode,
                        equivalente: rol.equivalente
                    }
                    row.actions = buttonActions({row:row, handlEdit, handlDelete});
                    return row;
                })
            )
            s3file = rows
            info = s3fileResult.body.record;
        };
        return {
            statusCode: 200,
            info: info, 
            body: s3file
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
        let values = await Promise.all(
            props.data.map(row => (
                {
                    adminCode: row.adminCode,
                    equivalente: row.equivalente
                }
            ))
        );
        props = {
            keys: [
                {
                    key: props.key,
                    value: values
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
export const SearchIn = ({dataIn, searchValue}) => {
    try{
        const result = dataIn.find(row =>
            JSON.stringify(JustData(row)) === JSON.stringify(JustData(searchValue))
        );
      if (result){
          return true;
      }
      return false;
    }catch(error){
      return false;
    }
}

export const JustData = (row) => {
    return {
        adminCode: row?.adminCode??'',
        equivalente: row?.equivalente??''
    }
}

export const buttonActions = ({row, handlEdit, handlDelete}) => {
    return (
        <div className="btn-group" role="group" aria-label="Basic example">
            <button
                className='btn btn-secondary'
                onClick={() => handlEdit(row)}
            >
                <i className="fa fa-pencil fa-fw" aria-hidden="true"></i>
            </button>
            <button
                className='btn btn-secondary'
                onClick={() => handlDelete(row)}
            >
                <i className="fa fa-trash-o" aria-hidden="true"></i>
            </button>
        </div>
    )
}