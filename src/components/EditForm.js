import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Container,
  Alert,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./FormBuilder.css";
import axios from "../config/axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { MdModeEdit, MdDelete } from "react-icons/md";

export default function EditForm() {
  const { id } = useParams();
  const [formTitle, setFormTitle] = useState("");
  const [inputs, setInputs] = useState([]);
  const [editingInput, setEditingInput] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  const [newPlaceholder, setNewPlaceholder] = useState("");
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const savedTitle = localStorage.getItem(`formTitle-${id}`);
    const savedInputs = localStorage.getItem(`inputs-${id}`);
    const savedIsSaved = localStorage.getItem(`isSaved-${id}`);

    if (savedTitle && savedInputs) {
      console.log("i f uf");
      setFormTitle(savedTitle);
      setInputs(JSON.parse(savedInputs));
      setIsSaved(savedIsSaved === "true");
    } else {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      console.log("api call");
      const response = await axios.get(`/api/form/view/${id}`);
      setFormTitle(response.data.title);
      setInputs(response.data.inputs);
      setIsSaved(true);
    } catch (err) {
      console.error("Error fetching form data:", err);
      alert("Failed to load form data.");
    }
  };

  
  useEffect(() => {
    console.log("i s uf");
    localStorage.setItem(`formTitle-${id}`, formTitle);
    localStorage.setItem(`inputs-${id}`, JSON.stringify(inputs));
    localStorage.setItem(`isSaved-${id}`, isSaved);
  }, [formTitle, inputs, isSaved]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(`formTitle-${id}`);
      localStorage.removeItem(`inputs-${id}`);
      localStorage.removeItem(`isSaved-${id}`);
    };
  }, [id]);

  const input = inputs.find((ele) => ele.LpId === editingInput);

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
    const updatedInputs = [...inputs, newInput];
    setInputs(updatedInputs);
    setIsSaved(false); // Marking as unsaved
  };

  const handleInputChange = (LpId, updatedFields) => {
    const updatedInputs = inputs.map((input) =>
      input.LpId === LpId ? { ...input, ...updatedFields } : input
    );
    setInputs(updatedInputs);
    setIsSaved(false); // Marking as unsaved
  };

  const deleteInput = (LpId) => {
    const updatedInputs = inputs.filter((input) => input.LpId !== LpId);
    setInputs(updatedInputs);
    setIsSaved(false); // Marking as unsaved
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
      await axios.put(`/api/form/edit/${id}`, formData);
      Swal.fire({
        title: "Updated",
        text: "Your form was updated successfully",
        icon: "success",
      });
      setIsSaved(true); // Marking as saved
    } catch (err) {
      console.log(err);
      alert("Failed to save the form.");
    }
  };

  const handleLabelSave = () => {
    handleInputChange(editingInput, {
      label: newLabel,
      placeholder: newPlaceholder,
    });
    setEditingInput(null);
  };

  const handleFormTitleChange = (e) => {
    const title = e.target.value;
    setFormTitle(title);
    setIsSaved(false); // Marking as unsaved
  };

  return (
    <Container>
      <h3 className="text-center my-4">Edit Form</h3>

      {!isSaved && (
        <Alert variant="warning" className="text-center">
          Not Saved, Please Save Form
        </Alert>
      )}

      <Row className="mb-3">
        <Col>
          <InputGroup>
            <Form.Control
              type="text"
              value={formTitle}
              onChange={handleFormTitleChange}
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
                  <br />
                  <Form.Label>
                    Placeholder -- {input.placeholder || "Untitled Placeholder"}
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
              <Button className="mt-3" onClick={handleLabelSave}>
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
          SAVE FORM
        </Button>
      </div>
    </Container>
  );
}
