// // src/components/Register.jsx
// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();

//   return (
//     <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
//       <h2>👤 Register</h2>

//       <Formik
//         initialValues={{ email: "", password: "" }}
//         validationSchema={Yup.object({
//           email: Yup.string().email("Invalid email").required("Required"),
//           password: Yup.string().min(6, "Min 6 characters").required("Required"),
//         })}
//         onSubmit={async (values, { setSubmitting, setErrors }) => {
//           try {
//             await createUserWithEmailAndPassword(auth, values.email, values.password);
//             alert("✅ Registered successfully!");
//             navigate("/login");
//           } catch (err) {
//             setErrors({ email: "❌ " + err.message });
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         <Form>
//           <div>
//             <label>Email</label>
//             <Field name="email" type="email" className="form-control" />
//             <ErrorMessage name="email" component="div" style={{ color: "red" }} />
//           </div>

//           <div style={{ marginTop: 10 }}>
//             <label>Password</label>
//             <Field name="password" type="password" className="form-control" />
//             <ErrorMessage name="password" component="div" style={{ color: "red" }} />
//           </div>

//           <button type="submit" style={{ marginTop: 20, padding: 10, background: "green", color: "white", border: "none", borderRadius: 5 }}>
//             📝 Register
//           </button>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default Register;



import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Register</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email").required("Required"),
            password: Yup.string().min(6, "Min 6 characters").required("Required"),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await createUserWithEmailAndPassword(auth, values.email, values.password);
              alert("✅ Registered successfully!");
              navigate("/login");
            } catch (err) {
              setErrors({ email: "❌ " + err.message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form>
            <label style={styles.label}>Email</label>
            <Field name="email" type="email" style={styles.input} />
            <ErrorMessage name="email" component="div" style={styles.error} />

            <label style={styles.label}>Password</label>
            <Field name="password" type="password" style={styles.input} />
            <ErrorMessage name="password" component="div" style={styles.error} />

            <button type="submit" style={styles.button}>
              📝 Register
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;

// 🎨 Styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    marginBottom: "25px",
    textAlign: "center",
    fontSize: "24px",
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "6px",
    marginTop: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "4px",
  },
  button: {
    marginTop: "25px",
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
};
