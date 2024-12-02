import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';

function Tabla_Personajes() {
  const [Personajes, setPersonajes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPersonaje, setSelectedPersonaje] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controla el spinner
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla el modal de eliminar

  const obtenerPersonajes = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/personajes?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setPersonajes(data.personajes);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error al obtener los planetas: ", error);
    }
  };

  useEffect(() => {
    obtenerPersonajes(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Mostrar datos en el modal
  const handleVer = (personaje) => {
    setSelectedPersonaje(personaje);
    setIsEditable(false);
    setIsModalOpen(true);
  };

  const handleEditar = (personaje) => {
    setSelectedPersonaje(personaje);
    setIsEditable(true);
    setIsModalOpen(true);
  };

  // Validación de campos requeridos con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    fechaNacimiento: Yup.string().required('Campo obligatorio'),
    genero: Yup.string().required('Campo obligatorio'),
    colorOjos: Yup.string().required('Campo obligatorio'),
    altura: Yup.number().required('Campo obligatorio').typeError('Debe ser un número'),
    masa: Yup.number().required('Campo obligatorio').typeError('Debe ser un número'),
  });

  // Guardar cambios en el backend
  const handleGuardar = async (values) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/personajes/${selectedPersonaje._id}`, values);
      console.log("Personaje actualizado:", values);
      obtenerPersonajes(page, rowsPerPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el personaje:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar Planeta
  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/personajes/${selectedPersonaje._id}`);
      console.log("Personaje eliminado:", selectedPersonaje._id);
      obtenerPersonajes(page, rowsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el personaje:", error);
    }
  };

  return (
    <>
      <Paper>
        <TableContainer>
          <Table sx={{ width: '100vh' }}>
            <TableHead>
              <TableRow sx={{ width: '100vh' }}>
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
              {Personajes.map((personaje) => (
                <TableRow key={personaje._id}>
                  <TableCell sx={{ width: '20%' }}>{personaje.nombre}</TableCell>
                  <TableCell>{personaje.fechaNacimiento}</TableCell>
                  <TableCell>{personaje.genero}</TableCell>
                  <TableCell>{personaje.colorOjos}</TableCell>
                  <TableCell>{personaje.altura}</TableCell>
                  <TableCell>{personaje.masa}</TableCell>
                  <TableCell className="Acciones">
                    <div className="Ver" onClick={() => handleVer(personaje)}>
                      Ver
                    </div>
                    <div className="Editar" onClick={() => handleEditar(personaje)}>
                      Editar
                    </div>
                    <div className="Eliminar" onClick={() => { setSelectedPersonaje(personaje); setIsDeleteModalOpen(true); }}>
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
          <h2>{isEditable ? "Editar Personaje" : "Detalles del personaje"}</h2>
          <Formik
            initialValues={selectedPersonaje || {}}
            validationSchema={isEditable ? validationSchema : null}
            onSubmit={(values) => handleGuardar(values)}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  name="nombre"
                  label="Nombre"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="nombre" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="fechaNacimiento"
                  label="FechaNacimiento"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="fechaNacimiento" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="genero"
                  label="Genero"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="genero" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="colorOjo"
                  label="ColorOjo"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="colorOjo" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="altura"
                  label="Altura"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="altura" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="masa"
                  label="Masa"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="masa" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

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

export default Tabla_Personajes;
