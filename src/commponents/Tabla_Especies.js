import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import { IoMdPeople } from "react-icons/io";
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';
import '../Styles/Modal.css';

function Tabla_Especies() {
  const [Especies, setEspecies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controla el spinner
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla el modal de eliminar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controla el modal de agregar

  const obtenerEspecies = async (page, limit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/especies?page=${page + 1}&limit=${limit}`);
      const data = response.data;

      setEspecies(data.Especies);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error al obtener las especies: ", error);
    }
  };

  useEffect(() => {
    obtenerEspecies(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Mostrar datos en el modal
  const handleVer = (especie) => {
    setSelectedEspecie(especie);
    setIsEditable(false);
    setIsModalOpen(true);
  };

  const handleEditar = (especie) => {
    setSelectedEspecie(especie);
    setIsEditable(true);
    setIsModalOpen(true);
  };

  // Validación de campos requeridos con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    clasificacion: Yup.string().required('Campo obligatorio'),
    designacion: Yup.string().required('Campo obligatorio'),
    estatura: Yup.number().required('Campo obligatorio').typeError('Debe ser un número'),
    lenguaje: Yup.string().required('Campo obligatorio'),
  });

  // Guardar cambios en el backend
  const handleGuardar = async (values) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/especies/${selectedEspecie._id}`, values);
      console.log("Especie actualizada:", values);
      obtenerEspecies(page, rowsPerPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar la especie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar Especie
  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/especies/${selectedEspecie._id}`);
      console.log("Especie eliminada:", selectedEspecie._id);
      obtenerEspecies(page, rowsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la especie:", error);
    }
  };

  const handleAgregar = async (values) => {
    setIsLoading(true);
    try {
      const nuevaEspecie = {
        nombre: values.nombre,
        clasificacion: values.clasificacion,
        designacion: values.designacion,
        estatura: values.estatura,
        promedioVida: values.promedioVida,
        colorOjos: values.colorOjos,
        colorCabello: values.colorCabello,
        colorPiel: values.colorPiel,
        lenguaje: values.lenguaje,
        url: values.url,
      };
  
      const response = await axios.post('http://localhost:3000/api/especies', nuevaEspecie);
  
      if (response.status === 201) {
        obtenerEspecies(page, rowsPerPage); // Actualizar la lista de naves
        setIsAddModalOpen(false); // Cerrar el modal
      }
    } catch (error) {
      console.error("Error al agregar la especie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='Titulo'>
        <h1> <IoMdPeople className='icono' /> Peliculas</h1>
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
                <TableCell className="header-cell">Clasificacion</TableCell>
                <TableCell className="header-cell">Designacion</TableCell>
                <TableCell className="header-cell">Estatura</TableCell>
                <TableCell className="header-cell">Lenguaje</TableCell>
                <TableCell className="header-cell">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Especies.map((especie) => (
                <TableRow key={especie._id} className="body-row">
                  <TableCell className="body-cell">{especie.nombre}</TableCell>
                  <TableCell className="body-cell">{especie.clasificacion}</TableCell>
                  <TableCell className="body-cell">{especie.designacion}</TableCell>
                  <TableCell className="body-cell">{especie.estatura}</TableCell>
                  <TableCell className="body-cell">{especie.lenguaje}</TableCell>
                  <TableCell className="body-cell acciones">
                    <div className="ver" onClick={() => handleVer(especie)}>Ver</div>
                    <div className="editar" onClick={() => handleEditar(especie)}>Editar</div>
                    <div className="eliminar" onClick={() => { setSelectedEspecie(especie); setIsDeleteModalOpen(true); }}>Eliminar</div>
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
          <h2 className="modal-title">{isEditable ? "Editar Especie" : "Detalles de la especie"}</h2>
          <Formik
            initialValues={selectedEspecie || {}}
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

                <Field className='modal-field'
                  as={TextField}
                  name="clasificacion"
                  label="Clasificacion"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="clasificacion" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field'
                  as={TextField}
                  name="designacion"
                  label="Designacion"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="designacion" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field'
                  as={TextField}
                  name="estatura"
                  label="Estatura"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="estatura" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field className='modal-field'
                  as={TextField}
                  name="lenguaje"
                  label="Lenguaje"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="lenguaje" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                {isEditable && (
                  <Button
                    className="modal-submit-button"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting || isLoading}
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
          <h2>¿Seguro que deseas eliminar esta especie?</h2>
          <Button
            className="modal-confirm-button"
            variant="contained"
            color="error"
            onClick={handleEliminar}
          >
            Eliminar
          </Button>
          <Button
          className="modal-cancel-button"
          variant="outlined" 
          onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
        </Box>
      </Modal>

        {/* Modal de agregar especie */}
        <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box className="modal-container">
          <h2 className="modal-title">Agregar Nueva especie</h2>
          <Formik
              initialValues={{
                nombre: '',
                clasificacion: '',
                designacion: '',
                estatura: '',
                promedioVida: '',
                colorOjos: '',
                colorCabello: '',
                colorPiel: '',
                lenguaje: '',
                url: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleAgregar}
            >
              {({ isSubmitting }) => (
                <Form >
                  <Field className="modal-field" as={TextField} name="nombre" label="Nombre" fullWidth margin="normal" />
                  <ErrorMessage name="nombre" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="clasificacion" label="Clasificacion" fullWidth margin="normal" />
                  <ErrorMessage name="clasificacion" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="designacion" label="Designacion" fullWidth margin="normal" />
                  <ErrorMessage name="designacion" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="estatura" label="Estatura" fullWidth margin="normal" />
                  <ErrorMessage name="estatura" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="promedioVida" label="PromedioVida" fullWidth margin="normal" />
                  <ErrorMessage name="promedioVida" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="colorOjos" label="ColorOjos" fullWidth margin="normal" />
                  <ErrorMessage name="colorOjos" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="colorCabello" label="ColorCabello" fullWidth margin="normal" />
                  <ErrorMessage name="colorCabello" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="colorPiel" label="ColorPiel" fullWidth margin="normal" />
                  <ErrorMessage name="colorPiel" component="div" style={{ color: 'red' }} />

                  <Field className="modal-field" as={TextField} name="lenguaje" label="Lenguaje" fullWidth margin="normal" />
                  <ErrorMessage name="lenguaje" component="div" style={{ color: 'red' }} />

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

export default Tabla_Especies;
