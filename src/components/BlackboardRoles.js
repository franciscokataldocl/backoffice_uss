import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Modal from 'react-bootstrap/Modal';
import { ToastContainer } from "react-toastify";

import AuthContext from "../context/authentication/AuthContext";
import { BlackboardRolesColumns } from "./configurations/ColumnDTSetting";
import { JustData, SearchIn, buttonActions, rRoles, rSave } from "../businessRules/BlackboardRoles";
import { Loading } from "./configurations/JsonDefault";
import Notify from "./Notification";
import { Message } from "./Message";
import { AdministratorRoles } from "../businessRules/AdministratorRoles";
import ModalFooterButtons from "./ModalFooterButtons";


const title = 'ROLES BLACKBOARD';

const BlackboardRoles = () => {
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const [rolesAdmin, setRolesAdmin] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [rolesNew, setRolesNew] = useState(null);
    const [rolesOld, setRolesOld] = useState(null);
    const [edit, setEdit] = useState(false);
    const { user } = useContext(AuthContext);
    const [info, setInfo] = useState({});
    const [viewMessage, setViewMessage] = useState(null);
    const [modalData, setModalData] = useState({
        viewPopup: false,
        title: null
    });

    const LoadData = async () => {
        try{
            showMessage ({props: Loading({title})});
            let rolesAdminResult = await AdministratorRoles({key: 'blackboardRoles', handlEdit:handlEdit, handlDelete:handlDelete});
            if (rolesAdminResult.statusCode === 200) {
                setRolesAdmin(rolesAdminResult.body);
            }
            let rolesResult = await rRoles({key: 'blackboardRoles', handlEdit:handlEdit, handlDelete:handlDelete});
            if (rolesResult.statusCode === 200) {
                setRolesData(rolesResult.body);
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
        }finally{
            handleMessageClosePopup();
        }
    }

    useEffect(() => {
        const getRoles = async () => {
            await LoadData();
        };
        getRoles();
    }, []);

    const handleRefresh = async() => {
        await LoadData();
        setViewSaveBtn(false);
    }
    const handleMessageClosePopup = () => {
        setViewMessage(null);
    }
    const showMessage = async({props}) => {
        setViewMessage(await Message({props}));
    }

    const handleClosePopup = () => {
        setModalData({
            viewPopup: false,
            title: title
          });
        setRolesNew(null);
        setRolesOld(null);
        setEdit(false);
    }
    const handleNewPopup = async () => {
        try{
            setRolesOld(null);
            setModalData({
                viewPopup: true,
                title: title + ' (Nuevo)'
            });
        }catch(error){
            Notify({
                props: {
                message: error.message,
                type: 'warning'
                }
            });
        }
    };

    const handleRolesChange = (e) => {
        try{
            const {name, value } = e.target;
            setRolesNew({
                ...rolesNew,
                [name]: value
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
    
    const handleRolesAdd = () => {
        try {
            if (document.getElementById("AdminRoles").checkValidity()) {
                if (!SearchIn({ dataIn: rolesData, searchValue: rolesNew })) {
                    rolesNew.actions = buttonActions({row: rolesNew, handlEdit, handlDelete });    
                    if (edit) {
                        const updatedData = rolesData.map(item =>
                            JSON.stringify(JustData(item)) === JSON.stringify(JustData(rolesOld))  ? { ...rolesNew } : item
                        );
                        setRolesData(updatedData);
                    } else {
                        setRolesData(prevRolesData => [...prevRolesData, rolesNew]);
                    }
    
                    handleClosePopup();
                    setViewSaveBtn(true);
                } else {
                    Notify({
                        props: {
                            message: `El rol '${rolesNew.equivalente}' ya está en la lista`,
                            type: 'warning'
                        }
                    });
                }
            } else {
                Notify({
                    props: {
                        message: 'Todos los campos son requeridos',
                        type: 'warning'
                    }
                });
            }
        } catch (error) {
            Notify({
                props: {
                    message: error.message,
                    type: 'warning'
                }
            });
        }
    };
    

    const handleSave = async () => {
        const saveData = async () => {
            try{
                if (rolesData.length > 0){
                    showMessage ({props: Loading({title})});
                    const saveResult = await rSave({props:{
                            data: rolesData,
                            user: user.person.name,
                            key: 'blackboardRoles'
                        }
                    });
                    if (saveResult.statusCode===200) setViewSaveBtn(false);
                    Notify({
                        props: {
                            message: saveResult?.body??saveResult?.message??'Guardado',
                            type: (saveResult.statusCode !== 200)? 'warning':'success'
                        }
                    });
                }else{
                    Notify({
                        props: {
                        message: 'Sin elementos para guardar',
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
        saveData();
    }

    const handlEdit = (edit) => {
        try{
            setRolesOld(edit);
            setRolesNew(edit)
            setEdit(true);
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
    
    const handlDelete = (del) => {
        try {
            setRolesData((prevData) => {
                const newData = prevData.filter((row) => 
                JSON.stringify(JustData(row)) !== JSON.stringify(JustData(del)));
                return newData;
            });
            setViewSaveBtn(true);
        } catch (error) {
            Notify({
                props: {
                    message: error.message,
                    type: 'warning',
                },
            });
        }
    };

    return (
        <div className="col-sm-11">
            <div>
                <DataTable
                    columns={BlackboardRolesColumns}
                    data={rolesData}
                    pagination
                    className="custom-datatable"
                />
            </div>
            <div className="btn-group">
                <button
                    className="btn btn-warning"
                    onClick={handleNewPopup}
                >
                    <span className="fa fa-user"></span> Agregar
                </button>
                <button
                    className="btn btn-success"
                    onClick={handleRefresh}
                >
                    <span className="fa fa-refresh"></span>
                </button>
            </div>
            <Modal show={modalData.viewPopup} onHide={handleClosePopup} backdrop="static" dialogClassName={`modal-md`} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <form id="AdminRoles" onSubmit={handleSave}>
                        <div className="form-group row">
                            <label htmlFor="adminCode" className="col-sm-4 col-form-label">Roles</label>
                            <div className="col-sm-8">
                                <select className="form-select" id="adminCode" name="adminCode"
                                    required
                                    value={rolesNew?.adminCode??""}
                                    onChange={(e) => handleRolesChange(e)}
                                >
                                    <option value=""> Seleccione una Opción</option>
                                    {rolesAdmin.map((row) => (
                                        <option key={row.code} value={row.code}>
                                            {row.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="equivalente" className="col-sm-4 col-form-label">Equivalente</label>
                            <div className="col-sm-8">
                                <input type="text" id="equivalente" name="equivalente"
                                    className="form-control"
                                    maxLength="100"
                                    required
                                    value={rolesNew?.equivalente??null}
                                    onChange={(e) => handleRolesChange(e)}
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <ModalFooterButtons
                        handleSave={handleRolesAdd}
                        isSave={!edit}
                        title={!edit? 'Agregar':'Editar'}
                        handleClose={handleClosePopup}
                    />
                </Modal.Footer>
            </Modal>
            <hr />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflowY: 'auto', maxHeight: '100px', marginBottom: '10px', width: '100%'}}></div>
                {/* <SaveBar
                    typeButton='button'
                    handleSave={handleSave}
                    viewSaveBtn={viewSaveBtn}
                    info={info}
                /> */}
            </div>       
            {viewMessage}
            <ToastContainer />
        </div>
    )
}
export default BlackboardRoles;