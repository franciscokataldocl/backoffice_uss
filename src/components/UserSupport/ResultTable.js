import Table from 'react-bootstrap/Table';

const ResultTable = ({ usersData, rut }) => {
    return (
        <div className='py-5'>

            <h3 className='mb-3'>Hemos encontrado {usersData.length} resultados para el usuario {rut}</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nodos</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usersData.map((nodo, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{nodo.EXTERNAL_NODE_KEY}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>

    )
}

export default ResultTable