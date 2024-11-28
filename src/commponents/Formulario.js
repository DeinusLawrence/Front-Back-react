import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../Styles/From.css';  // Asegúrate de tener el archivo CSS en el mismo directorio

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es obligatorio'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio')
});

function MyForm() {
  return (
    <div className="form-container">
      <h1>Formulario de Registro</h1>
      <Formik
        initialValues={{ name: '', email: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <Field
                type="text"
                id="name"
                name="name"
                className="form-input"
              />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="form-input"
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <button type="submit" className="submit-btn">Enviar</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default MyForm;
