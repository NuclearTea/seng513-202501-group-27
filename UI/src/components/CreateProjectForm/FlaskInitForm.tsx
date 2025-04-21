import React, { useState } from "react";
import appStore from "../../state/app.store";
import { message } from "antd";

export type FlaskInitFormData = {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
};

const FlaskInitForm: () => React.ReactNode = () => {
  const { generateInitialFiles } = appStore();
  const [formData, setFormData] = useState<FlaskInitFormData>({
    name: "hello-flask-server",
    version: "1.0.0",
    description: "A basic Flask Hello World web server",
    author: "",
    license: "MIT",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data submitted:", formData);
    const newFiles = generateInitialFiles("Flask", formData);
    if (newFiles.length === 0) {
      message.error("Error generating file, please try again");
    } else {
      message.success("Successfully initialized Flask Project");
    }
  };

  return (
    <div className="flask-init-form-container">
      <h2>Create Flask Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="hello-flask"
          />
        </div>

        <div className="form-group">
          <label htmlFor="version">Version:</label>
          <input
            type="text"
            name="version"
            id="version"
            value={formData.version}
            onChange={handleChange}
            required
            placeholder="1.0.0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Flask web server"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            name="author"
            id="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="license">License:</label>
          <input
            type="text"
            name="license"
            id="license"
            value={formData.license}
            onChange={handleChange}
            placeholder="MIT"
            required
          />
        </div>

        <div>
          <p>About to write to project.json:</p>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>

        <div>
          <button type="submit">Is this OK? (yes)</button>
        </div>
      </form>
    </div>
  );
};

export default FlaskInitForm;
