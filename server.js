const express = require('express');
const cors = require('cors');
require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');

const FetchData = require('./src/context/data/FetchData')

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos desde la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Manejar todas las demás rutas y enviar el archivo HTML de la aplicación React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Validar Auth de O365
app.post('/validate', async(request, response) => {
    try {
        const result = await FetchData({
            url: `${process.env.AUTH_SERVER}/validate`,
            method: 'POST',
            body: request.body
        });    
        response.status(200)
        .json({
            statusCode: 200,
            body: result
        });
    } catch (error) {
        response.json({
            statusCode:500,
            message: `Error interno del servidor - ${error}`
        });
    }
});






//get courses by nrc and period
app.post('/get-courses-by-nrc', async(request, response) => {
let url = `${process.env.AWS_SERVICES_URL}/lms/get-courses-by-nrc`;
const data = JSON.stringify(request.body)
  try {
    const result = await FetchGetParams(url, data);
    response.status(result?.statusCode??200).json(result);
  } catch (error) {
    response.json({
      statusCode:500,
      message: `Error interno del servidor - ${error}`
    });
  }
});


// Get Token
app.post('/auth/generate-token', async(request, response) => {
    try {
        const result = await FetchData({
            url: `${process.env.AWS_SERVICES_URL}/auth/generate-token`,
            method: 'POST',
            body: request.body
        });
            
        response.status(200)
        .json({
            statusCode: 200,
            body: result
        });
    } catch (error) {
        response.json({
            statusCode:500,
            message: `Error interno del servidor - ${error}`
        });
    }
});

// Manejo de datos en el S3
app.post('/s3file', async(request, response) => {
    try {
        const result = await FetchData({
            url: `${process.env.AWS_SERVICES_URL}/general/json-file`,
            method: 'POST',
            body: request.body
        });
        response.status(result?.statusCode??200).json(result);
    } catch (error) {
        response.json({
            statusCode:500,
            message: `Error interno del servidor - ${error}`
        });
    }
});

// Get periodos
app.post('/periodos', async(request, response) => {
    try {
        const result = await FetchData({
            url: `${process.env.AWS_SERVICES_URL}/banner/maestros/periodos`,
            method: 'POST',
            body: request.body
        });
        response.status(result?.statusCode??200).json(result);
    } catch (error) {
        response.json({
            statusCode:500,
            message: `Error interno del servidor - ${error}`
        });
    }
});


// Get usuarios nodos
app.post('/usuariosNodos', async(request, response) => {

  try {
    const result = await FetchData({
      url: `${process.env.AWS_SERVICES_URL}/lms/nodos-usuario2`,
      method: 'POST',
      body: request.body
    });
    response.status(result?.statusCode??200).json(result);
  } catch (error) {
    response.json({
      statusCode:500,
      message: `Error interno del servidor - ${error}`
    });
  }
});


// Get integradores
app.post('/integrators', async(request, response) => {
    try {
        const result = await FetchData({
            url: `${process.env.AWS_SERVICES_URL}/banner/maestros/integradores`,
            method: 'POST',
            body: request.body
        });
        response.status(result?.statusCode??200).json(result);
    } catch (error) {
        response.json({
            statusCode:500,
            message: `Error interno del servidor - ${error}`
        });
    }
});

// Get periodos
app.post('/administrator-role-code', async(request, response) => {
    try {
        const result = await FetchData({
            url: `${process.env.AWS_SERVICES_URL}/banner/maestros/administrator-role-code`,
            method: 'POST',
            body: request.body
        });
        response.status(result?.statusCode??200).json(result);
    } catch (error) {
        response.json({
            statusCode:500,
            message: `Error interno del servidor - ${error}`
        });
    }
});

// Get logs (archvivos en el S3)
app.post('/logs', async(request, response) => {
    try {
        let { bucket, prefix } = request.body;
        // Importa los módulos necesarios del AWS SDK v3
        const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
       
        // Configura el cliente de AWS S3 con las credenciales proporcionadas
       
        const s3Client = new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_KEY,
          },
      });
        // Configura los parámetros para listar objetos en S3
        const params = {
            Bucket: bucket,
            Prefix: prefix
            
        };
    
        // Función para listar objetos en el bucket especificado
        const listObjects = async () => {
            try {
                const command = new ListObjectsV2Command(params);
                const response = await s3Client.send(command);
               const logContent = response.Contents;
                return logContent;
            } catch (error) {
                throw new Error(`Error al listar objetos: ${error}`);
            }
        };
    
        // Maneja la promesa
        listObjects()
            .then((objects) => {
                response.json({
                    statusCode: 200,
                    body: objects
                });
            })
            .catch((error) => {
                response.json({
                    statusCode: 404,
                    message: error.message
                });
            });
    } catch (error) {
        response.json({
            statusCode: 500,
            message: `Error interno del servidor - ${error.message}`
        });
    }      
});

