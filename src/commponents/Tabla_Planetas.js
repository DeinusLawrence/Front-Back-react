import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';

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

  return (
    <>
      <Paper>
        <TableContainer>
          <Table sx={{ width: '100vh' }}>
            <TableHead>
              <TableRow sx={{ width: '100vh' }}>
                <TableCell>Nombre</TableCell>
                <TableCell>Diametro</TableCell>
                <TableCell>Poblacion</TableCell>
                <TableCell>Clima</TableCell>
                <TableCell>Terreno</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Planetas.map((planeta) => (
                <TableRow key={planeta._id}>
                  <TableCell sx={{ width: '20%' }}>{planeta.nombre}</TableCell>
                  <TableCell>{planeta.diametro}</TableCell>
                  <TableCell>{planeta.poblacion}</TableCell>
                  <TableCell>{planeta.clima}</TableCell>
                  <TableCell>{planeta.terreno}</TableCell>
                  <TableCell className="Acciones">
                    <div className="Ver" onClick={() => handleVer(planeta)}>
                      Ver
                    </div>
                    <div className="Editar" onClick={() => handleEditar(planeta)}>
                      Editar
                    </div>
                    <div className="Eliminar" onClick={() => { setSelectedPlaneta(planeta); setIsDeleteModalOpen(true); }}>
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
          <h2>{isEditable ? "Editar Planeta" : "Detalles del planeta"}</h2>
          <Formik
            initialValues={selectedPlaneta || {}}
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
                  name="diametro"
                  label="Diametro"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="diametro" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="poblacion"
                  label="Poblacion"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="poblacion" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="clima"
                  label="Clima"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="clima" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

                <Field
                  as={TextField}
                  name="terreno"
                  label="Terreno"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="terreno" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

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

export default Tabla_Planetas;
