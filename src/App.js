import React from 'react';
import Formulario from '../src/commponents/Formulario';
import Tabla_Personajes from './commponents/Tabla_Personajes';
import Tabla_Planetas from './commponents/Tabla_Planetas';
import Tabla_Peliculas from './commponents/Tabla_Peliculas';
import Tabla_Naves from './commponents/Tabla_Naves';
import Tabla_vehiculos from './commponents/Tabla_vehiculos';
import Tabla_Especies from './commponents/Tabla_Especies';


function App() {
  return (
    <div className="App">
        <Tabla_Especies />
    </div>
  );
}

export default App;
