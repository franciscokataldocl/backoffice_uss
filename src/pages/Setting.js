import React, { useState, lazy, Suspense } from 'react';
import menuOptions from '../components/configurations/menuOptions';

const Setting = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Función para manejar el clic en una opción de menú
  const handleMenuClick = (row) => {
    setSelectedOption(row.option);
    setSelectedRow(row);
  };

  const LazyLoadedComponent = selectedOption && selectedRow && selectedRow.component
    ? lazy(() => import(`../components/${selectedRow.component}`))
    : null;

  return (
    <div className="container mt-4">
      <div className="row" style={{maxHeight:'75%'}}>
        <div className="col-md-3">
          <h3>Opciones</h3>
          <ul className="list-group">
            {menuOptions(true).map((row, index) => (
              <li
                key={`${row.option}-${index}`}
                className={`list-group-item ${
                  selectedOption === row.option ? 'active' : ''
                }`}
                onClick={() => handleMenuClick(row)}
                style={{ cursor: 'pointer' }}
              >
                {row.option}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-9">
          <h3>{(selectedOption || 'Contenido').toLocaleUpperCase()}</h3>
          {selectedOption ? (
            <div className="">
              <Suspense fallback={<div>Cargando...</div>}>
                {LazyLoadedComponent !== null ? (
                  <LazyLoadedComponent />
                ) : (
                  <div className="alert alert-warning">
                    {`Contenido para la opción '${selectedOption}' no encontrado`}
                  </div>
                )}
              </Suspense>
            </div>
          ) : (
            <p>Selecciona una opción del menú para ver el contenido.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
