import React from 'react';
// import Tabla_Personajes from './commponents/Tabla_Personajes';
// import Tabla_Planetas from './commponents/Tabla_Planetas';
// import Tabla_Peliculas from './commponents/Tabla_Peliculas';
// import Tabla_Naves from './commponents/Tabla_Naves';
// import Tabla_vehiculos from './commponents/Tabla_vehiculos';
// import Tabla_Especies from './commponents/Tabla_Especies';
import Prueba from './commponents/Prueba';
import Sidebar from './commponents/Slidebar';


function App() {
  return (
   <div style={{ display: "flex" }}>
        <Sidebar />
      <div className='ContenedorTablas'>
            <Prueba />
      </div>
    </div>
  );
}

export default App;
