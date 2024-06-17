import { useEffect, useState } from "react";
import Notify from "./Notification";
import { ToastContainer } from "react-toastify";
import { Loading } from "./configurations/JsonDefault";
import { Message } from "./Message";
import { rJobStatus, rSave, rExecutionsJobPhase} from "../businessRules/Synchronization";
import { ExecutionsDate, JobExecutions } from "./SynchronizationSetting";
import JobSchedule from "./JobSchedule";
const title=`CronJob "${process.env.REACT_APP_KBNET_CRONJOBNAME}"`;
const Synchronization = () => {
    const [viewMessage, setViewMessage] = useState(null);
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [messageActive, setMessageActive] = useState(null);
    const [dataTime, setDataTime] = useState([]);
    const [jobExecutions, setJobExecutions] = useState([]);
    const [cronJobSchedule, setCronJobSchedule] = useState('0 0 * * *');

    const [modalData, setModalData] = useState({
        viewPopup: false,
        title: null
    });

    const handleMessageClosePopup = () => {
        setViewMessage(null);
    }
    const showMessage = async({props}) => {
        setViewMessage(await Message({props}));
    }

    const toggleCronJobStatus = () => {
        setIsActive((prev) => !prev);
        setViewSaveBtn(true);
    };
    const handleEdit = (schedule) => {
        setCronJobSchedule(schedule);
        setViewSaveBtn(true);
    }
    
    const getCronJob = async() => {
        try{
            showMessage ({props: Loading({title})});
            const jobResult = await rJobStatus();
            if (jobResult.statusCode === 200) {
                const _body = jobResult?.body??{};
                const _status = _body?.status??{};
                // Job status
                if ((_body?.statusCode??null) === 200){
                    setMessageActive(null);
                    setIsActive(!_status?.suspend??false);
                    setDataTime({
                        lastScheduleTime: _status?.lastScheduleTime??null,
                        lastSuccessfulTime: _status?.lastSuccessfulTime??null,
                        nextScheduleTime: _status?.nextScheduleTime??null
                    });
                    let history = _status?.executionHistory??[];
                    if (history.length > 0 ){
                        history = await rExecutionsJobPhase({handleViewLog, history})
                    }
                    setJobExecutions(history);
                    setCronJobSchedule((_status?.cronSchedule??'0 0 * * *'))
                }else{
                    setMessageActive(_status?.message??null);
                }
            } else {
                Notify({
                    props: {
                        message: jobResult.message,
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

    useEffect(()=> {        
        getCronJob();
    },[]);

    const handleRefresh = () => {
        getCronJob();
    }
    
    const handleSave = async (e) => {
        try{
            e.preventDefault();
            if (document.getElementById("cronJob").checkValidity()) {
                showMessage({ props: Loading({ title }) });
                const saveResult = await rSave({props:{
                    suspend:!isActive,
                    schedule:cronJobSchedule
                }});
                if (saveResult.statusCode === 200) setViewSaveBtn(false);                
                Notify({
                    props: {
                        message: saveResult?.body??saveResult?.message??'Guardado',
                        type: (saveResult.statusCode !== 200) ? 'warning' : 'success'
                    }
                });
            } else {
                Notify({
                    props: {
                        message: 'Por favor, completa todos los campos requeridos.',
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

    const handleShowEdit = (e) => {
        try{
            e.preventDefault();
            setModalData({
                viewPopup: true,
                title: title + ' (Editar)'
            });
        }catch(error){
            Notify({
                props: {
                    message: error.message,
                    type: 'warning'
                }
            });
        }
    }
    
    const handleClosePopup = () => {
        setModalData({
            viewPopup: false,
            title: title
        });
    }

    const handleViewLog = ({e,title, style,message}) => {
        e.preventDefault();
        showMessage ({props: {
            title: title,
            message: message,
            statusCode: style,
            modalSize: 'lg',
            onView:true,
            onHide: handleMessageClosePopup
        }});
    }
    return(
        <div className="col-sm-11">
            <form id="cronJob">
                <div>
                    <div>
                        <h3>Estado del CronJob (<strong>{process.env.REACT_APP_KBNET_CRONJOBNAME}</strong>)</h3>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="stateProcess" name="stateProcess"
                                        onClick={toggleCronJobStatus}
                                        checked={isActive}
                                    />
                                    <label className="form-check-label" htmlFor="stateProcess">Estado del proceso ({isActive ? 'Activo' : 'Suspendido'})</label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button type="button" className='btn btn-warning' onClick={handleRefresh} title="Actualizar"><i className="fa fa-refresh" aria-hidden="true"></i></button>
                            </div>
                        </div>

                        {messageActive && <div className="alert alert-danger">{messageActive}</div>}
                    </div>
                    <hr/>
                    <div>
                        <h3>Actividad</h3>
                        <div style={{maxHeight:'200px', overflow:'auto'}}>
                            <ExecutionsDate data={dataTime}/>
                        </div>                        
                    </div>
                    <hr/>
                    <div>
                        <h3>Estado de Trabajos</h3>
                        <JobExecutions data={jobExecutions}/>
                    </div>
                    <hr/>
                    <div>
                        <h3>Programación</h3>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {cronJobSchedule} 
                                <button className="btn" onClick={handleShowEdit}><i className="fa fa-pencil"></i></button>
                                <JobSchedule
                                    modalData={modalData}
                                    cronJobSchedule={cronJobSchedule}
                                    handleEdit={handleEdit}
                                    handleClosePopup={handleClosePopup}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                {viewSaveBtn && <button type="button" form='cronJob' className='btn btn-success' onClick={handleSave}>Guardar</button>}
                            </div>                            
                        </div>
                    </div>
                </div>
            </form>
            {viewMessage}

            <ToastContainer />
        </div>
    )
}
export default Synchronization;