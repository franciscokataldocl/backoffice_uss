const ModalFooterButtons = ({handleSave, isSave, title, handleClose}) => {
    const handleSavee = () => {
        handleSave();
    }
    const handleClosee = () => {
        handleClose();
    }

    return (
        <div className="btn-group" style={{ display: 'flex' }}>
            {handleSave && 
                <button
                    className="btn btn-primary"
                    style={{ width: '110px' }}
                    onClick={handleSavee}
                >
                    <span className={`fa fa-${isSave? 'save':'edit'}`}></span> {title}
                </button>
            } 
            <button
                className="btn btn-secondary"
                style={{ width: '110px' }}
                onClick={handleClosee}
            >
                <span className="fa fa-close"></span> Cancelar
            </button>
        </div>
    )
}
export default ModalFooterButtons;