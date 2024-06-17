import Table from 'react-bootstrap/Table';
import { useUserSupportStore } from '../../store/userSupportStore';
import { Button } from 'react-bootstrap';
import { Trash2Fill } from 'react-bootstrap-icons';
import Notify from '../Notification';
import { addUserToNode } from '../../context/data/APIs';



const TabLeAsignation = () => {
    const asignedNodeList = useUserSupportStore(state => state.asignedNodeList);
    const removeAssignedNode = useUserSupportStore(state => state.removeAssignedNode);
    const clearState = useUserSupportStore(state => state.clearState);
    const user = useUserSupportStore(state => state.user);



    const storeUserNodes = async () => {
        const nodes = asignedNodeList.map(node => node.value);
        const userAndNodeToSave = {
            userId: user.userId,
            nodes: nodes
        };
        try {
            const response = await addUserToNode(userAndNodeToSave);
            if(response.statusCode == 200){
              Notify({
                props: {
                message: `Usuario asignado a nodos correctamente`,
                type: 'success'
                }
            });
            clearState();
            }
        } catch (error) {
            console.log('error al asignar usuario a nodos', error)
        }
    };

const removeItem = (item) =>{
    removeAssignedNode(item.value)
    Notify({
        props: {
        message: `Nodo ${item.label} eliminado de la lista`,
        type: 'warning'
        }
    });
}

  return (

   <div className='asigned-list'>
   <p>Estas asignando al usuario <strong>{user.userName}</strong> los siguientes nodos:</p>
    <Table striped bordered hover className='mt-2 mb-3'>
      <thead>
        <tr>
          <th>id Nodo</th>
          <th>Ruta</th>
          <th>Nombre</th>
          <th>Eliminar</th>
          
        </tr>
      </thead>
      <tbody>
        {asignedNodeList.map((item) => (
            <tr key={`${item.id}${item.value}`}>
            <td>{item.value}</td>
            <td>{item.route}</td>
            <td>{item.label}</td>
            <td className='text-center'> <Button className="" variant="danger" onClick={()=> removeItem(item)}><Trash2Fill /></Button></td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Button className="pull-right" variant="primary" onClick={()=> storeUserNodes()}>Guardar</Button>
    
   </div>
  )
}

export default TabLeAsignation