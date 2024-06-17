import React, { useEffect, useRef, useState } from 'react';
import { Form, FormGroup, Button, InputGroup, FormControl, Alert, Spinner } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { validateRut } from 'rutlib';
import { TagsInput } from "react-tag-input-component";
import { GetUsersNodes } from '../context/data/APIs';
import UserFormSupport from './UserFormSupport';
import ResultTable from './UserSupport/ResultTable';




const UsuariosCursosTest = () => {
    const [showTable, setShowtable] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [clearData, setClearData] = useState(false);
    const multiselectRef = useRef();


    const options = [
        { name: 'BB-2' },
        { name: 'MD-1' },
        { name: 'MD-2' },
        { name: 'MD-3' }
    ]
    const validationSchema = yup.object().shape({
        rut: yup.string().test(
            "test-ctype",
            "Debes ingresar un rut válido",
            (value) => validateRut(value)
        )
            .required('El RUT es requerido'),

        sociosIntegradores: yup.array().min(1, 'Debes seleccionar al menos un Socio Integrador'),
        periodos: yup.array().min(1, 'Debes agregar al menos un periodo'),
    });

    const formik = useFormik({
        initialValues: {
            rut: "",
            sociosIntegradores: [],
            periodos: []
        },
        validationSchema,
        onSubmit: async (values) => {
            setUsersData([])
            setShowAlert(false);
            setShowLoading(true);
            setShowtable(false);
            setShowUserForm(false);

            const sendData = {
                SocInteg: values.sociosIntegradores.join(', '),
                rut: values.rut,
                periodo: values.periodos.join(', ')
            }
            try {
                let userNodesResult = await GetUsersNodes(sendData);
                if (userNodesResult.statusCode === 200) {
                    setShowLoading(false);
                    setShowtable(true);
                    setUsersData(userNodesResult.body);
                    setShowUserForm(true);

                } else {
                    setShowAlert(true);
                    setShowLoading(false);
                    setShowUserForm(false)
                }
            } catch (error) {
                console.log('error', error)
            }


        }
    });

    useEffect(() => {
        if (clearData) {
            setShowtable(false);
            setShowUserForm(false);
            multiselectRef.current.resetSelectedValues();
            formik.resetForm();
            formik.setErrors({});
            setClearData(false);
        }
    }, [clearData]);



    return (
        <>
            <Form onSubmit={formik.handleSubmit} >
                <FormGroup className="mb-3">
                    <Form.Label>Rut</Form.Label>
                    <InputGroup>
                        <FormControl
                            placeholder="Ingresa el RUT"
                            name="rut"
                            value={formik.values.rut}
                            onChange={formik.handleChange}
                        />
                    </InputGroup>
                    {formik.errors.rut && <p className='text-danger'>{formik.errors.rut}</p>}
                </FormGroup>

                <FormGroup className="mb-3">
                    <Form.Label>Socios</Form.Label>
                    <Multiselect
                        ref={multiselectRef}
                        name="sociosIntegradores"
                        options={options}
                        onSelect={(selectedList, selectedItem) => {
                            formik.setFieldValue("sociosIntegradores", selectedList.map(item => item.name));
                        }}
                        onRemove={(selectedList, removedItem) => {
                            const updatedList = formik.values.sociosIntegradores.filter(item => item !== removedItem.name);
                            formik.setFieldValue("sociosIntegradores", updatedList);
                        }}
                        displayValue="name"
                    />
                    {formik.errors.sociosIntegradores && <p className='text-danger'>{formik.errors.sociosIntegradores}</p>}
                </FormGroup>

                <FormGroup className="mb-3">
                    <Form.Label>Periodos</Form.Label>
                    <TagsInput
                        value={formik.values.periodos}
                        onChange={(periodos) => formik.setFieldValue("periodos", periodos)}
                        name="periodos"
                        placeHolder="ej: 202325"
                    />
                    {formik.errors.periodos && <p className='text-danger'>{formik.errors.periodos}</p>}
                </FormGroup>
                {!showLoading ? <Button variant="primary" type="submit" className='mt-4'>
                    Buscar
                </Button> : <Spinner animation="border" variant="primary" />}

            </Form>
            {showAlert && <Alert className='mt-3' key={'warning'} variant={'warning'}>
                No existen datos para usuario o periodos
            </Alert>}
            {showTable && usersData &&
                <ResultTable usersData={usersData} rut={formik.values.rut} />
            }

            {showUserForm && <UserFormSupport usersData={usersData} rut={formik.values.rut} setClearData={setClearData} />}
        </>
    );
}

export default UsuariosCursosTest;