// Get logs (archivos en el S3)
app.post('/logs/download', async (request, response) => {
    try {
        const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
        const { bucket, key } = request.body;

        // Configura el cliente de AWS S3
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });

        // Configura los parámetros para descargar el objeto desde S3
        const params = {
            Bucket: bucket,
            Key: key
        };

        // Realiza la operación getObject para obtener el contenido del archivo
        s3Client.send(new GetObjectCommand(params))
            .then(data => {
                // Configura los encabezados para la descarga
                response.setHeader('Content-Disposition', `attachment; filename=${key}`);
                response.setHeader('Content-Type', 'application/octet-stream');
                if (Buffer.isBuffer(data.Body)) {
                    // Si data.Body es un Buffer, conviértelo a una cadena de texto
                    const bodyString = data.Body.toString('utf-8');                    
                    response.status(200).send(bodyString);
                } else {
                    // Si data.Body no es un Buffer, envíalo como un flujo de datos
                    data.Body.pipe(response);
                }
            })
            .catch(error => {
                response.status(404).json({
                    statusCode: 404,
                    message: `Error al descargar el archivo desde S3: ${error.message}`
                });
            });

    } catch (error) {
  
        response.status(500).json({
            statusCode: 500,
            message: `Error interno del servidor - ${error.message}`
        });
    }
});

// Get cronJob config
app.post('/synchronization/jobstatus', async (request, response) => {
  try {
    const cronParser = require('cron-parser');
    const k8s = require('@kubernetes/client-node');

    const { cronJobName, namespace } = request.body;    
    const kc = new k8s.KubeConfig();
    kc.loadFromFile('./kubeconfig.yaml');
    const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);
    const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
  
    // Obtener el estado del CronJob
    let result = {};
    const cronJobResponse = await batchV1Api.readNamespacedCronJob(cronJobName, namespace);
    const cronJob = cronJobResponse.body;
  
    // Obtener la lista de trabajos relacionados con el CronJob
    const jobListResponse = await batchV1Api.listNamespacedJob(namespace);
    const jobList = jobListResponse.body.items;

    // Filtrar los trabajos relacionados con el CronJob mediante anotaciones
    const cronJobRelatedJobs = jobList.filter((job) => {
      const ownerReferences = job.metadata.ownerReferences || [];
      return ownerReferences.some((ref) => ref.name === cronJobName);
    });

    // Obtener el historial de ejecuciones desde la lista de trabajos
    const executionHistory = await Promise.all(
        cronJobRelatedJobs.map(async (job) => {
            const jobConditions = job.status.conditions || [];
            // Buscar en las condiciones para determinar el estado del trabajo
            const completedCondition = jobConditions.find((condition) => condition.type === 'Complete');
            const failedCondition = jobConditions.find((condition) => condition.type === 'Failed');
            const runningCondition = jobConditions.find((condition) => condition.type === 'Running');
            
            let phase = 'Unknown';
            if (completedCondition) {
                phase = 'Success';
            } else if (failedCondition) {
                phase = 'Failed';
            } else if (runningCondition) {
                phase = 'Running';
            }

            const jobName = job.metadata.name;
            // Obtener los registros (logs) del pod asociado al trabajo
            // Obtener el nombre del pod asociado al trabajo
            const podsList = await coreV1Api.listNamespacedPod(namespace);
            const matchingPod = podsList.body.items.find(pod => pod.metadata.name.startsWith(jobName));
            const podName = matchingPod.metadata.name;


            // const podName = job.spec.template.spec.containers[0].name;

        
            // Inicializar los logs como null
            let logs = null;

            try {
                // Intentar obtener los logs del pod
                const logsResponse = await coreV1Api.readNamespacedPodLog(podName, namespace);
                logs = logsResponse.body;
            } catch (error) {
                // Manejar errores al obtener los logs
                logs = `Error al obtener los logs del pod ${podName}: ${error.message}`;
                console.error(logs);
            }

            return {
                jobName: jobName,
                startTime: job.status.startTime,
                completionTime: job.status.completionTime,
                phase: phase,
                logs: logs
            };
        })
    );
    
    // Calcular la siguiente Ejecucion
    const interval = cronParser.parseExpression(cronJob.spec.schedule);
    const nextScheduleTime = interval.next().toString();

    result = {
        statusCode: 200,
        status: {
            suspend: cronJob.spec.suspend,
            lastSuccessfulTime: cronJob.status.lastSuccessfulTime,
            lastScheduleTime: cronJob.status.lastScheduleTime,
            nextScheduleTime: nextScheduleTime,
            activeJobs: cronJob.status.active,
            cronSchedule: cronJob.spec.schedule,
            executionHistory: executionHistory,
        },
    };
  
    response.status(200).json({
        statusCode: 200,
        body: result,
    });
  } catch (error) {
    response.status(500).json({
        statusCode: 500,
        message: `Error interno del servidor - ${error.message}`,
    });
  }   
});

