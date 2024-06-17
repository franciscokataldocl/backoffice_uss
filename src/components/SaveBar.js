import { FormatDate } from "../utils/Functions";

const SaveBar = ({form, typeButton, handleSave, viewSaveBtn=true, info}) => {
    const handleSaveButtonClick = (e) => {
        handleSave(e);
      };
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {
                    (Object.keys(info).length > 0) &&
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        Información Creado: {FormatDate({dt:info?.create??null, format:process.env.REACT_APP_FORMAT_DATE}) ?? ''}, 
                        Editado: {FormatDate({dt:info?.update??null, format:process.env.REACT_APP_FORMAT_DATE}) ?? ''}, 
                        Usuario: {info?.user ?? ''}
                    </div>
                }
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {
                viewSaveBtn &&
                    <button
                        type={typeButton??'button'}
                        form={form}
                        className='btn btn-success'
                        onClick={handleSaveButtonClick}
                    ><i className="fa fa-save" aria-hidden="true"></i> Guardar</button>
                }
            </div>
        </div>
    )
}
export default SaveBar;