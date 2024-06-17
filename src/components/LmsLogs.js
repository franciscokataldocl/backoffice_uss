import Table from 'react-bootstrap/Table';
import { rDownloadFile, rLogs } from '../businessRules/Logs';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Notify from './Notification';

const LmsLogs = () => {
const [logs, setLogs] = useState([])

const getLogs = async () =>{
    let {body} = await rLogs();
  
    if(body.length > 0){
        const dataLogs = body.slice(1);
        dataLogs.map(log =>{
            let removedLog = log.Key.replace('log/', '');
            const type = removedLog.split('__')[0];
            removedLog = removedLog.replace('.log', '');
            let removedType = removedLog.substring(removedLog.indexOf('__') + 2);
            const partes = removedType.split('-');
            let fecha = partes.slice(0, 3).join('-');
            let hora = partes.slice(3).join(':');

            const newLog ={
                file: log.Key,
                type: type,
                fecha: fecha,
                hora: hora
            }
            setLogs(oldArray => [...oldArray, newLog]);
        })
        // setLogs(body.slice(1));
    }
}


    useEffect(() => {
      getLogs();
    }, [])
    
  const downloadLog = async (name) =>{

const downloadResult = await rDownloadFile(name);
if (downloadResult.statusCode === 200){
    const _blob = downloadResult.body;
    // Obtener la ultima seccion de la ruta (nombre del archivo)
    const fileName = name.split('/').pop();
    // Crear un Blob con los datos binarios
    const file = new File([_blob], fileName, { type: downloadResult.contentType });

    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}else{
    Notify({
        props: {
        message: downloadResult.message,
        type: 'warning'
        }
    });
}    
  }
    
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Descarga</th>
                </tr>
            </thead>
            <tbody>
                {logs && logs.map((log,index)=>(
                <tr key={index+log.hora}>
                        <td>{log.type}</td>
                        <td>{log.fecha}</td>
                        <td>{log.hora}</td>
                        <td><Button variant="info" onClick={() => downloadLog(log.file)}>
                        <i className="fa fa-download fa-fw" aria-hidden="true"></i>
                        </Button></td>
                    
                </tr>
                ))}
               


            </tbody>
        </Table>
    )
}

export default LmsLogs