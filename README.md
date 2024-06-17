# Aplicación BackOffice - LMS
Está aplicación fue creada para administrar las parametrias que se necesitan en el proceso de extracción de información desde el ERP Banner y disponibilizar al socio integrador blackboard. 

## Información Técnica
- Tecnología
    - React: v18.2.0
    - NodeJs: v18.18.0

## Dependencias
```json
    {
        "dependencies": {
            "@aws-sdk/client-s3": "^3.499.0",
            "@kubernetes/client-node": "^0.20.0",
            "@testing-library/jest-dom": "^5.17.0",
            "@testing-library/react": "^13.4.0",
            "@testing-library/user-event": "^13.5.0",
            "bootstrap": "^5.3.2",
            "cors": "^2.8.5",
            "cron-parser": "^4.9.0",
            "crypto-js": "^4.2.0",
            "font-awesome": "^4.7.0",
            "react": "^18.2.0",
            "react-bootstrap": "^2.9.2",
            "react-data-table-component": "^7.6.2",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.21.1",
            "react-scripts": "5.0.1",
            "react-toastify": "^9.1.3",
            "web-vitals": "^2.1.4"
        }
    }
```

## Operatividad:
- Para acceder al sitio se necesita autenticar con Office 365, la app se encarga de realizar las validaciones correspondiente de la persona o usuario, pripero que exista en o365, luego que tenga acceso (este en la lista de usuarios autorizados).
- Todas las operaciones o interacciones con servicios AWS y otros los realiza mediante un servidor express integrado, lo que implica que; para que le producto este en operación, el servidor express tambien debe esta escuchando las peticiones, en un hot y un puerto si es necesario. 