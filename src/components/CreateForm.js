import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, InputGroup, Container } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./FormBuilder.css";
import axios from "../config/axios";
import Swal from "sweetalert2";
import { MdModeEdit, MdDelete } from "react-icons/md";

export default function CreateForm() {
  const [formTitle, setFormTitle] = useState("");
  const [inputs, setInputs] = useState([]);
  const [editingInput, setEditingInput] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  const [newPlaceholder, setNewPlaceholder] = useState("");

  const input = inputs.find((ele) => ele.LpId == editingInput);
  console.log(input);

  useEffect(() => {
    const savedTitle = localStorage.getItem("Form title");
    if (savedTitle) setFormTitle(savedTitle);

    const savedInputs = localStorage.getItem("inputs");
    if (savedInputs) setInputs(JSON.parse(savedInputs) || []);
  }, []);

  useEffect(() => {
    if (input) {
      setNewLabel(input.label);
      setNewPlaceholder(input.placeholder);
    } else {
      setNewLabel("");
      setNewPlaceholder("");
    }
  }, [input]);

  const addInput = (type) => {
    const newInput = {
      LpId: uuidv4(),
      type,
      label: "",
      placeholder: "",
    };
    console.log(newInput);
    setInputs([...inputs, newInput]);
  };

  const handleInputChange = (LpId, updatedFields) => {
    console.log(LpId);
    const updatedInputs = inputs.map((input) =>
      input.LpId == LpId ? { ...input, ...updatedFields } : input
    );
    console.log(updatedInputs);
    setInputs(updatedInputs);
    localStorage.setItem("inputs", JSON.stringify(updatedInputs));
  };

  const deleteInput = (LpId) => {
    const updatedInputs = inputs.filter((input) => input.LpId !== LpId);
    setInputs(updatedInputs);
    localStorage.setItem("inputs", JSON.stringify(updatedInputs));
  };

  const saveForm = async () => {
    if (!formTitle) {
      Swal.fire({
        title: "Error",
        text: "Please enter a form title",
        icon: "error",
      });
      return;
    }
    try {
      const formData = {
        title: formTitle,
        inputs,
      };

      console.log("Saved Form:", formData);
      const response = await axios.post("/api/form/create", formData);
      console.log(response.data);
      setFormTitle("");
      setInputs([]);
      localStorage.removeItem("Form title");
      localStorage.removeItem("inputs");
      Swal.fire({
        title: "Great",
        text: "Your Form created successfully",
        icon: "success",
      });
    } catch (err) {
      console.log(err);
      alert("Failed to save the form.");
    }
  };

  const handleLablesave = () => {
    handleInputChange(editingInput, {
      label: newLabel,
      placeholder: newPlaceholder,
    });
    setEditingInput(null);
  };

  const handleFormTitle = (e) => {
    const title = e.target.value;
    setFormTitle(title);
    localStorage.setItem("Form title", formTitle);
  };

  return (
    <Container>
      <h3 className="text-center my-4">Create New Form</h3>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <Form.Control
              type="text"
              value={formTitle}
              onChange={handleFormTitle}
              placeholder="Form Title"
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Row>
            {inputs.map((input) => (
              <Col md={6} key={input.LpId} className="mb-3">
                <div className="input-card p-3 border rounded">
                  <Form.Label>
                    Label -- {input.label || "Untitled Label"}
                  </Form.Label>
                  <br></br>
                  <Form.Label>
                    Placeholder -- {input.placeholder || "Untitled placeholder"}
                  </Form.Label>
                  <h6>Type : {input.type}</h6>

                  <div className="mt-2 d-flex justify-content-between">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setEditingInput(input.LpId)}
                    >
                      <MdModeEdit /> edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteInput(input.LpId)}
                    >
                      <MdDelete /> delete
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={4}>
          {editingInput && (
            <div className="border rounded p-3 mb-4">
              <h5>Form Editor</h5>
              <Form.Group>
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Enter Label"
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Placeholder</Form.Label>
                <Form.Control
                  type="text"
                  value={newPlaceholder}
                  onChange={(e) => setNewPlaceholder(e.target.value)}
                  placeholder="Enter Placeholder"
                />
              </Form.Group>
              <Button
                className="mt-3"
                onClick={handleLablesave}
                variant="success"
              >
                Save
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {inputs.length <= 20 && (
        <div className="d-flex justify-content-center mt-4">
          <Button onClick={() => addInput("text")} className="mx-2">
            TEXT
          </Button>
          <Button onClick={() => addInput("email")} className="mx-2">
            EMAIL
          </Button>
          <Button onClick={() => addInput("password")} className="mx-2">
            PASSWORD
          </Button>
          <Button onClick={() => addInput("number")} className="mx-2">
            NUMBER
          </Button>
          <Button onClick={() => addInput("date")} className="mx-2">
            DATE
          </Button>
        </div>
      )}

      <div className="d-flex justify-content-center mt-4">
        <Button variant="success" onClick={saveForm}>
          CREATE FORM
        </Button>
      </div>
    </Container>
  );
}
