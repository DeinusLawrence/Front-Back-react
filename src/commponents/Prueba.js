import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, Modal, Box, Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import '../Styles/Tabla.css';

  // Validación de campos requeridos con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required('Nombre obligatorio'),
    fechaNacimiento: Yup.string().required('Fecha de nacimiento obligatoria'),
    genero: Yup.string().required('Genero obligatorio'),
    altura: Yup.number().required('Altura obligatoria').typeError('Debe ser un número'),
    masa: Yup.number().required('Masa obligatoria').typeError('Debe ser un número'),
  });

  //Estados
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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controla el modal de agregar

    //Obtener Personajes
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

    //Manejo de paginado
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    //Funciones de los modales
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

    const handleAgregar = async (values) => {
      setIsLoading(true);
      try {
        const nuevoPersonaje = {
          nombre: values.nombre,
          fechaNacimiento: values.fechaNacimiento,
          colorOjos: values.colorOjos,
          genero: values.genero,
          colorCabello: values.colorCabello,
          altura: values.altura,
          masa: values.masa,
          colorPiel: values.colorPiel,
          url: values.url,
        };
    
        // Agregar campos si estos tienen valor
        if (values.planetaNatal) {
          nuevoPersonaje.planetaNatal = values.planetaNatal;
        }

        if (values.peliculas.length > 0) {
          nuevoPersonaje.peliculas = values.peliculas; 
        }
        if (values.especies.length > 0) {
          nuevoPersonaje.especies = values.especies; 
        }
        if (values.navesEspaciales.length > 0) {
          nuevoPersonaje.navesEspaciales = values.navesEspaciales; 
        }
        if (values.vehiculos.length > 0) {
          nuevoPersonaje.vehiculos = values.vehiculos;
        }
    
        const response = await axios.post('http://localhost:3000/api/personajes', nuevoPersonaje);
    
        if (response.status === 201) {
          obtenerPersonajes(page, rowsPerPage); // Actualizar la lista de personajes
          setIsAddModalOpen(false); // Cerrar el modal
        }
      } catch (error) {
        console.error("Error al agregar el personaje:", error);
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
                    <div className="Ver" onClick={() => handleVer(personaje)}> Ver </div>
                    <div className="Editar" onClick={() => handleEditar(personaje)}> Editar </div>
                    <div className="Eliminar" onClick={() => { setSelectedPersonaje(personaje); setIsDeleteModalOpen(true); }}> Eliminar </div>
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
                  name="colorOjos"
                  label="ColorOjos"
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !isEditable }}
                />
                <ErrorMessage name="colorOjos" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />

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

      {/* Modal de agregar personaje */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box className="modal-content">
          <h2>Agregar Nuevo Personaje</h2>
          <Formik
            initialValues={{
              nombre: '',
              fechaNacimiento: '',
              colorOjos: '',
              genero: '',
              colorCabello: '',
              altura: '',
              masa: '',
              colorPiel: '',
              peliculas: [], // Array de IDs de películas (opcional)
              planetaNatal: '', // ID de planeta natal
              especies: [], // Array de IDs de especies (opcional)
              navesEspaciales: [], // Array de IDs de naves espaciales (opcional)
              vehiculos: [], // Array de IDs de vehículos (opcional)
              url: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleAgregar}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <Field as={TextField} name="nombre" label="Nombre" fullWidth margin="normal" />
                <ErrorMessage name="nombre" component="div" style={{ color: 'red' }} />

                <Field as={TextField} name="fechaNacimiento" label="Fecha de Nacimiento" fullWidth margin="normal" />
                <ErrorMessage name="fechaNacimiento" component="div" style={{ color: 'red' }} />

                <Field as={TextField} name="colorOjos" label="Color de Ojos" fullWidth margin="normal" />
                <ErrorMessage name="colorOjos" component="div" style={{ color: 'red' }} />

                <Field as={TextField} name="genero" label="Género" fullWidth margin="normal" />
                <ErrorMessage name="genero" component="div" style={{ color: 'red' }} />

                <Field as={TextField} name="colorCabello" label="Color de Cabello" fullWidth margin="normal" />
                <ErrorMessage name="colorCabello" component="div" style={{ color: 'red' }} />

                <Field as={TextField} name="altura" label="Altura" fullWidth margin="normal" />
                <ErrorMessage name="altura" component="div" style={{ color: 'red' }} />

                <Field as={TextField} name="masa" label="Masa" fullWidth margin="normal" />
                <ErrorMessage name="masa" component="div" style={{ color: 'red' }} />

                <Field as={TextField} name="colorPiel" label="Color de Piel" fullWidth margin="normal" />
                <ErrorMessage name="colorPiel" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  name="peliculas"
                  label="Películas"
                  fullWidth
                  margin="normal"
                  helperText="Introduce los IDs de las películas separadas por comas"
                  onChange={(e) => {
                    const inputValue = e.target.value.split(',').map((id) => id.trim());
                    setFieldValue('peliculas', inputValue);
                  }}
                />
                <ErrorMessage name="peliculas" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  name="especies"
                  label="Especies"
                  fullWidth
                  margin="normal"
                  helperText="Introduce los IDs de las especies separadas por comas"
                  onChange={(e) => {
                    const inputValue = e.target.value.split(',').map((id) => id.trim());
                    setFieldValue('especies', inputValue);
                  }}
                />
                <ErrorMessage name="especies" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  name="navesEspaciales"
                  label="Naves Espaciales"
                  fullWidth
                  margin="normal"
                  helperText="Introduce los IDs de las naves espaciales separadas por comas"
                  onChange={(e) => {
                    const inputValue = e.target.value.split(',').map((id) => id.trim());
                    setFieldValue('navesEspaciales', inputValue);
                  }}
                />
                <ErrorMessage name="navesEspaciales" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  name="vehiculos"
                  label="Vehículos"
                  fullWidth
                  margin="normal"
                  helperText="Introduce los IDs de los vehículos separadas por comas"
                  onChange={(e) => {
                    const inputValue = e.target.value.split(',').map((id) => id.trim());
                    setFieldValue('vehiculos', inputValue);
                  }}
                />
                <ErrorMessage name="vehiculos" component="div" style={{ color: 'red' }} />

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

export default Tabla_Personajes;
