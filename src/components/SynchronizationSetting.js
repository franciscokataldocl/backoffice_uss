import DataTable from "react-data-table-component"
import { FormatDate } from "../utils/Functions"
import { JobExecutionsColumns } from "./configurations/ColumnDTSetting"

const _formatDate = process.env.REACT_APP_FORMAT_DATE;

export const ExecutionsDate = ({data}) => {
    return (
        <div className="col-sm-11">
            <div className="form-group row">
                <label className="col-sm-4 col-form-label">Se ejecuta</label>
                <div className="col-sm-8">
                    <label className="col-sm-6 col-form-label">{FormatDate({dt:data.lastScheduleTime,format:_formatDate})}</label>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-4 col-form-label">Última ejecución Exitosa</label>
                <div className="col-sm-8">
                    <label className="col-sm-6 col-form-label">{FormatDate({dt:data.lastSuccessfulTime,format:_formatDate})}</label>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-4 col-form-label">Siguiente ejecución</label>
                <div className="col-sm-8">
                    <label className="col-sm-6 col-form-label">{FormatDate({dt:data.nextScheduleTime,format:_formatDate})}</label>
                </div>
            </div>
        </div>
    )
}

export const JobExecutions = ({data}) => {
    return (
        <DataTable
            columns={JobExecutionsColumns}
            data={data}
            pagination
            className="custom-datatable"
        />
    )
}