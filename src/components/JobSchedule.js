import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ModalFooterButtons from './ModalFooterButtons';

const JobSchedule = ({modalData, cronJobSchedule, handleEdit, handleClosePopup}) => {
    const [minute, setMinute] = useState('*');
    const [hour, setHour] = useState('*');
    const [dayMonth, setDayMonth] = useState('*');
    const [month, setMonth] = useState('*');
    const [dayWeek, setDayWeek] = useState('*');

    useEffect(() => {
        const _schedule = cronJobSchedule.split('/').join('').split(' ');
        setMinute(_schedule[0]);
        setHour(_schedule[1]);
        setDayMonth(_schedule[2]);
        setMonth(_schedule[3]);
        setDayWeek(_schedule[4]);
    },[cronJobSchedule]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        switch (name){
            case 'minute': setMinute(value); break;
            case 'hour': setHour(value); break;
            case 'dayMonth': setDayMonth(value); break;
            case 'month': setMonth(value); break;
            case 'dayWeek': setDayWeek(value); break;
        }        
    }

    const handleLocalEdit = () => {
        const _schedule = `${minute} ${hour} ${dayMonth} ${month} ${dayWeek}`
        handleEdit(_schedule);
        handleClosePopup();
    }

    return (
        <Modal show={modalData.viewPopup} onHide={handleClosePopup} backdrop="static" dialogClassName={`modal-md`} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalData.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <section id="schedule">
                    <h3 className='alert alert-info'>Para representar todo, indicar con *
                        <br/> Ej.: Todas las *
                        <br/> Para indicar varios valores colocar separados por coma (,)
                        <br/> Ej.: Varias horas 0,10,18,20
                    </h3>
                    <div className="form-group row">
                        <label htmlFor="month" className="col-sm-6 col-form-label">En que mes</label>
                        <div className="col-sm-6">
                            <input type="text" id="month" name="month"
                                className="form-control"
                                value={month}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="dayMonth" className="col-sm-6 col-form-label">En que dia del mes</label>
                        <div className="col-sm-6">
                            <input type="text" id="dayMonth" name="dayMonth"
                                className="form-control"
                                value={dayMonth}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="dayWeek" className="col-sm-6 col-form-label">En que semana</label>
                        <div className="col-sm-6">
                            <input type="text" id="dayWeek" name="dayWeek"
                                className="form-control"
                                value={dayWeek}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="hour" className="col-sm-6 col-form-label">A que hora</label>
                        <div className="col-sm-6">
                            <input type="text" id="hour" name="hour"
                                className="form-control"
                                value={hour}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="minute" className="col-sm-6 col-form-label">En que minuto</label>
                        <div className="col-sm-6">
                            <input type="text" id="minute" name="minute"
                                className="form-control"
                                value={minute}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>
            </Modal.Body>
            <Modal.Footer>
                <ModalFooterButtons
                    handleSave={handleLocalEdit}
                    isSave={false}
                    title='Editar'
                    handleClose={handleClosePopup}
                />
            </Modal.Footer>
        </Modal>
    )
}
export default JobSchedule;