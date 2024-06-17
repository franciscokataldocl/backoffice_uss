import FetchData from "./FetchData";

const serverUrl= process.env.REACT_APP_SERVER;

export const ValidateO365 = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/validate`,
            method: 'POST',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const GetPerson = async ({props}) => {
    try{
        const result = await FetchData({
            url: '/banner/persona',
            method: 'POST',
            cache: 'default',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const GenerateToken = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/auth/generate-token`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const GetIntegrators = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/integrators`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const GetPeriodos = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/periodos`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

// usuarios nodos

export const GetUsersNodes = async (props) => {
   
    try{
        const result = await FetchData({
            url: `${serverUrl}/usuariosNodos`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const GetAdministratorRoles = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/administrator-role-code`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const GetCoursesByNrc = async (props) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/get-courses-by-nrc`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}


export const s3JsonFile = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/s3file`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const Logs = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/logs`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const DownloadFile = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/logs/download`,
            method: 'POST',
            cache: 'no-cache',
            body: props,
            responseType: 'blob'
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const JobStatus = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/synchronization/jobstatus`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}
export const JobUpdate = async ({props}) => {
    try{
        const result = await FetchData({
            url: `${serverUrl}/synchronization/jobupdate`,
            method: 'POST',
            cache: 'no-cache',
            body: props
        });
        return result;
    }catch(error) {
        return {
            statusCode: 500,
            message: error
        }
    }
}

export const createUserBlackboard = async (body) => {
    try {
      const dataApi= await  FetchData({
          url: `${serverUrl}/blackboard/create/user`,
          method: "POST",
          body,
        });
        
      return dataApi;

    } catch (error) {
       return {
         statusCode: 500,
         message: error,
       };
    }
}

export const getSystemRolesApi = async () => {
    try {
      const dataApi = await FetchData({
        url: `${serverUrl}/systemroles`,
        method: "POST",
      });
      return dataApi;

    } catch (error) {
       return {
         statusCode: 500,
         message: error,
       };
    }
}

export const getInstitutionalHierarchyUSSApi = async(nodeId)=>{
    try{
        const dataApi = await FetchData({
          url: `${serverUrl}/institutionalHierarchy/USS`,
          method: "POST",
        });
        return dataApi;
    }catch(error){
        return{
            statusCode:500,
            message:error,
        };
    }

}

export const getInstitutionalHierarchyWithNode = async(nodeId)=>{

    try{
        const dataApi = await FetchData({
          url: `${serverUrl}/institutionalHierarchy/USS/nodeId`,
          method: "POST",
          body: { nodeId: nodeId },
        });
        return dataApi;
    }catch(error){
        return{
            statusCode:500,
            message:error,
        };
    }

}

// add user admin to node
export const addUserToNode = async(data)=>{

    try{
        const dataApi = await FetchData({
          url: `${serverUrl}/institutionalHierarchy/admin/node`,
          method: "POST",
          body: data,
        });
        return dataApi;
    }catch(error){
        return{
            statusCode:500,
            message:error,
        };
    }

}



export const getInstitutionRolesApi = async () => {
  try {
    const dataApi = await FetchData({
      url: `${serverUrl}/institutionRoles`,
      method: "POST",
    });
    return dataApi;
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
};

export const validUserBlackBoard = async (userValid) => {
  try {
    const dataApi = await FetchData({
      url: `${serverUrl}/validuser-blackboard`,
      method: "POST",
      body: {
        userValid,
      },
    });
    return dataApi;
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
};

export const s3JsonNewContentFile = async ({ props }) => {
  try {
    const result = await FetchData({
      url: `${serverUrl}/new-content-s3-file`,
      method: "POST",
      cache: "no-cache",
      body: props,
    });
    return result;
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
};

export const getUsersByRole = async ( props ) => {
  try {
    const result = await FetchData({
      url: `${serverUrl}/get-usuario-roles-rut`,
      method: "POST",
      cache: "no-cache",
      body: props,
    });
    return result.data;
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
};