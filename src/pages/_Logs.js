import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { rDownloadFile, rLogs } from "../businessRules/Logs";
import { Loading } from "../components/configurations/JsonDefault";
import Notify from "../components/Notification";
import { Message } from "../components/Message";
import DataTable from "react-data-table-component";
import { LogsColumns } from "../components/configurations/ColumnDTSetting";

const title = 'LOGs';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [viewMessage, setViewMessage] = useState(null);

    useEffect(() => {
        const getLogs = async () => {
            try{
                showMessage ({props: Loading({title})});
                let logResult = await rLogs({handleDownload : handleDownload});
                if (logResult.statusCode === 200) {
                    setLogs(logResult.body);
                } else {
                    Notify({
                        props: {
                            message: logResult.message,
                            type: 'warning'
                        }
                    });
                }
            }catch(error){
                Notify({
                    props: {
                    message: error.message,
                    type: 'warning'
                    }
                });
            }finally{
                handleMessageClosePopup();
            }            
        };
        getLogs();
    }, []);

    const handleMessageClosePopup = () => {
        setViewMessage(null);
    }
    const showMessage = async({props}) => {
        setViewMessage(await Message({props}));
    }

    const handleDownload = async(row) => {
        try{
            showMessage ({props: Loading({title})});
            const downloadResult = await rDownloadFile({props:{
                key: row.Key
            }});
            if (downloadResult.statusCode === 200){
                const _blob = downloadResult.body;
                // Obtener la ultima seccion de la ruta (nombre del archivo)
                const fileName = row.Key.split('/').pop();
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
        }catch(error){
            Notify({
                props: {
                message: error.message,
                type: 'warning'
                }
            });
        }finally{
            handleMessageClosePopup();
        }
    }

    return (
        <div>
            <DataTable
                columns={LogsColumns}
                data={logs}
                pagination
                className="custom-datatable"
            />
            {viewMessage}
            <ToastContainer />
        </div>
    );
}
export default Logs;