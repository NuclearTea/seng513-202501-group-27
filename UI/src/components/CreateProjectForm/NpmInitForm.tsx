import React, { useState } from "react";
import "./NpmInitForm.css";
import appStore from "../../state/app.store";
import { message } from "antd";

export type NodeJSInitFormData = {
  name: string;
  version: string;
  description: string;
  entryPoint: string;
  testCommand: string;
  gitRepository: string;
  keywords: string;
  author: string;
  license: string;
};
const NpmInitForm: () => React.ReactNode = () => {
  const { generateInitialFiles } = appStore();
  const [formData, setFormData] = useState<NodeJSInitFormData>({
    name: "npmtest",
    version: "1.0.0",
    description: "I'm testing the default files created when using npm init",
    entryPoint: "src/index.js",
    testCommand: "",
    gitRepository: "",
    keywords: "",
    author: "",
    license: "ISC",
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
    // Here we would send the form data to create the package.json
    console.log("Form Data submitted:", formData);
    const newFiles = generateInitialFiles("Node.JS", formData);
    if (newFiles.length === 0) {
      message.error("Error generating file, please try again");
    } else {
      message.success("Successfully initialized Node.JS Project");
    }
  };

  return (
    <div className="npm-init-form-container">
      <h2>Create package.json</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Package Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="npmtest"
            required
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
            placeholder="1.0.0"
            required
            maxLength={50}
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
            placeholder="I'm testing the default files created when using npm init"
          />
        </div>

        <div className="form-group">
          <label htmlFor="entryPoint">Entry Point:</label>
          <input
            type="text"
            name="entryPoint"
            id="entryPoint"
            value={formData.entryPoint}
            onChange={handleChange}
            placeholder="index.js"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="testCommend">Test Command:</label>
          <input
            type="text"
            name="testCommand"
            id="testCommand"
            value={formData.testCommand}
            onChange={handleChange}
            placeholder="test command"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gitRepository">Git Repository:</label>
          <input
            type="text"
            name="gitRepository"
            id="gitRepository"
            value={formData.gitRepository}
            onChange={handleChange}
            placeholder="git repository"
          />
        </div>

        <div className="form-group">
          <label htmlFor="keywords">Keywords:</label>
          <input
            type="text"
            name="keywords"
            id="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="keywords"
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
            placeholder="author"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="license">License:</label>
          <input
            type="text"
            name="license"
            value={formData.license}
            onChange={handleChange}
            placeholder="ISC"
            required
          />
        </div>

        <div>
          <p>About to write to package.json:</p>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>

        <div>
          <button type="submit">Is this OK? (yes)</button>
        </div>
      </form>
    </div>
  );
};

export default NpmInitForm;
