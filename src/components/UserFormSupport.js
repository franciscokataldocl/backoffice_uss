import React, { useState, useEffect, useContext } from 'react';
import { Form, FormGroup, Button, InputGroup, FormControl } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { rSave } from '../businessRules/UsersSoporte';


import Modal from 'react-bootstrap/Modal';
import AuthContext from '../context/authentication/AuthContext';

const UserFormSupport = ({ usersData, rut, setClearData }) => {
    const { user } = useContext(AuthContext);
    const [userIsStored, setUserIsStored] = useState(false);

    const validationSchema = yup.object().shape({
        nombre: yup
            .string()
            .min(3, 'Debes ingresar al menos 3 caracteres')
            .required('El nombre es obligatorio'),
        apellidoMaterno: yup
            .string()
            .min(3, 'Debes ingresar al menos 3 caracteres')
            .required('El apellido materno es obligatorio'),
        apellidoPaterno: yup
            .string()
            .min(3, 'Debes ingresar al menos 3 caracteres')
            .required('El apellido paterno es obligatorio'),
        email: yup
            .string()
            .email('El email no es válido')
            .required('El email es obligatorio')

    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellidoMaterno: '',
            apellidoPaterno: '',
            email: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            let listOfNodes = [];
            usersData.map(node => {
                const value = Object.values(node)[0]
                listOfNodes.push(value)
            });


            const newUserNodes = {
                "EXTERNAL_PERSON_KEY": `USS${rut}`,
                "USER_ID": `${values.email}`,
                "PASSWD": null,
                "FIRSTNAME": `${values.nombre}`,
                "LASTNAME": `${values.nombre}/${values.apellidoPaterno}`,
                "OTHERNAME": `${values.nombre} ${values.apellidoPaterno} ${values.apellidoMaterno}`,
                "EMAIL": `${values.email}`,
                "INSTITUTION_ROLE": "USS-S-S",
                "M_PHONE": null,
                "CITY": null,
                "COUNTRY": null,
                "COMPANY": null,
                "DEPARTMENT": null,
                "JOB_TITLE": null,
                "B_PHONE_1": null,
                "NODES": listOfNodes
            };

            const saveData = await rSave(newUserNodes, user);
            if (saveData.statusCode == 200) {
                setUserIsStored(true)
            }


        }
    });

    const closeModal = () => {
        setClearData(true)
        setUserIsStored(false)
    }

    return (
        <>

            <h3 className='mb-3'>Agregar nuevo usuario</h3>
            <Form onSubmit={formik.handleSubmit} className='pb-5 mb-5'>
                <FormGroup className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <InputGroup>
                        <FormControl
                            placeholder="Ingresa nombre"
                            name="nombre"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.nombre && <p className='text-danger'>{formik.errors.nombre}</p>}
                </FormGroup>
                <FormGroup className="mb-3">
                    <Form.Label>Apellido paterno</Form.Label>
                    <InputGroup>
                        <FormControl
                            placeholder="Ingresa apellido paterno"
                            name="apellidoPaterno"
                            value={formik.values.apellidoPaterno}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.apellidoPaterno && <p className='text-danger'>{formik.errors.apellidoPaterno}</p>}
                </FormGroup>
                <FormGroup className="mb-3">
                    <Form.Label>Apellido materno</Form.Label>
                    <InputGroup>
                        <FormControl
                            placeholder="Ingresa apellido materno"
                            name="apellidoMaterno"
                            value={formik.values.apellidoMaterno}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.apellidoMaterno && <p className='text-danger'>{formik.errors.apellidoMaterno}</p>}
                </FormGroup>

                <FormGroup className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                        <FormControl
                            placeholder="Ingresa Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.email && <p className='text-danger'>{formik.errors.email}</p>}
                </FormGroup>
                <Button variant="success" type="submit" className='mt-4'>
                    Guardar
                </Button>

            </Form>
            {userIsStored &&
                <Modal show={userIsStored} onHide={closeModal}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>Usuario almacenado correctamente</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Terminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>

    )
}

export default UserFormSupport