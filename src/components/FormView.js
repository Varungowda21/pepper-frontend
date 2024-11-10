import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "../config/axios";
import validator from "validator";

export default function FormView() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [clientErrors, setClientErrors] = useState({});
  const formErrors = {};

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get("/api/form/view/" + id);
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching form:", err);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (e, field) => {
    setFormResponses({ ...formResponses, [field]: e.target.value });
  };



  const validateForm = () => {
    formData.inputs.forEach((input) => {
      const value = formResponses[input.label] || "";
      if (!value) {
        formErrors[input.label] = `${input.label} is required`;
      }

      if (input.type === "number" && !validator.isNumeric(value)) {
        formErrors.isValidNumber = `${input.label} must be number`;
      }

      if (input.type === "email" && !validator.isEmail(value)) {
        formErrors.isvalidEmail = "Invalid email format";
      }
      if (
        input.type === "password" &&
        !validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        formErrors.isValidPassword = "Password should be strong";
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formResponses);
    console.log(formResponses);
    validateForm();
    if (Object.keys(formErrors).length == 0) {
      alert("Form submitted successfully!");
      setFormResponses({});
      setClientErrors({});
    } else {
      console.log(formErrors);
      setClientErrors(formErrors);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <Container>
      <h2 className="mt-5 mb-4">{formData.title}</h2>
      <Form onSubmit={handleSubmit} noValidate>
        {formData.inputs.map((input, index) => (
          <Form.Group key={index} as={Row} className="mb-3">
            <Form.Label column sm={4}>
              {input.label}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type={input.type}
                placeholder={input.placeholder}
                value={formResponses[input.label] || ""}
                onChange={(e) => handleChange(e, input.label)}
                required
              />
            </Col>
          </Form.Group>
        ))}
        {Object.keys(clientErrors).length > 0 && (
          <ul>
            {Object.values(clientErrors).map((ele, i) => {
              return (
                <li key={i} style={{ color: "red" }}>
                  {ele}
                </li>
              );
            })}
          </ul>
        )}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
