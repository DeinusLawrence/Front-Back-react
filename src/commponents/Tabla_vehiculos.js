import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import { IoCarSport } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';
import '../Styles/Modal.css';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controla el modal de agregar

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

  const handleAgregar = async (values) => {
    setIsLoading(true);
    try {
      const nuevoVehiculo = {
        nombre: values.nombre,
        modelo: values.modelo,
        clase: values.clase,
        tamaño: values.tamaño,
        numeroPasajeros: values.numeroPasajeros,
        velocidadMaximaAtmosferica: values.velocidadMaximaAtmosferica,
        capacidadMaxima: values.capacidadMaxima,
        tiempoMaximoConsumibles: values.tiempoMaximoConsumibles,
        url: values.url,
      };
  
      const response = await axios.post('http://localhost:3000/api/vehiculos', nuevoVehiculo);
  
      if (response.status === 201) {
        obtenerVehiculos(page, rowsPerPage); // Actualizar la lista de naves
        setIsAddModalOpen(false); // Cerrar el modal
      }
    } catch (error) {
      console.error("Error al agregar la nave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='Titulo'>
        <h1> <IoCarSport className='icono' /> Peliculas</h1>
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button className='Agregar_Boton' variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
          Agregar Registro
        </Button>
      </Box>
      <Paper>
        <TableContainer className="table-container">
          <Table className="custom-table">
            <TableHead>
              <TableRow className="header-row">
                <TableCell className="header-cell">Nombre</TableCell>
                <TableCell className="header-cell">Modelo</TableCell>
                <TableCell className="header-cell">Clase</TableCell>
                <TableCell className="header-cell">Tamaño</TableCell>
                <TableCell className="header-cell">Pasajeros</TableCell>
                <TableCell className="header-cell">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Vehiculos.map((vehiculo) => (
                <TableRow key={vehiculo._id} className="body-row">
                  <TableCell className="body-cell">{vehiculo.nombre}</TableCell>
                  <TableCell className="body-cell">{vehiculo.modelo}</TableCell>
                  <TableCell className="body-cell">{vehiculo.clase}</TableCell>
                  <TableCell className="body-cell">{vehiculo.tamaño}</TableCell>
                  <TableCell className="body-cell">{vehiculo.numeroPasajeros}</TableCell>
                  <TableCell className="body-cell acciones">
                    <div className="ver" onClick={() => handleVer(vehiculo)}> <FaEye className='Iconos' /> </div>
                    <div className="editar" onClick={() => handleEditar(vehiculo)}> <MdEdit className='Iconos' /> </div>
                    <div className="eliminar" onClick={() => { setSelectedVehiculo(vehiculo); setIsDeleteModalOpen(true); }}> <MdDelete className='Iconos' /> </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TablePagination
        className="paginacion-custom"
        labelRowsPerPage="Registros por página"
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal para Ver/Editar */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="modal-container">
          <h2 className="modal-title">{isEditable ? "Editar Vehículo" : "Detalles del Vehículo"}</h2>
          <Formik
            initialValues={selectedVehiculo || {}}
            validationSchema={isEditable ? validationSchema : null}
            onSubmit={(values) => handleGuardar(values)}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className='modal-form'>
                <Field className='modal-field'
                  as={TextField}
                  name="nombre"
                  label="Nombre"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="nombre" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="modelo" label="Modelo" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }}/>
                <ErrorMessage name="modelo" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="clase" label="Clase" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="clase" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="tamaño" label="Tamaño" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="tamaño" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="numeroPasajeros" label="Pasajeros" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="numeroPasajeros" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                {isEditable && (
                  <Button className="modal-submit-button"
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

      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="modal-content">
          <h2>¿Seguro que deseas eliminar este vehiculo?</h2>
          <Button className="modal-button-submit" variant="contained" color="error" onClick={handleEliminar}> Eliminar </Button>
          <Button className="modal-button-cancel" variant="outlined" onClick={() => setIsDeleteModalOpen(false)}> Cancelar </Button>
        </div>
      </Modal>

       {/* Modal de agregar vehiculo */}
       <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box className="modal-container">
          <h2  className="modal-title">Agregar Nuevo vehiculo</h2>
          <Formik
              initialValues={{
                nombre: '',
                modelo: '',
                clase: '',
                tamaño: '',
                numeroPasajeros: '',
                velocidadMaximaAtmosferica: '',
                capacidadMaxima: '',
                tiempoMaximoConsumibles: '',
                url: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleAgregar}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field className="modal-field" as={TextField} name="nombre" label="Nombre" fullWidth margin="normal" />
                  <ErrorMessage name="nombre" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="modelo" label="Modelo" fullWidth margin="normal" />
                  <ErrorMessage name="modelo" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="clase" label="Clase" fullWidth margin="normal" />
                  <ErrorMessage name="clase" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="tamaño" label="Tamaño" fullWidth margin="normal" />
                  <ErrorMessage name="tamaño" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="numeroPasajeros" label="Número de Pasajeros" fullWidth margin="normal" />
                  <ErrorMessage name="numeroPasajeros" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="velocidadMaximaAtmosferica" label="Velocidad Máxima Atmosférica" fullWidth margin="normal" />
                  <ErrorMessage name="velocidadMaximaAtmosferica" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="capacidadMaxima" label="CapacidadMaxima" fullWidth margin="normal" />
                  <ErrorMessage name="capacidadMaxima" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="tiempoMaximoConsumibles" label="Tiempo Máximo Consumibles" fullWidth margin="normal" />
                  <ErrorMessage name="tiempoMaximoConsumibles" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="url" label="URL" fullWidth margin="normal" />
                  <ErrorMessage name="url" component="div" style={{ color: 'red' }} />

                  <Button className="modal-submit-button" type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting || isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Agregar'}
                  </Button>
                </Form>
              )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
}

export default Tabla_Vehiculos;
