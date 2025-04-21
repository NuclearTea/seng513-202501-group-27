import { message } from "antd";
import appStore from "../../state/app.store";
import { isValidBackendStr } from "../../types/ValidBackends";
import "./CreateProjectForm.css";
import FlaskInitForm, { FlaskInitFormData } from "./FlaskInitForm";
import NpmInitForm, { NodeJSInitFormData } from "./NpmInitForm";

export type BackendFormDataMap = {
  Flask: FlaskInitFormData;
  "Node.JS": NodeJSInitFormData;
  Ruby: Record<symbol, unknown>;
  "Java (Spring)": Record<symbol, unknown>;
};

const CreateProjectForm = () => {
  const { selectedBackend, setSelectedBackend } = appStore();

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
      case "Flask":
        return <FlaskInitForm />;
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
        <option value="Flask">Flask</option>
        <option value="Ruby">Ruby</option>
        <option value="Java">Java</option>
        {/* Add more options as needed */}
      </select>

      <div>{renderForm()}</div>
    </div>
  );
};

export default CreateProjectForm;
