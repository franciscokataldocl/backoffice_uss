import DataTable from "react-data-table-component";
import { DisabledUsersByRoleColumns } from "./configurations/ColumnDTSetting";
import { s3JsonFile, s3JsonNewContentFile } from "../context/data/APIs";
import { useEffect, useState } from "react";
import { Badge, Button, Spinner } from "react-bootstrap";

const DisabledUsersByRoleTable = ({ users }) => {
  const [usersLocal, setUsersLocal] = useState([]);
  const [loadService, setLoadService] = useState(false);

  useEffect(() => {
    transformData();
  }, []);

  const transformData = async () => {
    const usersDisabled = await getDisabledUsersByRole();
    if (!usersDisabled) {
      return;
    }
    const tranformData = users.map((item) => {
      const key = `${item.rut}:${item.role}`;
      return {
        rut: item.rut,
        names: item.names,
        email: item.email,
        role: item.role,
        state: (
          <Badge pill bg={usersDisabled[key] ? "danger" : "success"}>
            {usersDisabled[key] ? "Inhabilidato" : "Habilitado"}
          </Badge>
        ),
        actions: usersDisabled[key] ? (
          <Button
            variant="success"
            type="button"
            onClick={() => {
              handleRowClickedEnabled(item, usersDisabled);
            }}
          >
            <i class="fa fa-check"></i>
          </Button>
        ) : (
          <Button
            variant="danger"
            type="button"
            onClick={() => {
              handleRowClickedDisabled(item, usersDisabled);
            }}
          >
            <i class="fa fa-ban"></i>
          </Button>
        ),
      };
    });
    setUsersLocal(tranformData);
  };

  const handleRowClickedDisabled = (row, usersDisabled) => {
    if (loadService) {
      return;
    }
    const { rut, role } = row;
    writeDisabledUsersByRole(`${rut}:${role}`, usersDisabled, true);
  };

  const handleRowClickedEnabled = (row, usersDisabled) => {
    if (loadService) {
      return;
    }
    const { rut, role } = row;
    const key = `${rut}:${role}`;
    delete usersDisabled[key];
    writeDisabledUsersByRole(key, usersDisabled, false);
  };

  const getDisabledUsersByRole = async () => {
    try {
      const props = {
        action: "read",
        bucket: process.env.REACT_APP_BUCKET,
        fileName: "back-office/user-roles-disabled.json",
      };
      const lastJsonS3 = await s3JsonFile({ props });
      return lastJsonS3?.body || null;
    } catch (error) {
      console.log("error", error);
    }
  };

  const writeDisabledUsersByRole = async (key, usersDisabled, addUser) => {
    try {
      setLoadService(true);
      if (addUser) {
        usersDisabled[key] = {
          disabled: true,
          date: new Date().toISOString(),
        };
      }
      const props = {
        body: usersDisabled,
        bucket: process.env.REACT_APP_BUCKET,
        key: "back-office/user-roles-disabled.json",
      };
      await s3JsonNewContentFile({ props });
      await transformData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadService(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Resultado de busqueda</h1>
        {loadService && <Spinner animation="border" variant="primary" />}
      </div>
      <DataTable
        columns={DisabledUsersByRoleColumns}
        data={usersLocal}
        pagination
        noDataComponent="Contruyendo tabla.."
      />
    </>
  );
};

export default DisabledUsersByRoleTable;
