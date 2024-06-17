import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authentication/AuthContext";
import { Message } from "./Message";
import Notify from "./Notification";
import { ToastContainer } from "react-toastify";
import { Loading, RolesConfig } from "./configurations/JsonDefault";
import { rRoles, rSave } from "../businessRules/Roles";
import BlackboardRolesAndUsersDisabled from "./BlackboardRolesAndUsersDisabled";

const title = 'ROLES';

const LogFiles = () => {
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const [form, setForm] = useState(RolesConfig());
    const { user } = useContext(AuthContext);
    const [info, setInfo] = useState({});
    const [viewMessage, setViewMessage] = useState(null);

    useEffect(() => {
        const getRoles = async () => {
            try{
                showMessage ({props: Loading({title})});
                let rolesResult = await rRoles();
                handleMessageClosePopup();
                if (rolesResult.statusCode === 200) {
                    console.log('roles_', rolesResult.body)
                    setForm(rolesResult.body);
                    setInfo(rolesResult.info);
                } else {
                    Notify({
                        props: {
                            message: rolesResult.message,
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
            }            
        };
        getRoles();
    }, []);

    const handleMessageClosePopup = () => {
        setViewMessage(null);
    }
    const showMessage = async({props}) => {
        setViewMessage(await Message({props}));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setViewSaveBtn(true);
    }
    const handleSave = async (e) => {
        try{
            e.preventDefault();
            if (document.getElementById("roles").checkValidity()) {
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
            <form id="roles" onSubmit={handleSave}>
                <div className="form-group row">
                    <label htmlFor="roleStudent" className="col-sm-4 col-form-label">Estudiante *</label>
                    <div className="col-sm-8">
                        <input type="text" id="roleStudent" name="roleStudent"
                            className="form-control"
                            required
                            value={form.roleStudent}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="roleTeacherEdit" className="col-sm-4 col-form-label">Profesor Online *</label>
                    <div className="col-sm-8">
                        <input type="text" id="roleTeacherEdit" name="roleTeacherEdit"
                            className="form-control"
                            required
                            value={form.roleTeacherEdit}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="roleTeacher" className="col-sm-4 col-form-label">Profesor *</label>
                    <div className="col-sm-8">
                        <input type="text" id="roleTeacher" name="roleTeacher"
                            className="form-control"
                            required
                            value={form.roleTeacher}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="roleTeacherAssistant" className="col-sm-4 col-form-label">Profesor Asistente *</label>
                    <div className="col-sm-8">
                        <input type="text" id="roleTeacherAssistant" name="roleTeacherAssistant"
                            className="form-control"
                            required
                            value={form.roleTeacherAssistant}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="rolePrimaryTeacher" className="col-sm-4 col-form-label">Profesor primario *</label>
                    <div className="col-sm-8">
                        <input type="text" id="rolePrimaryTeacher" name="rolePrimaryTeacher"
                            className="form-control"
                            required
                            value={form.rolePrimaryTeacher}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ overflowY: 'auto', maxHeight: '100px', marginBottom: '10px', width: '100%'}}></div>
                    {/* <SaveBar
                        form="roles"
                        typeButton='button'
                        handleSave={handleSave}
                        viewSaveBtn={viewSaveBtn}
                        info={info}
                    /> */}
                </div>
            </form>
            {viewMessage}
            <ToastContainer />


            <BlackboardRolesAndUsersDisabled/>
        </div>
    )
}
export default LogFiles;