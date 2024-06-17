import React, { useEffect, useState } from 'react'
import { getInstitutionalHierarchyUSSApi, getInstitutionalHierarchyWithNode } from '../../context/data/APIs';

import NodesList from './NodesList';
import { Alert, Button } from 'react-bootstrap';

const NodesSelect = () => {

    const [hierarchyOne, setHierarchyOne] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [showBackButton, setShowBackButton] = useState(false);
    

    const getInstitutionalHierarchy = async () => {
        setShowBackButton(false)

        try {
            const dataApi = await getInstitutionalHierarchyUSSApi();
            setHierarchyOne(
                dataApi.map((item) => ({ label: item.title, value: item.id }))
            );
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getInstitutionalHierarchy();
    }, [])



    const getNextHierarchy = async (data) => {
        try {
            let dataApi;
            dataApi = await getInstitutionalHierarchyWithNode(data.value);

            setShowBackButton(true)

            const produccionObject = dataApi.find(item => item.title === 'Producción');

            if(produccionObject != undefined){
                dataApi = await getInstitutionalHierarchyWithNode(produccionObject.id);
            }

            let nodes = [];
            dataApi.map(item => {
                const newNode = {
                    value: item.id,
                    label: item.title
                }
                nodes.push(newNode);
                return null;
            })
            setHierarchyOne(nodes)
            setBreadcrumb(prevBreadcrumb => [...prevBreadcrumb, data.label]);
        } catch (error) {
            console.log(error)
        }
    }

    const backStep = () => {
        setHierarchyOne([])
        getInstitutionalHierarchy();
        setBreadcrumb([])
    }


    return (

        <>
            {hierarchyOne && hierarchyOne.length > 0 ?
                <NodesList data={hierarchyOne} onClick={getNextHierarchy} breadcrumb={breadcrumb}/> 
                :
                <Alert variant="warning">No existen mas nodos para mostrar</Alert>}
            {showBackButton && <Button variant="secondary" className='mt-2 pull-right' onClick={() => backStep()}>Volver</Button>}
        </>
    )
}

export default NodesSelect