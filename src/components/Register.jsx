// src/components/Register.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>👤 Register</h2>

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
          <div>
            <label>Email</label>
            <Field name="email" type="email" className="form-control" />
            <ErrorMessage name="email" component="div" style={{ color: "red" }} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>Password</label>
            <Field name="password" type="password" className="form-control" />
            <ErrorMessage name="password" component="div" style={{ color: "red" }} />
          </div>

          <button type="submit" style={{ marginTop: 20, padding: 10, background: "green", color: "white", border: "none", borderRadius: 5 }}>
            📝 Register
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
