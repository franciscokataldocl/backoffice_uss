import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authentication/AuthContext";
import { Message } from "./Message";
import Notify from "./Notification";
import { ToastContainer } from "react-toastify";
import { Loading, LogsConfig } from "./configurations/JsonDefault";
import { rLogFiles, rSave } from "../businessRules/LogFile";

const title = 'LOGs';

const LogFiles = () => {
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const [form, setForm] = useState(LogsConfig());
    const { user } = useContext(AuthContext);
    const [info, setInfo] = useState({});
    const [viewMessage, setViewMessage] = useState(null);

    useEffect(() => {
        const getLogFiles = async () => {
            try{
                showMessage ({props: Loading({title})});
                let logFilesResult = await rLogFiles();
                if (logFilesResult.statusCode === 200) {
                    setForm(logFilesResult.body);
                    setInfo(logFilesResult.info);
                } else {
                    Notify({
                        props: {
                            message: logFilesResult.message,
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
        getLogFiles();
    }, []);

    const handleMessageClosePopup = () => {
        setViewMessage(null);
    }
    const showMessage = async({props}) => {
        setViewMessage(await Message({props}));
    }

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: (type==='checkbox')? checked:value
        }));
        setViewSaveBtn(true);
    }
    const handleSave = async (e) => {
        try{
            e.preventDefault();
            if (document.getElementById("logFiles").checkValidity()) {
                showMessage({ props: Loading({ title }) });
                const saveResult = await rSave({
                    props: {
                        form: form,
                        user: user.person.name
                    }
                });
                if (saveResult.statusCode===200) setViewSaveBtn(false);
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
    return (
        <div className="col-sm-11">
            <form id="logFiles" onSubmit={handleSave}>
                <div className="form-group row">
                    <label htmlFor="path" className="col-sm-4 col-form-label">Directorio Log *</label>
                    <div className="col-sm-8">
                        <input type="text" id="path" name="path"
                        disabled
                            className="form-control"
                            required
                            value={form.path}
                            // onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="nameCourse" className="col-sm-4 col-form-label">Nombre de Curso *</label>
                    <div className="col-sm-8">
                        <input type="text" id="nameCourse" name="nameCourse"
                            className="form-control"
                            required
                            value={form.nameCourse}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="nameHierarchy" className="col-sm-4 col-form-label">Jerarquía *</label>
                    <div className="col-sm-8">
                        <input type="text" id="nameHierarchy" name="nameHierarchy"
                            className="form-control"
                            required
                            value={form.nameHierarchy}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="nameUsers" className="col-sm-4 col-form-label">Usuarios *</label>
                    <div className="col-sm-8">
                        <input type="text" id="nameUsers" name="nameUsers"
                            className="form-control"
                            required
                            value={form.nameUsers}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="namePeriods" className="col-sm-4 col-form-label">Periodos *</label>
                    <div className="col-sm-8">
                        <input type="text" id="namePeriods" name="namePeriods"
                            className="form-control"
                            required
                            value={form.namePeriods}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="nameCourseNode" className="col-sm-4 col-form-label">Cursos por Nodo *</label>
                    <div className="col-sm-8">
                        <input type="text" id="nameCourseNode" name="nameCourseNode"
                            className="form-control"
                            required
                            value={form.nameCourseNode}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="nameUsersNode" className="col-sm-4 col-form-label">Usuarios por Nodo *</label>
                    <div className="col-sm-8">
                        <input type="text" id="nameUsersNode" name="nameUsersNode"
                            className="form-control"
                            required
                            value={form.nameUsersNode}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="nameUsersCourse" className="col-sm-4 col-form-label">Usuarios por Nodo *</label>
                    <div className="col-sm-8">
                        <input type="text" id="nameUsersCourse" name="nameUsersCourse"
                            className="form-control"
                            required
                            value={form.nameUsersCourse}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="nameUsersCourseManual" className="col-sm-4 col-form-label">Usuarios por Curso Manual *</label>
                    <div className="col-sm-8">
                        <input type="text" id="nameUsersCourseManual" name="nameUsersCourseManual"
                            className="form-control"
                            required
                            value={form.nameUsersCourseManual}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="saveAws" className="col-sm-4 col-form-label">Publicar en AWS S3</label>
                    <div className="col-sm-8">
                        <div className="form-check form-switch">
                            <input type="checkbox" id="saveAws" name="saveAws" className="form-check-input"
                            disabled
                                checked={form?.saveAws??false}
                                // onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ overflowY: 'auto', maxHeight: '100px', marginBottom: '10px', width: '100%'}}></div>
                    {/* <SaveBar
                        form="logFiles"
                        typeButton='button'
                        handleSave={handleSave}
                        viewSaveBtn={viewSaveBtn}
                        info={info}
                    /> */}
                </div>
            </form>
            {viewMessage}
            <ToastContainer />
        </div>
    )
}
export default LogFiles;