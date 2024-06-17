import { FormatBytes, FormatDate } from "../../utils/Functions"

const _formatDate = process.env.REACT_APP_FORMAT_DATE;

export const EmailsColumns = [
    { name: 'Mail', selector: (row) => row.mail, sortable: true, width: '60%'},
    { name: 'Acciones', selector: (row) => row.actions, sortable: false, width: '15%'}
]

export const BlackboardRolesColumns = [
    { name: 'Banner', selector: (row) => row.adminCode, sortable: true, width: '40%'},
    { name: 'Blackboard', selector: (row) => row.equivalente, sortable: false, width: '40%'},
    { name: 'Acciones', selector: (row) => row.actions, sortable: false, width: '15%'}
]

export const KeysColumns = [
    { name: 'Llave', selector: (row) => row.key, sortable: true, width: '40%'},
    { name: 'Valor', selector: (row) => row.value, sortable: false, width: '40%'},
    { name: 'Acciones', selector: (row) => row.actions, sortable: false, width: '15%'}
]

export const LogsColumns = [
    { name: 'Fecha', selector: (row) => FormatDate({dt:row.LastModified,format:_formatDate}), sortable: true, width: '20%'},
    { name: 'Archivo', selector: (row) => row.Key, sortable: false, width: '50%'},
    { name: 'Tamaño', selector: (row) => FormatBytes(row.Size), sortable: false, width: '10%', right:'true'},
    { name: 'Descargar', selector: (row) => row.button, sortable: false, width: '15%', center:'true'}
]

export const JobExecutionsColumns = [
    { name: 'Job', selector: (row) => row.jobName, sortable: false, width: '30%'},
    { name: 'Inicio', selector: (row) => FormatDate({dt:row.startTime,format:_formatDate}), sortable: false, width: '25%'},
    { name: 'Finalizado', selector: (row) => FormatDate({dt:row.completionTime,format:_formatDate}), sortable: false, width: '25%'},
    { name: 'Estado', selector: (row) => row.phase, sortable: false, width: '20%', center:true}
]

export const DisabledUsersByRoleColumns = [
    { name: 'Rut', selector: (row) => row.rut, sortable: true, width: '15%'},
    { name: 'Nombres', selector: (row) => row.names, sortable: false, width: '32.5%'},
    { name: 'Rol Banner', selector: (row) => row.role, sortable: false, width:  '17.5%'},
    { name: 'Estado', selector: (row) => row.state, sortable: false, width:  '20%'},
    { name: 'Acción', selector: (row) => row.actions, sortable: false, width: '15%'}
]