export const IntegratingPartner = (status) => {
    const data = [
        {
            code: 'MD-1',
            title: 'MD-1',
            status: true
        },
        {
            code: 'MD-3',
            title: 'MD-3',
            status: true
        },
        {
            code: 'MD-1',
            title: 'MD-1',
            status: true
        }
    ];
    const _data = data.filter(row => row.status === status??true)
    return _data; 
}