import { Routes, Route } from "react-router-dom";
import FormList from "./components/FormList";
import CreateForm from "./components/CreateForm";
import FormView from "./components/FormView";
import EditForm from "./components/EditForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FormList />} />
      <Route path="/form/create" element={<CreateForm />} />
      <Route path="/form/:id" element={<FormView />} />
      <Route path="/form/edit/:id" element={<EditForm />} />
    </Routes>
  );
}

export default App;
