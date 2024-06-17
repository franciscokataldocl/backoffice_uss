import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useUserSupportStore } from '../../store/userSupportStore';
import Notify from '../Notification';

const NodesList = ({ data, onClick, breadcrumb }) => {

  const addAssignedNode = useUserSupportStore(state => state.addAssignedNode);
  const handleClick = (nodeData) => {
    onClick(nodeData);

  }

  const addToList = (item) => {
    item.route = breadcrumb.join(' > ');
    addAssignedNode(item)
    Notify({
      props: {
        message: `Nodo ${item.label} agregado a la lista`,
        type: 'info'
      }
    });
  }


  return (
    <>
      {data && data.length > 0 && (
        <ListGroup defaultActiveKey="#link1">
          {data.map(item => (
            <ListGroup.Item className='list-items' action key={item.value} >
              {item.label}
              <ButtonGroup size="sm" >
                <OverlayTrigger overlay={<Tooltip>{item.label}</Tooltip>}>
                  <Button variant="warning" onClick={() => addToList(item)}>Asignar</Button>
                </OverlayTrigger>
                <Button variant="info" onClick={() => handleClick({ value: item.value, label: item.label })}>Ingresar</Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  )
}

export default NodesList;

