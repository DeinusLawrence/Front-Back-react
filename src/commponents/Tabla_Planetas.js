import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import { IoMdPlanet } from "react-icons/io";
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';
import '../Styles/Modal.css';

function Tabla_Planetas() {
  const [Planetas, setPlanetas] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPlaneta, setSelectedPlaneta] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controla el spinner
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla el modal de eliminar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controla el modal de agregar

  const obtenerPlanetas = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/planetas?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setPlanetas(data.planetas);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error al obtener los planetas: ", error);
    }
  };

  useEffect(() => {
    obtenerPlanetas(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Mostrar datos en el modal
  const handleVer = (planeta) => {
    setSelectedPlaneta(planeta);
    setIsEditable(false);
    setIsModalOpen(true);
  };

  const handleEditar = (planeta) => {
    setSelectedPlaneta(planeta);
    setIsEditable(true);
    setIsModalOpen(true);
  };

  // Validación de campos requeridos con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    diametro: Yup.number().required('Campo obligatorio').typeError('Debe ser un número'),
    poblacion: Yup.number().required('Campo obligatorio').typeError('Debe ser un número'),
    clima: Yup.string().required('Campo obligatorio'),
    terreno: Yup.string().required('Campo obligatorio'),
  });

  // Guardar cambios en el backend
  const handleGuardar = async (values) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/planetas/${selectedPlaneta._id}`, values);
      console.log("Planeta actualizado:", values);
      obtenerPlanetas(page, rowsPerPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el planeta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar Planeta
  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/planetas/${selectedPlaneta._id}`);
      console.log("Planeta eliminado:", selectedPlaneta._id);
      obtenerPlanetas(page, rowsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el planeta:", error);
    }
  };

  const handleAgregar = async (values) => {
    setIsLoading(true);
    try {
      const nuevoPlaneta = {
        nombre: values.nombre,
        diametro: values.diametro,
        poblacion: values.poblacion,
        clima: values.clima,
        terreno: values.terreno,
        url: values.url,
      };
  
      const response = await axios.post('http://localhost:3000/api/planetas', nuevoPlaneta);
  
      if (response.status === 201) {
        obtenerPlanetas(page, rowsPerPage); // Actualizar la lista de naves
        setIsAddModalOpen(false); // Cerrar el modal
      }
    } catch (error) {
      console.error("Error al agregar el planeta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <> 
    <div className='Titulo'>
      <h1> <IoMdPlanet className='icono' /> Planetas</h1>
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
                <TableCell className="header-cell">Diametro</TableCell>
                <TableCell className="header-cell">Poblacion</TableCell>
                <TableCell className="header-cell">Clima</TableCell>
                <TableCell className="header-cell">Terreno</TableCell>
                <TableCell className="header-cell">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Planetas.map((planeta) => (
                <TableRow key={planeta._id} className="body-row">
                  <TableCell className="body-cell">{planeta.nombre}</TableCell>
                  <TableCell className="body-cell">{planeta.diametro}</TableCell>
                  <TableCell className="body-cell">{planeta.poblacion}</TableCell>
                  <TableCell className="body-cell">{planeta.clima}</TableCell>
                  <TableCell className="body-cell">{planeta.terreno}</TableCell>
                  <TableCell className="body-cell acciones">
                    <div className="ver" onClick={() => handleVer(planeta)}>ver</div>
                    <div className="editar" onClick={() => handleEditar(planeta)}>Editar</div>
                    <div className="eliminar" onClick={() => { setSelectedPlaneta(planeta); setIsDeleteModalOpen(true); }}>Eliminar</div>
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

      {/* Modal para Ver/Editar */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="modal-container">
          <h2 className="modal-title">{isEditable ? "Editar Planeta" : "Detalles del planeta"}</h2>
          <Formik
            initialValues={selectedPlaneta || {}}
            validationSchema={isEditable ? validationSchema : null}
            onSubmit={(values) => handleGuardar(values)}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className='modal-form'>
                <Field className='modal-field' as={TextField} name="nombre" label="Nombre" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="nombre" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="diametro" label="Diametro" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="diametro" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="poblacion" label="Poblacion" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="poblacion" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="clima" label="Clima" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="clima" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field' as={TextField} name="terreno" label="Terreno" fullWidth margin="normal" InputProps={{ readOnly: !isEditable }} />
                <ErrorMessage name="terreno" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

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

      {/* Modal de confirmación para eliminar */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', width: 400, mt: 5, textAlign: 'center' }}>
          <h2>¿Seguro que deseas eliminar este planeta?</h2>
          <Button variant="contained" color="error" onClick={handleEliminar}>
            Eliminar
          </Button>
          <Button className="modal-cancel-button" variant="outlined" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      {/* Modal de agregar vehiculo */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box className="modal-container">
          <h2 className="modal-title">Agregar Nuevo planeta</h2>
          <Formik
              initialValues={{
                nombre: '',
                diametro: '',
                poblacion: '',
                clima: '',
                terreno: '',
                url: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleAgregar}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field className="modal-field" as={TextField} name="nombre" label="Nombre" fullWidth margin="normal" />
                  <ErrorMessage name="nombre" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="diametro" label="Diametro" fullWidth margin="normal" />
                  <ErrorMessage name="diametro" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="poblacion" label="Poblacion" fullWidth margin="normal" />
                  <ErrorMessage name="poblacion" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="clima" label="clima" fullWidth margin="normal" />
                  <ErrorMessage name="clima" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="terreno" label="Terreno" fullWidth margin="normal" />
                  <ErrorMessage name="terreno" component="div" style={{ color: 'red' }} />

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

export default Tabla_Planetas;
