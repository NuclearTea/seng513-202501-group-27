import { message } from "antd";
import { useState } from "react";
import { ValidBackends, isValidBackendStr } from "../../types/ValidBackends";
import "./CreateProjectForm.css";
import NpmInitForm from "./NpmInitForm";
import PythonInitForm from "./PythonInitForm";

const CreateProjectForm = () => {
  const [selectedBackend, setSelectedBackend] =
    useState<ValidBackends>("Node.JS");

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const val = event.target.value;
    if (isValidBackendStr(val)) {
      setSelectedBackend(val);
      return;
    }
    message.error("Something went wrong creating project, try again please");
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
