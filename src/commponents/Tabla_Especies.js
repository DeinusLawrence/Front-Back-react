import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
          Agregar Registro
        </Button>
      </Box>
      <Paper>
        <TableContainer>
          <Table sx={{ width: '100vh' }}>
            <TableHead>
              <TableRow sx={{ width: '100vh' }}>
                <TableCell>Nombre</TableCell>
                <TableCell>Clasificacion</TableCell>
                <TableCell>Designacion</TableCell>
                <TableCell>Estatura</TableCell>
                <TableCell>Lenguaje</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Especies.map((especie) => (
                <TableRow key={especie._id}>
                  <TableCell sx={{ width: '20%' }}>{especie.nombre}</TableCell>
                  <TableCell>{especie.clasificacion}</TableCell>
                  <TableCell>{especie.designacion}</TableCell>
                  <TableCell>{especie.estatura}</TableCell>
                  <TableCell>{especie.lenguaje}</TableCell>
                  <TableCell className="Acciones">
                    <div className="Ver" onClick={() => handleVer(especie)}>
                      Ver
                    </div>
                    <div className="Editar" onClick={() => handleEditar(especie)}>
                      Editar
                    </div>
                    <div className="Eliminar" onClick={() => { setSelectedEspecie(especie); setIsDeleteModalOpen(true); }}>
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
          <h2>{isEditable ? "Editar Especie" : "Detalles de la especie"}</h2>
          <Formik
            initialValues={selectedEspecie || {}}
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
                  name="clasificacion"
                  label="Clasificacion"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="clasificacion" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="designacion"
                  label="Designacion"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="designacion" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="estatura"
                  label="Estatura"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="estatura" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
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

        {/* Modal de agregar especie */}
        <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box className="modal-content">
          <h2>Agregar Nueva especie</h2>
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
                <Form>
                  <Field as={TextField} name="nombre" label="Nombre" fullWidth margin="normal" />
                  <ErrorMessage name="nombre" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="clasificacion" label="Clasificacion" fullWidth margin="normal" />
                  <ErrorMessage name="clasificacion" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="designacion" label="Designacion" fullWidth margin="normal" />
                  <ErrorMessage name="designacion" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="estatura" label="Estatura" fullWidth margin="normal" />
                  <ErrorMessage name="estatura" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="promedioVida" label="PromedioVida" fullWidth margin="normal" />
                  <ErrorMessage name="promedioVida" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="colorOjos" label="ColorOjos" fullWidth margin="normal" />
                  <ErrorMessage name="colorOjos" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="colorCabello" label="ColorCabello" fullWidth margin="normal" />
                  <ErrorMessage name="colorCabello" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="colorPiel" label="ColorPiel" fullWidth margin="normal" />
                  <ErrorMessage name="colorPiel" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="lenguaje" label="Lenguaje" fullWidth margin="normal" />
                  <ErrorMessage name="lenguaje" component="div" style={{ color: 'red' }} />

                  <Field as={TextField} name="url" label="URL" fullWidth margin="normal" />
                  <ErrorMessage name="url" component="div" style={{ color: 'red' }} />

                  <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting || isLoading}>
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
