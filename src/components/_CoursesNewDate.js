import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/authentication/AuthContext';
import { rSave } from '../businessRules/CousersDates';
import { GetCoursesByNrc } from '../context/data/APIs';
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { addDays } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { Form, FormGroup, Button, InputGroup, FormControl, Spinner, Container, Alert } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import { useFormik } from 'formik';
import * as yup from 'yup';

const CoursesNewDate = () => {
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState();
  const [nrc, setNrc] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [newStartDate, setNewStartDate] = useState();
  const [newEndDate, setNewEndDate] = useState();
  const [showLoading, setShowLoading] = useState(false)
  const [dataIsStored, setDataIsStored] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showNoData, setShowNoData] = useState(false);
  registerLocale("es", es);

  const validationSchema = yup.object().shape({
    nrc: yup
      .string()
      .min(4, 'Debes ingresar al menos 4 caracteres')
      .required('El nrc es obligatorio'),
    periodo: yup
      .string()
      .min(4, 'Debes ingresar al menos 4 caracteres')
      .required('El periodo es obligatorio')

  });

  const formik = useFormik({
    initialValues: {
      nrc: '',
      periodo: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setCourse('')
      setShowNoData(false);
      setShowLoading(true);
      const result = await GetCoursesByNrc(values);

      if (result.statusCode == 200 && result.body.length > 0) {
        setNrc(values.nrc)
        setPeriodo(values.periodo)
        setCourse(result.body[0])
        setShowLoading(false);
      } else {
        setShowNoData(true);
        setShowLoading(false);
      }

    }
  });


  const stringToDateFront = (stringDate) => {
    const dateString = stringDate;
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const fecha = new Date(`${year}/${month}/${day}`);
    return fecha.toLocaleDateString();
  }

  useEffect(() => {
    if (newStartDate !== undefined || newEndDate !== undefined) {
      setShowSaveButton(true);
    }

  }, [newStartDate, newEndDate])


  const closeModal = () => {
    setDataIsStored(false);
    setCourse('');
    formik.resetForm();
    formik.setErrors({});
    setNewStartDate('')
    setNewEndDate('')
  }


  const storeNewCourse = async (start, end) => {
    const newCourse = {
      CRN: nrc,
      PERIOD: periodo,
      START_DATE: course.START_DATE,
      END_DATE: course.END_DATE,
      UPDATED_START_DATE: start === '' || start === undefined ? course.START_DATE : start,
      UPDATED_END_DATE: end === '' || end === undefined ? course.END_DATE : end
    };
    try {
      const saveData = await rSave( {props:{
        data: newCourse,
        user: user.person.name,
    }
});
      if (saveData.statusCode === 200) {
        setDataIsStored(true)
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Error - ${error}`
    };
    }
  }



  const dateToString = (fecha) => {
    var year = fecha.getFullYear();
    var month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    var day = fecha.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }


  const newDates = () => {
    const startDate = newStartDate === '' || newStartDate === undefined ? course.START_DATE : dateToString(newStartDate);
    const endDate = newEndDate === '' || newEndDate === undefined ? course.END_DATE : dateToString(newEndDate);
    storeNewCourse(startDate, endDate)
  }

  return (
    <>
      {dataIsStored &&
        <Modal show={dataIsStored} onHide={closeModal}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>Fechas de inicio y cierre almacenadas correctamente</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Terminar
            </Button>
          </Modal.Footer>
        </Modal>
      }
      <h3 className='mb-3'>Buscar un curso</h3>
      <Form onSubmit={formik.handleSubmit} className='pb-5 mb-5'>
        <FormGroup className="mb-3">
          <Form.Label>NRC</Form.Label>
          <InputGroup>
            <FormControl
              placeholder="Ingresa nrc ej : 5455"
              name="nrc"
              value={formik.values.nrc}
              onChange={formik.handleChange}
            />
          </InputGroup>
          {formik.errors.nrc && <p className='text-danger'>{formik.errors.nrc}</p>}
        </FormGroup>
        <FormGroup className="mb-3">
          <Form.Label>Periodo</Form.Label>
          <InputGroup>
            <FormControl
              placeholder="Ingresa periodo ej: 202315"
              name="periodo"
              value={formik.values.periodo}
              onChange={formik.handleChange}
            />
          </InputGroup>
          {formik.errors.periodo && <p className='text-danger'>{formik.errors.periodo}</p>}
        </FormGroup>

        {!showLoading ? <Button variant="primary" type="submit" className='mt-4'>
          Buscar
        </Button> : <Spinner animation="border" variant="primary" />}

      </Form>

      {showNoData && <Alert className='mt-3' key={'warning'} variant={'warning'}>
        No existen datos para NRC o PERIODO
      </Alert>}
      {course &&
        <>
          <h3 className='mb-3'>Resultado de búsqueda</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>id</th>
                <th>Fecha inicio</th>
                <th>Fecha término</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {course.COURSE_ID}
                </td>
                <td>

                  <div className='original-date'>
                    <small className='small-font'>Fecha inicio: </small>
                    <small className='small-font-strong'>{stringToDateFront(course.START_DATE)}</small>
                  </div>
                  <div className='datepicker-container'>
                    <small className='small-font'>Nueva fecha de inicio: </small>
                    <DatePicker
                      className='datepicker'
                      locale="es"
                      showIcon
                      dateFormat="dd-MM-yyyy"

                      selected={newStartDate}
                      minDate={(new Date())}
                      startDate={(new Date())}
                      onChange={(date) => setNewStartDate(date)}
                    />
                  </div>
                </td>
                <td>
                  <div className='original-date'>
                    <small className='small-font'>Fecha término: </small>
                    <small className='small-font-strong'>{stringToDateFront(course.END_DATE)}</small>
                  </div>

                  <div className='datepicker-container'>
                    <small className='small-font'>Nueva fecha de término: </small>
                    <DatePicker
                      locale="es"
                      showIcon
                      dateFormat="dd-MM-yyyy"
                      selected={newEndDate}
                      minDate={addDays(new Date(), 1)}
                      startDate={(new Date())}
                      onChange={(date) => setNewEndDate(date)}
                    />
                  </div>

                </td>
              </tr>

            </tbody>
          </Table>
          <Container className='container-button-table'>
            {showSaveButton && <Button onClick={newDates} variant="primary" type="submit" style={{ marginTop: '10px' }}>Guardar</Button>}

          </Container>
        </>
      }
    </>
  )
}

export default CoursesNewDate