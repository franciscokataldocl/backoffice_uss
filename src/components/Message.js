import React from 'react';
import Modal from 'react-bootstrap/Modal';
import loading from '../assets/images/loading.gif';
export const Message = async ({props}) => {
    try{
        let style = 'alert alert-';
        switch (props.statusCode){
            case 200:
                style += 'success';
                break;
            case 500:
                style += 'danger';
                break;
            case 1:
                style += 'info';
                break;
            default:
                style += 'warning';
                break;
        }
        return (
            <Modal show={props.onView} onHide={props.onHide} backdrop="static" dialogClassName={`modal-${props.modalSize}`} centered>
                {props.onHide &&
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                }
                <Modal.Body >
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-md-12 text-center">
                            {props.loading && (
                            <img
                                alt="Sin imagen"
                                src={loading}
                                style={{ display: 'block', margin: '0 auto', maxWidth: '150px', maxHeight: '150px' }}
                            />
                            )}
                        </div>
                        <div className={`col-md-12 text-${props.loading ? 'center' : 'left'}`}>
                            <div className={style} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                {props.message}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }catch(error){
        return (
            <div className='alert alert-danger'>{error}</div>
        )
    }
}