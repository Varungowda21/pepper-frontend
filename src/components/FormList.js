import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../config/axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";

export default function FormList() {
  const [keyword, setKeyword] = useState("");
  const [forms, setForms] = useState([]);

  useEffect(() => {
    (async () => {
      const formData = {
        keyword,
      };
      const response = await axios.get(`/api/form?keyword=${formData.keyword}`);
      console.log(response.data);
      setForms(response.data);
    })();
  }, [keyword]);

  const handleFormDelete = async (id) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmation.isConfirmed) {
     
        const response = await axios.delete(`/api/form/delete/${id}`);

        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your form has been deleted successfully.",
            icon: "success",
          });
          const updatedforms = forms.filter((ele) => ele._id !== id);
          setForms(updatedforms);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete the form. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">Form Builder</Navbar.Brand>
          <Nav className="flex-end gap-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search a Form..."
            />
            <Button variant="warning" size="sm">
              <Nav.Link as={Link} to="/form/create">
                <b>Create Form</b>
              </Nav.Link>
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <div className="App">
        <h1>All Forms</h1>

        <div className="card-container">
          {forms.map((form) => (
            <Card
              style={{ width: "18rem" }}
              key={form._id}
              className="card-item"
            >
              <Card.Body>
                <Card.Title>{form.title}</Card.Title>
                <br></br>
                <Link to={`/form/${form._id}`}>
                  <Button variant="outline-primary">View</Button>{"  "}
                </Link>
                <Link to={`/form/edit/${form._id}`}>
                  <Button variant="outline-secondary">Edit</Button>{"  "}
                </Link>
                <Button
                  variant="outline-danger"
                  onClick={() => handleFormDelete(form._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

 