// Post - job update
app.post('/synchronization/jobupdate', async (request, response) => {
  try {
    const { cronJobName, namespace, suspend, schedule } = request.body;
    const k8s = require('@kubernetes/client-node');
    const kc = new k8s.KubeConfig();
    kc.loadFromFile('./kubeconfig.yaml');
    const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);
    
    // Obtener la definición actual del CronJob
    const cronJobResponse = await batchV1Api.readNamespacedCronJob(cronJobName, namespace);
    const cronJob = cronJobResponse.body;
    
    // Modificar la definición para suspender el CronJob
    cronJob.spec.suspend = suspend;
    cronJob.spec.schedule = schedule;

    // Actualizar el CronJob con la nueva definición
    const updatedCronJobResponse = await batchV1Api.replaceNamespacedCronJob(cronJobName, namespace, cronJob);
    const updatedCronJob = updatedCronJobResponse.body;
    
    response.status(200).json({
      statusCode: 200,
      message: `CronJob "${cronJobName}" se ha actualizado con éxito.`,
      updatedCronJob: updatedCronJob,
    });
  } catch (error) {
    // Manejar errores
    console.error('Error al actualizar el CronJob:', error);

    // Obtener detalles del error
    const statusCode = error.response.body.code ? error.response.body.code: 500;
    const errorMessage = error.response ? error.response.body.message : error.message;
    response.status(statusCode).json({
      statusCode: statusCode,
      message: `Error al actualizar el CronJob: ${errorMessage}`,
    });
  }   
});

// Post - create user blackboard
app.post("/blackboard/create/user", async (request, response) => {
  try {
    const token =await FetchDataGetToken();
    let {
      rut,
      userName,
      institutionRoleIds,
      systemRoleIds,
      given,
      family,
      city,
      email,
      institutionEmail,
    } = request.body;

    userName = institutionEmail;

    const jsonLocal =JSON.parse(JSON.stringify(jsonCreateUserBlackBoard));
    jsonLocal.externalId = rut.trim();
    jsonLocal.userName = userName.trim();
    jsonLocal.studentId = `USS${rut.trim()}`;
    jsonLocal.institutionRoleIds.push(institutionRoleIds.trim());
    jsonLocal.systemRoleIds.push(systemRoleIds.trim());
    jsonLocal.name.given = given.trim();
    jsonLocal.name.family = family.trim();
    jsonLocal.address.city = city.trim();
    jsonLocal.contact.email = email.trim();
    jsonLocal.contact.institutionEmail = institutionEmail.trim();
    const user = await FetchDataBlackBoardToken(
      token,
      "POST",
      { ...jsonLocal },
      `${process.env.REACT_APP_BLACKBOARD_URL}/users`
    );

    if(!user){
      throw new Error('Error al crear el usuario');
    }


    response.status(200).json({
      statusCode: 200,
      message: `User created successfully`,
      studentId : `USS${rut.trim()}`,
      userId: user.id,
      userName: userName
    });
  } catch (error) {
    response.status(500).json({
      statusCode: 500,
      message: `Error interno del servidor - ${error.message}`,
    });
  }
});

// Post - obtener jerarquias institucionales para el id USS 
app.post("/institutionalHierarchy/USS", async (request, response) => {

  try {
    const token = await FetchDataGetToken();
    const institutionalHierarchy = await FetchDataBlackBoardToken(
      token,
      "GET",
      null,
      `${process.env.REACT_APP_BLACKBOARD_URL}/institutionalHierarchy/nodes/externalId:USS/children`
    );

    response.status(200).json(institutionalHierarchy?.results || []);  
  } catch (error) {

    response.status(500).json({
      statusCode: 500,
      message: `Error interno del servidor - ${error.message}`,
    });
  }
});

