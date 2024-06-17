import { useFormik } from "formik";
import {
  Form,
  FormGroup,
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  FormSelect,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  createUserBlackboard,
  getInstitutionRolesApi,
  validUserBlackBoard,
} from "../../context/data/APIs";
import { useEffect, useState } from "react";
import Notify from "../Notification";
import { ToastContainer } from "react-toastify";
import { IsMail } from "../../utils/Functions";

import { systemRoles } from "../../server/constantsServer";
import { validateRut } from "rutlib";
import { useUserSupportStore } from "../../store/userSupportStore";


const UserSupportForm = () => {
  
  const setUser = useUserSupportStore(state => state.setUser);

  const [systemRolesLocal, setSystemRoles] = useState([]);
  const [institutionRoles, setInstitutionRoles] = useState([]);
  const [loadService, setLoadService] = useState(false);
  const [message, setMessage] = useState({
    show: false,
    text: "",
  });

  useEffect(() => {
    getSystemRoles();
    getInstitutionRoles();
  }, []);


  const getInstitutionRoles = async () => {
    try {
      const dataApi = await getInstitutionRolesApi();
      const roles = dataApi.filter((item) => ["STAFF"].includes(item.roleId));
      setInstitutionRoles(roles);
    } catch (error) {
      console.log("error", error);
    }
  };

  const validUserData = async (rut, email, institutionEmail) => {
    setMessage({
      show: false,
      text: "",
    });
    //Validando por userName o externalId o studentId
    const apiValidUser = await Promise.all([
      validUserBlackBoard(`externalId:${rut.trim()}`),
      validUserBlackBoard(`studentId:${rut.trim()}`),
      validUserBlackBoard(`institutionEmail:${institutionEmail.trim()}`),
      validUserBlackBoard(`email:${email.trim()}`),
    ]);


    if (apiValidUser.some((item) => item !== null)) {
      setMessage({
        show: true,
        text: apiValidUser[0]
          ? `Ya existe un usuario con Rut: ${rut}`
          : apiValidUser[3]
          ? `Ya existe un usuario con Correo institucional: ${institutionEmail}`
          : apiValidUser[4]
          ? `Ya existe un usuario con Correo personal: ${email}`
          : "",
      });
      return false;
    }

    return true;
  };

  const getSystemRoles = async () => {
    try {
      setSystemRoles(systemRoles);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCreateUser = async (values) => {
    try {
      setLoadService(true);
      const { rut,  institutionEmail, email } = values;
      const validUser = await validUserData(
        rut,
        email,
        institutionEmail
      );
      if (!validUser) {
        return;
      }
      const dataApi = await createUserBlackboard(values);
      if (dataApi.statusCode === 500) {
        throw new Error(dataApi.message);
      }
      if(dataApi.userId !== ''){
        const mappedUser = {
          userId: dataApi.userId,
          userName: dataApi.userName
        }
        setUser(mappedUser);
        Notify({
          props: {
            message: `Usuario: ${mappedUser.userName} creado correctamente`,
            type: "success",
          },
        });
      }
    } catch (error) {
      Notify({
        props: {
          message: error.message,
          type: "error",
        },
      });
    }finally{
      setLoadService(false);
    }
  };

  const validForm = (values) => {
    const errors = {};
    const {
      rut,
      given,
      family,
      institutionEmail,
      email,
      city,
      systemRoleIds,
      institutionRoleIds,
    } = values;

   

    if (!rut || !rut.trim()) {
      errors.rut = "Campo requerido.";
    }
    if (!validateRut(rut) ) {
      errors.rut = "Debe ser un rut valido";
    }

    if (!given || !given.trim()) {
      errors.given = "Campo requerido.";
    }

    if (!family || !family.trim()) {
      errors.family = "Campo requerido.";
    }

    if (!institutionEmail || !institutionEmail.trim()) {
      errors.institutionEmail = "Campo requerido.";
    }
    if (!IsMail(institutionEmail)) {
      errors.institutionEmail = "Correo no válido.";
    }
    if (!email || !email.trim()) {
      errors.email = "Campo requerido.";
    }
    if (!IsMail(email)) {
      errors.email = "Correo no válido.";
    }
    if (!city || !city.trim()) {
      errors.city = "Campo requerido.";
    }
    if (!institutionRoleIds || !institutionRoleIds.trim()) {
      errors.institutionRoleIds = "Campo requerido.";
    }
    if (!systemRoleIds || !systemRoleIds.trim()) {
      errors.systemRoleIds = "Campo requerido.";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      rut: "",
      given: "",
      family: "",
      institutionRoleIds: "",
      systemRoleIds: "",
      institutionEmail: "",
      email: "",
      city: "",
    },
    onSubmit: handleCreateUser,
    validate: validForm,
  });


  return (
    <>
    <ToastContainer />
      {message.show && (
        <Alert key="warning" variant="warning">
          {message.text}
        </Alert>
      )}
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Rut</Form.Label>
              <InputGroup>
                <FormControl
                  placeholder="Ingresa el RUT"
                  name="rut"
                  value={formik.values.rut}
                  onChange={formik.handleChange}
                  maxLength={50}
                />
              </InputGroup>
              {formik.errors.rut && (
                <span className="text-danger">{formik.errors.rut}</span>
              )}
            </FormGroup>
          </Col>


          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Nombres</Form.Label>
              <InputGroup>
                <FormControl
                  placeholder="Ingresa el Nombres"
                  name="given"
                  value={formik.values.given}
                  onChange={formik.handleChange}
                  maxLength={50}
                />
              </InputGroup>
              {formik.errors.given && (
                <span className="text-danger">{formik.errors.given}</span>
              )}
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Apellidos</Form.Label>
              <InputGroup>
                <FormControl
                  placeholder="Ingresa el Apellidos"
                  name="family"
                  value={formik.values.family}
                  onChange={formik.handleChange}
                  maxLength={50}
                />
              </InputGroup>
              {formik.errors.family && (
                <span className="text-danger">{formik.errors.family}</span>
              )}
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Correo institucional</Form.Label>
              <InputGroup>
                <FormControl
                  placeholder="Ingresa el Correo institucional"
                  name="institutionEmail"
                  value={formik.values.institutionEmail}
                  onChange={formik.handleChange}
                  maxLength={80}
                />
              </InputGroup>
              {formik.errors.institutionEmail && (
                <span className="text-danger">
                  {formik.errors.institutionEmail}
                </span>
              )}
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Correo personal</Form.Label>
              <InputGroup>
                <FormControl
                  placeholder="Ingresa el Correo personal"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  maxLength={80}
                />
              </InputGroup>
              {formik.errors.email && (
                <span className="text-danger">{formik.errors.email}</span>
              )}
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Ciudad</Form.Label>
              <InputGroup>
                <FormControl
                  placeholder="Ingresa el Ciudad"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  maxLength={50}
                />
              </InputGroup>
              {formik.errors.city && (
                <span className="text-danger">{formik.errors.city}</span>
              )}
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Rol institucional</Form.Label>
              <InputGroup>
                <FormSelect
                  name="institutionRoleIds"
                  value={formik.values.institutionRoleIds}
                  onChange={formik.handleChange}
                  aria-label="Default select example"
                >
                  <option value="">Seleccione un rol...</option>
                  {institutionRoles.map((item) => (
                    <option key={item.roleId} value={item.roleId}>
                      {item.name}
                    </option>
                  ))}
                </FormSelect>
              </InputGroup>
              {formik.errors.institutionRoleIds && (
                <span className="text-danger">
                  {formik.errors.institutionRoleIds}
                </span>
              )}
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>Rol del sistema</Form.Label>
              <InputGroup>
                <FormSelect
                  name="systemRoleIds"
                  value={formik.values.systemRoleIds}
                  onChange={formik.handleChange}
                  aria-label="Default select example"
                >
                  <option value="">Seleccione un rol...</option>
                  {systemRolesLocal.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </FormSelect>
              </InputGroup>
              {formik.errors.systemRoleIds && (
                <span className="text-danger">
                  {formik.errors.systemRoleIds}
                </span>
              )}
            </FormGroup>
          </Col>
        </Row>
        <div className="mt-1" style={{ display: "flex", alignItems: "center" }}>
          <Button
            style={{ marginRight: "20px" }}
            disabled={loadService}
            variant="primary"
            type="submit"
          >
            Crear
          </Button>
          {loadService && <Spinner animation="border" variant="primary" />}
        </div>
      </Form>
    </>
  );
};

export default UserSupportForm;
