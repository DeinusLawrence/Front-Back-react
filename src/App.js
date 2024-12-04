import React, { useState } from 'react';
import Sidebar from './commponents/Slidebar';
import Tabla_Personajes from './commponents/Tabla_Personajes';
import Tabla_Planetas from './commponents/Tabla_Planetas';
import Tabla_Peliculas from './commponents/Tabla_Peliculas';
import Tabla_Naves from './commponents/Tabla_Naves';
import Tabla_vehiculos from './commponents/Tabla_vehiculos';
import Tabla_Especies from './commponents/Tabla_Especies';

function App() {
  const [selectedOption, setSelectedOption] = useState("Personajes");

  const renderContent = () => {
    switch (selectedOption) {
      case "Personajes":
        return <Tabla_Personajes />;
      case "Planetas":
        return <Tabla_Planetas />;
      case "Peliculas":
        return <Tabla_Peliculas />;
      case "Vehiculos":
        return <Tabla_vehiculos />;
      case "Naves Espaciales":
        return <Tabla_Naves />;
      case "Especies":
        return <Tabla_Especies />;
      default:
        return <div>Seleccione una opción</div>;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onSelectOption={setSelectedOption} />
      <div className="ContenedorTablas">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
