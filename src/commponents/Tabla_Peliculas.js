import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';

function Tabla_Peliculas() {
  const [Peliculas, setPeliculas] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPeliculas, setSelectedPeliculas] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controla el spinner
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla el modal de eliminar

  const obtenerPeliculas = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/peliculas?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setPeliculas(data.peliculas);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error al obtener los planetas: ", error);
    }
  };

  useEffect(() => {
    obtenerPeliculas(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Mostrar datos en el modal
  const handleVer = (pelicula) => {
    setSelectedPeliculas(pelicula);
    setIsEditable(false);
    setIsModalOpen(true);
  };

  const handleEditar = (pelicula) => {
    setSelectedPeliculas(pelicula);
    setIsEditable(true);
    setIsModalOpen(true);
  };

  // Validación de campos requeridos con Yup
  const validationSchema = Yup.object({
    titulo: Yup.string().required('Campo obligatorio'),
    director: Yup.string().required('Campo obligatorio'),
    productor: Yup.string().required('Campo obligatorio'),
  });

  // Guardar cambios en el backend
  const handleGuardar = async (values) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/peliculas/${selectedPeliculas._id}`, values);
      console.log("Pelicula actualizada:", values);
      obtenerPeliculas(page, rowsPerPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar la pelicula:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar Pelicula
  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/peliculas/${selectedPeliculas._id}`);
      console.log("Pelicula eliminada:", selectedPeliculas._id);
      obtenerPeliculas(page, rowsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la pelicula:", error);
    }
  };

  return (
    <>
      <Paper>
        <TableContainer>
          <Table sx={{ width: '100vh' }}>
            <TableHead>
              <TableRow sx={{ width: '100vh' }}>
              <TableCell>titulo</TableCell>
              <TableCell>Director</TableCell>
              <TableCell>Productor</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Peliculas.map((pelicula) => (
                <TableRow key={pelicula._id}>
                  <TableCell sx={{ width: '20%' }}>{pelicula.titulo}</TableCell>
                  <TableCell>{pelicula.director}</TableCell>
                  <TableCell>{pelicula.productor}</TableCell>
                  <TableCell className="Acciones">
                    <div className="Ver" onClick={() => handleVer(pelicula)}>
                      Ver
                    </div>
                    <div className="Editar" onClick={() => handleEditar(pelicula)}>
                      Editar
                    </div>
                    <div className="Eliminar" onClick={() => { setSelectedPeliculas(pelicula); setIsDeleteModalOpen(true); }}>
                      Eliminar
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TablePagination
        labelRowsPerPage="Registros por página"
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal para Ver/Editar */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', width: 400, mt: 5 }}>
          <h2>{isEditable ? "Editar Peelicula" : "Detalles de la pelicula"}</h2>
          <Formik
            initialValues={selectedPeliculas || {}}
            validationSchema={isEditable ? validationSchema : null}
            onSubmit={(values) => handleGuardar(values)}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  name="titulo"
                  label="Titulo"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="titulo" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="director"
                  label="Director"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="director" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="productor"
                  label="Productor"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="productor" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                {isEditable && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting || isLoading}
                    sx={{ mt: 2 }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : "Guardar"}
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', width: 400, mt: 5, textAlign: 'center' }}>
          <h2>¿Seguro que deseas eliminar este registro?</h2>
          <Button variant="contained" color="error" onClick={handleEliminar} sx={{ mt: 2, mr: 2 }}>
            Sí, eliminar
          </Button>
          <Button variant="outlined" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Tabla_Peliculas;
