import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import DisabledUsersByRoleTable from "./DisabledUsersByRoleTable";
import { getUsersByRole } from "../context/data/APIs";
import { rRoles } from "../businessRules/BlackboardRoles";

const DisabledUsersByRole = () => {
  const [loadService, setLoadService] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [users, setUsers] = useState([]);
  const [blackboardRoles, setBlackboardRoles] = useState([]);

  useEffect(() => {
    getBlackboardRoles();
  }, []);

  const getBlackboardRoles = async () => {
    const blackboardRolesL = await rRoles({
      key: "blackboardRoles",
      handlEdit: () => {},
      handlDelete: () => {},
    });
    setBlackboardRoles(blackboardRolesL?.body || []);
  };

  const validForm = (values) => {
    const errors = {};
    const { rut } = values;

    if (!rut || !rut.trim()) {
      errors.rut = "Campo requerido.";
    }
    return errors;
  };

  const handleSearchUser = async (values) => {
    try {
      if (!blackboardRoles.length) {
        throw new Error("No se han cargado los roles de Blackboard.");
      }

      setLoadService(true);
      setShowTable(false);
      const blackboardRolesTransform = blackboardRoles
        .map((role) => `'${role.adminCode}'`)
        .join(", ");

      const usersL = await getUsersByRole({
        rut: values.rut.trim(),
        roles: blackboardRolesTransform,
      });
      if (usersL.statusCode === 500) {
        throw new Error(usersL.message);
      }

      setUsers(
        usersL.map((user) => ({
          rut: user.RUT,
          names: `${user.FIRSTNAME} ${user.LASTNAME}`,
          email: user.EMAIL,
          role: user.ROLE,
        }))
      );

      setShowTable(true);
    } catch (error) {
      console.error(error);
      setShowTable(false);
    } finally {
      setLoadService(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      rut: "",
    },
    onSubmit: handleSearchUser,
    validate: validForm,
  });

  return (
    <>
      <h1>Usuarios deshabilitados</h1>

      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col xs={12} sm={6} className="mb-1">
            <FormGroup>
              <Form.Label>
                <strong>
                  <small className="text-danger ml-2">
                    * Digitar el Rut sin guion
                  </small>
                </strong>
                <br />
                Rut
              </Form.Label>
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
            <div
              className="mt-3"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                style={{ marginRight: "20px" }}
                disabled={loadService}
                variant="primary"
                type="submit"
              >
                Buscar
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {loadService && (
        <Alert variant="info">
          <strong>Buscando usuario...</strong>
        </Alert>
      )}
      {showTable && Boolean(users.length) && (
        <>
          <hr />
          <DisabledUsersByRoleTable users={users} />
        </>
      )}
      {showTable && !Boolean(users.length) && (
        <Alert variant="warning">
          <strong>No se encontro el usuario.</strong>
        </Alert>
      )}
    </>
  );
};

export default DisabledUsersByRole;
