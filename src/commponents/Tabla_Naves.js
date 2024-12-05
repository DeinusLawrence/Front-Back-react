import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import { GiSpaceship } from "react-icons/gi";
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';
import '../Styles/Modal.css';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controla el modal de agregar

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

  const validationSchema = Yup.object({
    nombre: Yup.string().required('Nombre obligatorio'),
    modelo: Yup.string().required('Modelo obligatorio'),
    clase: Yup.string().required('Clase obligatorio'),
    tamaño: Yup.number().required('Tamaño obligatorio').typeError('Debe ser un número'),
    numeroPasajeros: Yup.number().required('Numero de pasajeros obligatorio').typeError('Debe ser un número'),
  });

  const handleGuardar = async (values) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/naves-espaciales/${selectedNavesEspaciales._id}`, values);
      obtenerNavesEspaciales(page, rowsPerPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar la nave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/naves-espaciales/${selectedNavesEspaciales._id}`);
      obtenerNavesEspaciales(page, rowsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la nave:", error);
    }
  };

  const handleAgregar = async (values) => {
    setIsLoading(true);
    try {
      const nuevaNave = {
        nombre: values.nombre,
        modelo: values.modelo,
        clase: values.clase,
        tamaño: values.tamaño,
        numeroPasajeros: values.numeroPasajeros,
        velocidadMaximaAtmosferica: values.velocidadMaximaAtmosferica,
        hiperimpulsor: values.hiperimpulsor,
        MGLT: values.MGLT,
        capacidadCarga: values.capacidadCarga,
        tiempoMaximoConsumibles: values.tiempoMaximoConsumibles,
        url: values.url,
      };
  
      const response = await axios.post('http://localhost:3000/api/naves-espaciales', nuevaNave);
  
      if (response.status === 201) {
        obtenerNavesEspaciales(page, rowsPerPage); // Actualizar la lista de naves
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
        <h1> <GiSpaceship className='icono' /> Peliculas</h1>
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
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
              {NavesEspaciales.map((naveEspacial) => (
                <TableRow key={naveEspacial._id} className="body-row">
                  <TableCell className="body-cell">{naveEspacial.nombre}</TableCell>
                  <TableCell className="body-cell">{naveEspacial.modelo}</TableCell>
                  <TableCell className="body-cell">{naveEspacial.clase}</TableCell>
                  <TableCell className="body-cell">{naveEspacial.tamaño}</TableCell>
                  <TableCell className="body-cell">{naveEspacial.numeroPasajeros}</TableCell>
                  <TableCell className="body-cell acciones">
                    <div className='ver' onClick={() => handleVer(naveEspacial)}>Ver</div>
                    <div className='editar' onClick={() => handleEditar(naveEspacial)}>Editar</div>
                    <div className='eliminar' onClick={() => { setSelectedNavesEspaciales(naveEspacial); setIsDeleteModalOpen(true); }}>Eliminar</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TablePagination
        labelRowsPerPage="Registros por página"
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal de Ver/Editar Nave */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="modal-container">
          <h2 className="modal-title">{isEditable ? "Editar Nave" : "Detalles de la nave"}</h2>
          <Formik
            initialValues={selectedNavesEspaciales || {}}
            validationSchema={isEditable ? validationSchema : null}
            onSubmit={handleGuardar}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <Field className='modal-form' as={TextField} name="nombre" label="Nombre" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="nombre" component="div" style={{ color: 'red' }} />

                <Field className='modal-field' as={TextField} name="modelo" label="Modelo" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="modelo" component="div" style={{ color: 'red' }} />

                <Field className='modal-field' as={TextField} name="clase" label="Clase" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="clase" component="div" style={{ color: 'red' }} />

                <Field className='modal-field' as={TextField} name="tamaño" label="Tamaño" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="tamaño" component="div" style={{ color: 'red' }} />

                <Field className='modal-field' as={TextField} name="numeroPasajeros" label="Pasajeros" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="numeroPasajeros" component="div" style={{ color: 'red' }} />

                {isEditable && (
                  <Button className="modal-submit-button" type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting || isLoading}>
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
          <h2>¿Seguro que deseas eliminar esta nave?</h2>
          <Button className="modal-confirm-button" variant="contained" color="secondary" onClick={handleEliminar} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Eliminar"}
          </Button>
          <Button className="modal-cancel-button" variant="outlined" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      {/* Modal de agregar nave */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box className="modal-container">
          <h2 className="modal-title">Agregar Nueva Nave</h2>
          <Formik
              initialValues={{
                nombre: '',
                modelo: '',
                clase: '',
                tamaño: '',
                numeroPasajeros: '',
                velocidadMaximaAtmosferica: '',
                hiperimpulsor: '',
                MGLT: '',
                capacidadCarga: '',
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

                  <Field className="modal-field" as={TextField} name="hiperimpulsor" label="Hiperimpulsor" fullWidth margin="normal" />
                  <ErrorMessage name="hiperimpulsor" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="MGLT" label="MGLT" fullWidth margin="normal" />
                  <ErrorMessage name="MGLT" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="capacidadCarga" label="Capacidad de Carga" fullWidth margin="normal" />
                  <ErrorMessage name="capacidadCarga" component="div" style={{ color: 'red' }} />

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

export default Tabla_Naves;
