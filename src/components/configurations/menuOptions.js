const menuOptions = (status) => {
    const options = [
        {
            option: 'Nombres de Archivos',
            description: '',
            component: 'LogFiles',
            status: true
        },
         {
            option: 'Fechas Cursos',
            description: '',
            component: 'CoursesNewDate',
            status: true
        },
        // {
        //     option: 'Usuarios soporte',
        //     description: '',
        //     component: 'UsuariosSoporte',
        //     status: true
        // },{}
        {
             option: 'Usuario soporte',
             description: '',
             component: 'UserSupport',
             status: true
        },
         {
            option: 'Logs',
            description: '',
            component: 'LmsLogs',
            status: true
        },
        {
            option: 'Periodos Busqueda',
            description: '',
            component: 'Periodos',
            status: true
        },
        {
            option: 'Periodos Validación',
            description: '',
            component: 'PeriodosValidacion',
            status: true
        },
        {
            option: 'Socio Integrador',
            description: '',
            component: 'Integrator',
            status: true
        },
        {
            option: 'Roles',
            description: '',
            component: 'Roles',
            status: true
        },
        // {
        //     option: 'Roles BlackBoard',
        //     description: '',
        //     component: 'BlackboardRolesAndUsersDisabled',
        //     status: true
        // },
        {
            option: 'Llaves',
            description: '',
            component: 'Keys',
            status: true
        },
        {
            option: 'Emails Notificaciones',
            description: '',
            component: 'Mails',
            status: true
        },
        {
            option: 'Administrador',
            description: '',
            component: 'Administrators',
            status: true
        },
        // {
        //     option: 'Estado Proceso',
        //     description: '',
        //     component: 'Synchronization',
        //     status: true
        // }
    ];
    const _options = options.filter(row => row.status === status??true)
    return _options;
};
export default menuOptions;
