import { useState } from "react";
import NpmInitForm from "./NpmInitForm";
import PythonInitForm from "./PythonInitForm";
import "./CreateProjectForm.css";

export type ValidBackends = "Node.JS" | "Python" | "Ruby" | "Java (Spring)";
const CreateProjectForm = () => {
  const [selectedBackend, setSelectedBackend] =
    useState<ValidBackends>("Node.JS");

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedBackend(event.target.value);
  };

  const renderForm = () => {
    switch (selectedBackend) {
      case "Node.JS":
        return <NpmInitForm />;
      case "Python":
        return <PythonInitForm />;
      default:
        return <div>Please select a backend to configure.</div>;
    }
  };

  return (
    <div className="create-project-form-container">
      <h2>Select Your Backend Technology</h2>
      <select value={selectedBackend} onChange={handleSelectionChange}>
        <option value="">--Select a Backend--</option>
        <option value="Node.JS">Node.js</option>
        <option value="Python">Python</option>
        <option value="Ruby">Ruby</option>
        <option value="Java">Java</option>
        {/* Add more options as needed */}
      </select>

      <div>{renderForm()}</div>
    </div>
  );
};

export default CreateProjectForm;
