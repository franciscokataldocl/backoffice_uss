import { useContext, useEffect, useState } from "react";
import { Message } from "./Message";
import AuthContext from "../context/authentication/AuthContext";
import { rIntegrator, rSave } from "../businessRules/Integrator";
import Notify from "./Notification";
import { Loading } from "./configurations/JsonDefault";
import { ToastContainer } from "react-toastify";

const title = 'INTEGRADORES';

const Integrator = () => {
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const { user } = useContext(AuthContext);
    const [integrators, setIntegrators] = useState([]);
    const [info, setInfo] = useState({});
    const [viewMessage, setViewMessage] = useState(null);

    const handleMessageClosePopup = () => {
        setViewMessage(null);
    }
    const showMessage = async({props}) => {
        setViewMessage(await Message({props}));
    }
    useEffect(() => {
        const GetIntegrators = async () => {
            try{
                showMessage ({props: Loading({title})});
                let integratorResult = await rIntegrator({key: 'socioIntegrador'});
                if (integratorResult.statusCode === 200) {
                    setIntegrators(integratorResult.body);
                    setInfo(integratorResult.info);
                } else {
                    Notify({
                        props: {
                            message: integratorResult.message,
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
            GetIntegrators();
    }, []);

    const handleCheck = (item) => {
        setIntegrators((prevIntegrator) =>
            prevIntegrator.map((integrator) =>
            integrator.code === item.code ? { ...integrator, isChecked: !integrator.isChecked } : integrator
            )
        );
        setViewSaveBtn(true);
    };

    const handleSave = () => {
        const selectedItems = integrators.filter((item) => item.isChecked).map((item) => item.code);
        const saveData = async () => {
            try{
                showMessage ({props: Loading({title})});
                const saveResult = await rSave({props:{
                        value: selectedItems,
                        user: user.person.name,
                        key: 'socioIntegrador',
                    }
                });
                if (saveResult.statusCode===200) setViewSaveBtn(false);
                Notify({
                    props: {
                        message: saveResult?.body??saveResult?.message??'Guardado',
                        type: (saveResult.statusCode !== 200)? 'warning':'success'
                    }
                });
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
    };

    return (
        <div>
            {((integrators ?? []).length > 0) ? (
            <div style={{ maxHeight: '650px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: '1', overflowY: 'auto' }}>
                {integrators.map((item) => (
                    <div key={item.code}>
                    <label htmlFor={`checkbox-${item.code}`}>
                        <input
                        id={`checkbox-${item.code}`}
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => handleCheck(item)}
                        />
                        <span> {`${item.code} - ${item.title}`}</span>
                    </label>
                    </div>
                ))}
                </div>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflowY: 'auto', maxHeight: '100px', marginBottom: '10px', width: '100%', display: (integrators.filter((item) => item.isChecked).length > 0)? 'flex':'none', alignItems: 'flex-start' }} className='alert alert-info'>
                    <span>{integrators.filter((item) => item.isChecked).map(p=>(p.code)).join('|')}</span>
                </div>
                {/* <SaveBar
                    form={null}
                    handleSave={handleSave}
                    viewSaveBtn={viewSaveBtn}
                    info={info}
                /> */}
                </div>
            </div>
            ) : (
            <div className='alert alert-warning'> No se encontraron periodos en el sistema</div>
            )}
            {viewMessage}
            <ToastContainer />
        </div>
    );
}
export default Integrator;