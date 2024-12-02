import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';

function Tabla_Naves() {
  const [NavesEspaciales, setNavesEspaciales] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedNavesEspaciales, setSelectedNavesEspaciales] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controla el spinner
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla el modal de eliminar

  const obtenerNavesEspaciales = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/naves-espaciales?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setNavesEspaciales(data.NavesEspaciales);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error al obtener las naves: ", error);
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

  // Mostrar datos en el modal
  const handleVer = (naveEspacial) => {
    setSelectedNavesEspaciales(naveEspacial);
    setIsEditable(false);
    setIsModalOpen(true);
  };

  const handleEditar = (naveEspacial) => {
    setSelectedNavesEspaciales(naveEspacial);
    setIsEditable(true);
    setIsModalOpen(true);
  };

  // Validación de campos requeridos con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    modelo: Yup.string().required('Campo obligatorio'),
    clase: Yup.string().required('Campo obligatorio'),
    tamaño: Yup.number().required('Campo obligatoriop').typeError('Debe ser un número'),
    numeroPasajeros: Yup.number().required('Campo obligatorio').typeError('Debe ser un número'),
  });

  // Guardar cambios en el backend
  const handleGuardar = async (values) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/naves-espaciales/${selectedNavesEspaciales._id}`, values);
      console.log("Nave actualizada:", values);
      obtenerNavesEspaciales(page, rowsPerPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar la Nave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar NaveEspacial
  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/peliculas/${selectedNavesEspaciales._id}`);
      console.log("Nave eliminada:", selectedNavesEspaciales._id);
      obtenerNavesEspaciales(page, rowsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la nave:", error);
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
                  <TableCell sx={{ width: '20%' }}>{naveEspacial.nombre}</TableCell>
                  <TableCell>{naveEspacial.modelo}</TableCell>
                  <TableCell>{naveEspacial.clase}</TableCell>
                  <TableCell>{naveEspacial.tamaño}</TableCell>
                  <TableCell>{naveEspacial.numeroPasajeros}</TableCell>
                  <TableCell className="Acciones">
                    <div className="Ver" onClick={() => handleVer(naveEspacial)}>
                      Ver
                    </div>
                    <div className="Editar" onClick={() => handleEditar(naveEspacial)}>
                      Editar
                    </div>
                    <div className="Eliminar" onClick={() => { setSelectedNavesEspaciales(naveEspacial); setIsDeleteModalOpen(true); }}>
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
            initialValues={selectedNavesEspaciales || {}}
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
                  name="modelo"
                  label="Modelo"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="modelo" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="clase"
                  label="Clase"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="clase" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="tamaño"
                  label="Tamaño"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="tamaño" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="numeroPasajeros"
                  label="NumeroPasajeros"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="numeroPasajeros" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

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

export default Tabla_Naves;
