import React, { useContext, useEffect, useState } from 'react';
import { rPeriodos, rSave } from '../businessRules/Periodo';
import Notify from '../components/Notification';
import { ToastContainer } from 'react-toastify';
import AuthContext from '../context/authentication/AuthContext';
import { Message } from './Message';
import { Loading } from './configurations/JsonDefault';
import Badge from 'react-bootstrap/Badge';

const title = 'PERIODOS';

const Periodos = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [viewSaveBtn, setViewSaveBtn] = useState(false);
    const { user } = useContext(AuthContext);
    const [periodos, setPeriodos] = useState([]);
    const [periodosActualYear, setPeriodosActualYear] = useState([]);
    const [info, setInfo] = useState({});
    const [viewMessage, setViewMessage] = useState(null);


    const handleMessageClosePopup = () => {
        setViewMessage(null);
    }
    const showMessage = async({props}) => {
        setViewMessage(await Message({props}));
    }

const initYear = 201800;
const periodsToShow= ['00','10','15','20','25'];



    useEffect(() => {
        const getPeriodos = async () => {
            try{
                showMessage ({props: Loading({title})});
                let periodoResult = await rPeriodos({key: 'periodos', startCode: `000000` });
                if (periodoResult.statusCode === 200) {
                    //recorrer periodos obtenidos
                    periodoResult.body.map(periodo =>{
                        //si el periodo es mayor o igual al año actual
                        if(Number(periodo.code) >= initYear){
                            //si el periodo empieza por el año actual lo almacenamos separado en el estado para mostrar solo el año actual
                            if(periodo.code.startsWith(currentYear)){
                                //filtramos los periodos que contengan los periodos aceptados para mostrar ['00','10','15','20','25']; esto, segun historia
                                periodsToShow.map(acceptPeriod =>{
                                    if(periodo.code.toString().endsWith(acceptPeriod)){
                                        //si cumple los 3 criterios, lo añadimos al estado
                                        setPeriodosActualYear(oldArray => [...oldArray, periodo]);
                                    }
                                })
                                
                            } else{
                                //caso contrario. si periodo no inicia con el año actual
                                //cortamos el periodo para obtener el año y verificamos
                                if(Number(('' + periodo.code).slice(0, -2)) <= currentYear){
                                    //si el año del periodo es menor o igual al año actual
                                    //lo pasamos por el filtro de periodos aceptaos segun historia
                                    periodsToShow.map(acceptPeriod =>{
                                        //y almacenamos en el arreglo de periodos que no son el año atual,. para asi tenerlos separados
                                        if(periodo.code.toString().endsWith(acceptPeriod)){
                                            setPeriodos(oldArray => [...oldArray, periodo]);
                                        }
                                    })
                                }
                            }
                            
                        }
                    })
                    setInfo(periodoResult.info);

                    // setPeriodos(periodoResult.body);
                    // setInfo(periodoResult.info);
                } else {
                    Notify({
                    props: {
                        message: periodoResult.message,
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
            getPeriodos();
    }, []);

    const handleCheck = (item) => {
        setPeriodos((prevPeriodos) =>
            prevPeriodos.map((periodo) =>
            periodo.code === item.code ? { ...periodo, isChecked: !periodo.isChecked } : periodo
            )
        );
        setViewSaveBtn(true);
    };

    const handleCheckActual = (item) => {
        setPeriodosActualYear((prevPeriodos) =>
            prevPeriodos.map((periodo) =>
            periodo.code === item.code ? { ...periodo, isChecked: !periodo.isChecked } : periodo
            )
        );
        setViewSaveBtn(true);
    };


    const handleSave = () => {
        const selectedItems = periodos.filter((item) => item.isChecked).map((item) => item.code);
        const selectedItemsActual = periodosActualYear.filter((item) => item.isChecked).map((item) => item.code);

        const selectedItemsFinal = selectedItems.concat(selectedItemsActual);
                const saveData = async () => {
        try{
            showMessage ({props: Loading({title})});
            const saveResult = await rSave({props:{
                    value: selectedItemsFinal,
                    user: user.person.name,
                    key: 'periodos',
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
        <>
        <div className="alert alert-primary">
        <h3>Periodos seleccionados</h3>
            {periodos.map(item =>(
                item.isChecked && <Badge bg="secondary" className="m-2">{item.code}</Badge>
                
            ))}
            {periodosActualYear.map(item =>(
                item.isChecked && <Badge bg="secondary" className="m-2">{item.code}</Badge>
                
            ))}
        </div>
        <div  style={{background: "#ccede8", padding: '3%', borderRadius: '10px', marginBottom: '5%'}}>
            <h3>Año en curso {currentYear}</h3>
            {periodosActualYear && periodosActualYear.map((item)=>(
            <div style={{ maxHeight: '650px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: '1', overflowY: 'auto' }}>
            <div key={item.code}>
                    <label htmlFor={`checkbox-${item.code}`}>
                        <input
                        id={`checkbox-${item.code}`}
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => handleCheckActual(item)}
                        />
                        <span> {`${item.code} - ${item.title}`}</span>
                    </label>
                    </div>
                
                </div>
                </div>
            ))}



        </div>
         <div>
         <h3>Periodos anteriores</h3>
            {((periodos ?? []).length > 0) ? (
            <div style={{ maxHeight: '650px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: '1', overflowY: 'auto' }}>
                {periodos.map((item) => (
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
                    {/* <div style={{ overflowY: 'auto', maxHeight: '100px', marginBottom: '10px', width: '100%', display: (periodos.filter((item) => item.isChecked).length > 0)? 'flex':'none', alignItems: 'flex-start' }} className='alert alert-info'>
                        <span>{periodos.filter((item) => item.isChecked).map(p=>(p.code)).join(' | ')}</span>
                        <span>{periodosActualYear.filter((item) => item.isChecked).map(p=>(p.code)).join(' | ')}</span>
                    </div> */}
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
        </>
       
    );
};

export default Periodos;
