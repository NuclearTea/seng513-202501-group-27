const PythonInitForm = () => {
  return (
    <div>
      <h3>Python Backend Setup</h3>
      <form>
        <label>
          Package Name:
          <input type="text" placeholder="Example Python Project" />
        </label>
        <br />
        <label>
          Version:
          <input type="text" placeholder="1.0.0" />
        </label>
        <br />
        <label>
          Description:
          <input type="text" placeholder="Python backend project" />
        </label>
        <br />
        <button type="submit">Create Python Project</button>
      </form>
    </div>
  );
};

export default PythonInitForm;
