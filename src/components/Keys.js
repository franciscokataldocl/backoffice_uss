import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Modal from 'react-bootstrap/Modal';
import { ToastContainer } from "react-toastify";

import AuthContext from "../context/authentication/AuthContext";
import { KeysColumns } from "./configurations/ColumnDTSetting";
import { JustData, SearchIn, buttonActions, rKeys, rSave } from "../businessRules/Keys";
import { Loading } from "./configurations/JsonDefault";
import Notify from "./Notification";
import { Message } from "./Message";
import ModalFooterButtons from "./ModalFooterButtons";


const title = 'LLAVES';

const Keys = () => {
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const [keysData, setKeysData] = useState([]);
    const [keysNew, setKeysNew] = useState(null);
    const [keysOld, setKeysOld] = useState(null);
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
            let keysResult = await rKeys({key: 'Keys', handlEdit:handlEdit, handlDelete:handlDelete});
            if (keysResult.statusCode === 200) {
                setKeysData(keysResult.body);
                setInfo(keysResult.info);
            } else {
                Notify({
                    props: {
                        message: keysResult.message,
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
        const getKeys = async () => {
            await LoadData();
        };
        getKeys();
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
        setKeysNew(null);
        setKeysOld(null);
        setEdit(false);
    }
    const handleNewPopup = () => {
        try{
            setKeysOld(null);
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

    const handleKeysChange = (e) => {
        try{
            const {name, value } = e.target;
            setKeysNew({
                ...keysNew,
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
    
    const handleKeysAdd = () => {
        try {
            if (document.getElementById("Keys").checkValidity()) {
                if (!SearchIn({ dataIn: keysData, searchValue: keysNew })) {
                    keysNew.actions = buttonActions({row: keysNew, handlEdit, handlDelete });    
                    if (edit) {
                        const updatedData = keysData.map(item =>
                            JSON.stringify(JustData(item)) === JSON.stringify(JustData(keysOld))  ? { ...keysNew } : item
                        );
                        setKeysData(updatedData);
                    } else {
                        setKeysData(prevKeysData => [...prevKeysData, keysNew]);
                    }    
                    handleClosePopup();
                    setViewSaveBtn(true);
                } else {
                    Notify({
                        props: {
                            message: `El la llave '${keysNew.key}' ya está en la lista`,
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
                if (keysData.length > 0){
                    showMessage ({props: Loading({title})});
                    const saveResult = await rSave({props:{
                            data: keysData,
                            user: user.person.name,
                            key: 'Keys'
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
            setKeysOld(edit);
            setKeysNew(edit)
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
            setKeysData((prevData) => {
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
                    columns={KeysColumns}
                    data={keysData}
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
                    <form id="Keys" onSubmit={handleSave}>
                        <div className="form-group row">
                        <label htmlFor="key" className="col-sm-4 col-form-label">Llave</label>
                            <div className="col-sm-8">
                                <input type="text" id="key" name="key"
                                    className="form-control"
                                    maxLength="100"
                                    required
                                    value={keysNew?.key??null}
                                    onChange={(e) => handleKeysChange(e)}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="value" className="col-sm-4 col-form-label">Valor</label>
                            <div className="col-sm-8">
                                <input type="text" id="value" name="value"
                                    className="form-control"
                                    maxLength="100"
                                    required
                                    value={keysNew?.value??null}
                                    onChange={(e) => handleKeysChange(e)}
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <ModalFooterButtons
                        handleSave={handleKeysAdd}
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
export default Keys;