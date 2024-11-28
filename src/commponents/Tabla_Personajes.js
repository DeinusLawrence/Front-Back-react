import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination } from '@mui/material';
import '../Styles/Tabla.css';

function Tabla_Personajes() {
  const [personajes, setPersonajes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);  // Total de registros
  const [totalPages, setTotalPages] = useState(0);  // Total de páginas

  // Función para obtener personajes
  const obtenerPersonajes = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/personajes?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setPersonajes(data.personajes);  // Guardamos los personajes de la página solicitada
      setTotalCount(data.totalCount);  // Total de registros
      setTotalPages(data.totalPages);  // Total de páginas
    } catch (error) {
      console.error("Error al obtener los personajes: ", error);
    }
  };

  // Cargar personajes cuando cambie la página o el número de elementos por página
  useEffect(() => {
    obtenerPersonajes(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // Manejar cambios de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambios en la cantidad de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <><Paper>
          <TableContainer>
              <Table sx={{width: '100vh'}}>
                  <TableHead>
                      <TableRow sx={{width: '100vh'}}>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Fecha de Nacimiento</TableCell>
                          <TableCell>Género</TableCell>
                          <TableCell>Color de Ojos</TableCell>
                          <TableCell>Altura</TableCell>
                          <TableCell>Peso</TableCell>
                          <TableCell>Acciones</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {personajes.map((personaje) => (
                          <TableRow key={personaje._id}>
                              <TableCell sx={{width: '20%'}}>{personaje.nombre}</TableCell>
                              <TableCell>{personaje.fechaNacimiento}</TableCell>
                              <TableCell>{personaje.genero}</TableCell>
                              <TableCell>{personaje.colorOjos}</TableCell>
                              <TableCell>{personaje.altura}</TableCell>
                              <TableCell>{personaje.masa}</TableCell>
                              <TableCell className='Acciones'>
                                <div className='Ver'>
                                    Ver
                                </div>
                                <div  className='Editar'>
                                    Editar
                                </div>
                                <div  className='Eliminar'>
                                    Eliminar
                                </div>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>

      </Paper><div>
              <TablePagination
                  labelRowsPerPage="Registros por página"
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={totalCount} // Total de registros en la base de datos
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage} />
          </div></>
  );
}

export default Tabla_Personajes;
