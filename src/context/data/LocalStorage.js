import { DecryptData, EncryptData } from "../../utils/Crypto";

export const SetLocalStorage = (item,data) => {
    try{
        const cryptData = EncryptData(JSON.stringify(data))
        localStorage.setItem(item, cryptData);
    }catch(error){
        throw new Error('Error - No se puede encriptar un dato vácio');
    }    
}
export const GetLocalStorage = (item) => {
    try{
        const storeData = localStorage.getItem(item)
        if (storeData){
            const data = DecryptData(storeData);
            return data;
        }
        return null;
    }catch(error){
        throw new Error('Error - no se encontro el item almacenado');
    }
}
export const RemoveLocalStorage = (item) => {
    localStorage.removeItem(item);
}