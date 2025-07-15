import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as Yup from 'yup';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom'; // ✅ ADDED Link

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().required('Password required'),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/'); // ✅ Redirect to dashboard
    } catch (error) {
      setErrors({ password: 'Invalid email or password' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>🔐 Login</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <label style={styles.label}>Email</label>
              <Field type="email" name="email" style={styles.input} />
              <ErrorMessage name="email" component="div" style={styles.error} />

              <label style={styles.label}>Password</label>
              <Field type="password" name="password" style={styles.input} />
              <ErrorMessage name="password" component="div" style={styles.error} />

              <button type="submit" disabled={isSubmitting} style={styles.button}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <p style={styles.note}>
          New user?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: '400px',
    transition: 'transform 0.3s ease',
  },
  label: {
    fontWeight: 600,
    display: 'block',
    marginBottom: '8px',
    marginTop: '18px',
    color: '#333',
    fontSize: '15px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  button: {
    marginTop: '30px',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease, transform 0.2s',
  },
  error: {
    color: '#e63946',
    fontSize: '13px',
    marginTop: '5px',
  },
  note: {
    marginTop: '25px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 500,
  },
};
