import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Modal from 'react-bootstrap/Modal';

import AuthContext from "../context/authentication/AuthContext";
import { Message } from "./Message";
import Notify from "./Notification";
import { ToastContainer } from "react-toastify";
import { Loading } from "./configurations/JsonDefault";
import { EmailsColumns } from "./configurations/ColumnDTSetting.js";
import { SearchIn, buttonActions, rMail, rSave } from "../businessRules/Mails.js";
import { IsMail } from "../utils/Functions.js";
import ModalFooterButtons from "./ModalFooterButtons.js";

const title = 'MAILS';
const Mails = () => {
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const [mailData, setMailData] = useState([]);
    const [mailNew, setMailNew] = useState(null);
    const [editMail, setEditMail] = useState({old:'',new:''});
    const [edit, setEdit] = useState(false);
    const { user } = useContext(AuthContext);
    const [info, setInfo] = useState({});
    const [viewMessage, setViewMessage] = useState(null);
    const [modalData, setModalData] = useState({
        viewPopup: false,
        title: null
    });

    useEffect(() => {
        const getMails = async () => {
            await LoadData();
        };
        getMails();
    }, []);

    const LoadData = async () => {
        try{
            showMessage ({props: Loading({title})});
            let mailResult = await rMail({key: 'mailTo', handlEdit:handlEdit, handlDelete:handlDelete});
            if (mailResult.statusCode === 200) {
                setMailData(mailResult.body);
                setInfo(mailResult.info);
            } else {
                Notify({
                    props: {
                        message: mailResult.message,
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
        setEdit(false);
        setEditMail({old:'',new:''});
    }
    const handleNewPopup = async (row) => {
        setModalData({
            viewPopup: true,
            title: title + ' (Nuevo)'
        });
        setEditMail({old:'',new:''});
    };
    const handleMailChange = (e) => {
        try{
            const {name, value } = e.target;
            setMailNew({
                ...mailNew,
                [name]: value,
                actions: buttonActions({mail:value, handlEdit, handlDelete})
            });
            setEditMail({old:editMail.old, new:value});
        }catch(error){
            Notify({
                props: {
                message: error.message,
                type: 'warning'
                }
            });
        }
    }
    const handleMailAdd = () => {
        try{
            if (mailNew && Object.keys(mailNew).length > 0) {
                if (!SearchIn({dataIn: mailData, searchValue: mailNew.mail})){
                    if (IsMail(mailNew.mail)) {
                        if (edit){
                            const updatedData = mailData.map(item =>
                                item.mail === editMail.old ? { ...mailNew } : item
                            );
                            setMailData(updatedData)
                        }else{
                            setMailData([...mailData, mailNew]);
                        }
                        setMailNew(null);
                        setEditMail({old:'',new:''});
                        setEdit(false);
                        handleClosePopup();
                        setViewSaveBtn(true);
                    } else {
                        Notify({
                            props: {
                            message: `La dirección de correo electrónico '${mailNew.mail}' no es valida` ,
                            type: 'warning'
                            }
                        });
                    }
                }else{
                    Notify({
                        props: {
                        message: `La dirección de correo electrónico '${mailNew.mail}' ya esta en la lista` ,
                        type: 'warning'
                        }
                    });
                }              
            }
        }catch(error){
            Notify({
                props: {
                message: error.message,
                type: 'warning'
                }
            });
        }
    }
    const handleSave = async () => {
        const saveData = async () => {
            try{
                if (mailData.length > 0){
                    showMessage ({props: Loading({title})});
                    const saveResult = await rSave({props:{
                            data: mailData,
                            user: user.person.name,
                            key: 'mailTo'
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

    const handlEdit = (mail) => {
        try{
            setEditMail({old:mail,new:mail});
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
    
    const handlDelete = (mail) => {
        try {
            setMailData((prevData) => {
                const newData = prevData.filter((row) => row.mail !== mail);
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
                    columns={EmailsColumns}
                    data={mailData}
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
                    <section id="details">
                        <div className="form-group row">
                            <label htmlFor="mail" className="col-sm-4 col-form-label">Usuario (mail)</label>
                            <div className="col-sm-8">
                                <input type="mail" id="mail" name="mail"
                                    className="form-control"
                                    maxLength="100"
                                    required
                                    value={editMail.new}
                                    onChange={(e) => handleMailChange(e)}
                                />
                            </div>
                        </div>
                    </section>
                </Modal.Body>
                <Modal.Footer>
                    <ModalFooterButtons
                        handleSave={handleMailAdd}
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
export default Mails;