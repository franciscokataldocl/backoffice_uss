import React, { useEffect, useState } from 'react';
import { s3JsonFile } from '../context/data/APIs';
import { Form, FormGroup, Button, Spinner} from 'react-bootstrap';
import { ToastContainer } from "react-toastify";
import Notify from './Notification';
import { useFormik } from 'formik';
import * as yup from 'yup';


const CoursesNewDate = () => {
  const [dates, setDates] = useState(null);
  const [loading, setLoading] = useState(false);
  const valores = Array.from({ length: 10 }, (_, i) => i + 1);

  const getDates = async () => {
    let s3fileResult = await s3JsonFile({
      props: {
        bucket: process.env.REACT_APP_BUCKET,
        fileName: process.env.REACT_APP_FILENAME,
        action: 'read'
      }
    });

    const inicio = s3fileResult.body.updatedDate.value[0];
    const termino = s3fileResult.body.updatedDate.value[1];
    setDates({
      fechaInicio: Number(inicio),
      fechaTermino: Number(termino)
    });
  };
  
  useEffect(() => {
    getDates();
  }, []);

  const validationSchema = yup.object().shape({
    fechaInicio: yup
      .number()
      .min(1, 'El número debe estar entre 1 y 10')
      .max(10, 'El número debe estar entre 1 y 10'),
    fechaTermino: yup
      .number()
      .min(1, 'El número debe estar entre 1 y 10')
      .max(10, 'El número debe estar entre 1 y 10')
  });

  const formik = useFormik({
    initialValues: {
      fechaInicio: dates ? dates.fechaInicio : '',
      fechaTermino: dates ? dates.fechaTermino : ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      const props = {
        keys: [
            {
                key: 'updatedDate',
                value: Object.values(values),
            }
        ],
        action:'write',
        bucket:process.env.REACT_APP_BUCKET,
        fileName:process.env.REACT_APP_FILENAME,
        user: 'francisco cataldo'
    }

    const saveResult = await s3JsonFile({props});
    if(saveResult.statusCode === 200){
      setLoading(false);
      Notify({
        props: {
            message: `Fechas modificadas correctamente (fecha inicio: ${values.fechaInicio}, fecha termino: ${values.fechaTermino})`,
            type: 'success'
        }
    });
    }else{
      Notify({
        props: {
            message: `Error al almacenar fecha de inicio y fecha de término`,
            type: 'warning'
        }
    });
    }


    }
  });

  return (
    <>
      <h3 className='mb-3'>Modificar fechas cursos</h3>
      {dates && (
        <Form onSubmit={formik.handleSubmit} className='pb-5 mb-5'>
          <FormGroup className="mb-3">
            <Form.Label>Fecha inicio</Form.Label>
            <Form.Select
              value={formik.values.fechaInicio}
              name="fechaInicio"
              onChange={formik.handleChange}
            >
              {valores.map((numero) => (
                <option key={numero} value={numero}>{numero}</option>
              ))}
            </Form.Select>
            {formik.errors.fechaInicio && <p className='text-danger'>{formik.errors.fechaInicio}</p>}
          </FormGroup>
          <FormGroup className="mb-3">
            <Form.Label>Fecha término</Form.Label>
            <Form.Select
              value={formik.values.fechaTermino}
              name="fechaTermino"
              onChange={formik.handleChange}
            >
              {valores.map((numero) => (
                <option key={numero} value={numero}>{numero}</option>
              ))}
            </Form.Select>
            {formik.errors.fechaTermino && <p className='text-danger'>{formik.errors.fechaTermino}</p>}
          </FormGroup>
          {!loading ? <Button variant="primary" type="submit" className='mt-4'>Guardar</Button> 
          : <Spinner animation="border" variant="primary" />}
        </Form>
      )}
      <ToastContainer/>
    </>
  )
}

export default CoursesNewDate