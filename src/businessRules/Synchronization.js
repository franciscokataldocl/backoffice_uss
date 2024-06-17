import { JobStatus, JobUpdate } from "../context/data/APIs";

export const rJobStatus = async () => {
    try{
        const cronJobResult = await JobStatus({props:{
            cronJobName: process.env.REACT_APP_KBNET_CRONJOBNAME,
            namespace: process.env.REACT_APP_KBNET_SPACENAME
        }});
        return cronJobResult;
    }catch(error){
        return {
            statusCode:500,
            message: error
        }
    }
}

export const rSave = async({props}) => {
    try{
        props.cronJobName = process.env.REACT_APP_KBNET_CRONJOBNAME;
        props.namespace = process.env.REACT_APP_KBNET_SPACENAME;
        const saveResult = await JobUpdate({props});
        return saveResult;
    }catch(error){
        return {
            statusCode:500,
            message: error
        }
    }
}

export const rExecutionsJobPhase = async({handleViewLog, history}) => {
    try{
        let _history = [...history];
        let response = await Promise.all(
            _history.map(row => {
                let _iconStyle = renderIcon(row.phase);
                const backgroundStyle = renderBackground(row.phase);

                const _phase = (
                    <div className="btn-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            className={`btn btn-${backgroundStyle}`}
                            title= {row.phase}
                            style={{ width: '100px' }}
                            disabled
                        >
                            <i className={_iconStyle} aria-hidden="true"></i> {row.phase}
                        </button>
                        <button
                            className="btn btn-info"
                            onClick={(e)=>handleViewLog({
                                e:e,
                                title:(<spam><i className="fa fa-info-circle" aria-hidden="true"></i> Log Job: {row.jobName}</spam>),
                                style: renderStatusCode(row.phase),
                                message:row.logs})}
                        >
                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                        </button>
                    </div>
                  );
                return {
                    jobName: row.jobName,
                    startTime: row.startTime,
                    completionTime: row.completionTime,
                    phase: _phase
                }
            })
        );
        return response;
    }catch(error){
        return history;
    }
}

const renderBackground = (phase) => {
    switch (phase) {
        case 'Success':
            return 'success';
        case 'Failed':
            return 'danger';
        case 'Running':
            return 'info';
        default:
            return 'warning'; 
    }
};

const renderIcon = (phase) => {
    switch (phase) {
        case 'Success':
            return 'fa fa-check';
        case 'Failed':
            return 'fa fa-close';
        case 'Running':
            return 'fa fa-play';
        default:
            return 'fa fa-question'; 
    }
};

const renderStatusCode = (phase) => {
    switch (phase) {
        case 'Success':
            return 200;
        case 'Failed':
            return -1;
        case 'Running':
            return 1;
        default:
            return -1; 
    }
};