//post obtener jerarquias por nodeid
app.post("/institutionalHierarchy/USS/nodeId", async (request, response) => {
  const nodeId = request.body.nodeId;
  try {
    const token = await FetchDataGetToken();
    const institutionalHierarchy = await FetchDataBlackBoardToken(
      token,
      "GET",
      null,
      `${process.env.REACT_APP_BLACKBOARD_URL}/institutionalHierarchy/nodes/${nodeId}/children`
    );

    response.status(200).json(institutionalHierarchy?.results || []);  
  } catch (error) {

    response.status(500).json({
      statusCode: 500,
      message: `Error interno del servidor - ${error.message}`,
    });
  }
});

//agregar usuario admin a nodo
app.post("/institutionalHierarchy/admin/node", async (request, response) => {

  const bodyData = {
    nodeRoles: ["USS-S-S"]
  };
  const {nodes, user} = request.body
  try {
    const token = await FetchDataGetToken();
    for (const nodeId of nodes) {
      // Petición para agregar usuario como administrador
      await FetchDataBlackBoardToken(
        token,
        "PUT",
        bodyData,
        `${process.env.REACT_APP_BLACKBOARD_URL}/institutionalHierarchy/nodes/${nodeId}/admins/${user}`
      );

      // Petición para crear asociación de usuario a nodo
      await FetchDataBlackBoardToken(
        token,
        "PUT",
        bodyData,
        `${process.env.REACT_APP_BLACKBOARD_URL}/institutionalHierarchy/nodes/${nodeId}/users/${user}`
      );
    }



    response.status(200).json({
      statusCode: 200,
      message: `Usuario agregado a nodo correctamente`,
    });
  } catch (error) {

    response.status(500).json({
      statusCode: 500,
      message: `Error interno del servidor - ${error.message}`,
    });
  }
});



//Obtener roles del systema blackboard
app.post('/systemroles', async(_, response) => {
  try {

    const token = await FetchDataGetToken();
    const roles=  await FetchDataBlackBoardToken(token, 'GET', null,`${process.env.REACT_APP_BLACKBOARD_URL}/systemRoles`);

    response.status(result?.statusCode??200).json(roles);
  } catch (error) {
    response.json({
      statusCode:500,
      message: `Error interno del servidor - ${error}`
    });
  }
});

//Obtener roles del systema blackboard
app.post("/institutionRoles", async (_, response) => {
  try {
    const token = await FetchDataGetToken();
    const roles = await FetchDataBlackBoardToken(
      token,
      "GET",
      null,
      `${process.env.REACT_APP_BLACKBOARD_URL}/institutionRoles`
    );
    response.status(200).json(roles?.results || []);
  } catch (error) {
    response.json({
      statusCode: 500,
      message: `Error interno del servidor - ${error}`,
    });
  }
});

//Obtener usuario blackboard
app.post("/validuser-blackboard", async (request, response) => {
  try {
    const token = await FetchDataGetToken();
    const body=request.body;
    const user = await FetchDataBlackBoardToken(
      token,
      "GET",
      null,
      `${process.env.REACT_APP_BLACKBOARD_URL}/users/${body.userValid}`
    );
    response.status(200).json(user);
  } catch (error) {
    response.json({
      statusCode: 500,
      message: `Error interno del servidor - ${error}`,
    });
  }
});

//Sobreescribir archivo s3 (JSON)
app.post("/new-content-s3-file", async (request, response) => {
  try {
    const { bucket, key, body } = request.body;
    const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
    const params = {
      Bucket: bucket,
      Key:key,
      Body:JSON.stringify(body),
    };
    await client.send(new PutObjectCommand(params));
    response.status(200).json(true);
  } catch (error) {
    response.json({
      statusCode: 500,
      message: `Error interno del servidor - ${error}`,
    });
  }
});


// Traer usuarios con rol por rut
app.post("/get-usuario-roles-rut", async (request, response) => {
  try {
    const result = 
    await FetchGetParams(`${process.env.AWS_SERVICES_URL}/lms/get-usuario-roles-rut`, request.body)
    response.status(result?.statusCode ?? 200).json(result);
  } catch (error) {
    response.json({
      statusCode: 500,
      message: `Error interno del servidor - ${error}`,
    });
  }
});

// Puerto en el que escucha el servidor
const PORT = process.env.REACT_APP_SERVER_PORT || 3000;

try {
  app.listen(PORT, () => {
    console.log(`Servidor Express HTTP en ejecución en el puerto ${PORT}`);
  });
} catch (error) {
  console.error('Error al levantar el servidos:', error);
}
