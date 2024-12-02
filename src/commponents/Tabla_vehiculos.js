import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';

function Tabla_Vehiculos() {
  const [Vehiculos, setVehiculos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controla el spinner
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla el modal de eliminar

  const obtenerVehiculos = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/vehiculos?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setVehiculos(data.Vehiculos);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error al obtener los vehículos: ", error);
    }
  };

  useEffect(() => {
    obtenerVehiculos(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Mostrar datos en el modal
  const handleVer = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsEditable(false);
    setIsModalOpen(true);
  };

  const handleEditar = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsEditable(true);
    setIsModalOpen(true);
  };

  // Validación de campos requeridos con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    modelo: Yup.string().required('Campo obligatorio'),
    clase: Yup.string().required('Campo obligatorio'),
    tamaño: Yup.string().required('Campo obligatorio'),
    numeroPasajeros: Yup.number().required('Campo obligatorio').typeError('Debe ser un número'),
  });

  // Guardar cambios en el backend
  const handleGuardar = async (values) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/vehiculos/${selectedVehiculo._id}`, values);
      console.log("Vehículo actualizado:", values);
      obtenerVehiculos(page, rowsPerPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar vehículo
  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/vehiculos/${selectedVehiculo._id}`);
      console.log("Vehículo eliminado:", selectedVehiculo._id);
      obtenerVehiculos(page, rowsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
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
              {Vehiculos.map((vehiculo) => (
                <TableRow key={vehiculo._id}>
                  <TableCell sx={{ width: '20%' }}>{vehiculo.nombre}</TableCell>
                  <TableCell>{vehiculo.modelo}</TableCell>
                  <TableCell>{vehiculo.clase}</TableCell>
                  <TableCell>{vehiculo.tamaño}</TableCell>
                  <TableCell>{vehiculo.numeroPasajeros}</TableCell>
                  <TableCell className="Acciones">
                    <div className="Ver" onClick={() => handleVer(vehiculo)}>
                      Ver
                    </div>
                    <div className="Editar" onClick={() => handleEditar(vehiculo)}>
                      Editar
                    </div>
                    <div className="Eliminar" onClick={() => { setSelectedVehiculo(vehiculo); setIsDeleteModalOpen(true); }}>
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
        rowsPerPageOptions={[5, 10, 25, 100]}
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
          <h2>{isEditable ? "Editar Vehículo" : "Detalles del Vehículo"}</h2>
          <Formik
            initialValues={selectedVehiculo || {}}
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
                  label="Pasajeros"
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
          <Button
            variant="contained"
            color="error"
            onClick={handleEliminar}
            sx={{ mt: 2, mr: 2 }}
          >
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

export default Tabla_Vehiculos;
