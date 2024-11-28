import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination } from '@mui/material';
import '../Styles/Tabla.css';

function Tabla_Naves() {
  const [NavesEspaciales, setNavesEspaciales] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);  
  const [setTotalPages] = useState(0);  

  // Función para obtener planetas
  const obtenerNavesEspaciales = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/naves-espaciales?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setNavesEspaciales(data.NavesEspaciales); 
      setTotalCount(data.totalCount);  
      setTotalPages(data.totalPages);  
    } catch (error) {
      console.error("Error al obtener los personajes: ", error);
    }
  };


  useEffect(() => {
    obtenerNavesEspaciales(page, rowsPerPage);
  }, [page, rowsPerPage]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


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
                          <TableCell>Modelo</TableCell>
                          <TableCell>Clase</TableCell>
                          <TableCell>Tamaño</TableCell>
                          <TableCell>Pasajeros</TableCell>
                          <TableCell>Acciones</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {NavesEspaciales.map((naveEspacial) => (
                          <TableRow key={naveEspacial._id}>
                              <TableCell sx={{width: '20%'}}>{naveEspacial.nombre}</TableCell>
                              <TableCell>{naveEspacial.modelo}</TableCell>
                              <TableCell>{naveEspacial.clase}</TableCell>
                              <TableCell>{naveEspacial.tamaño}</TableCell>
                              <TableCell>{naveEspacial.numeroPasajeros}</TableCell>
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

export default Tabla_Naves;
