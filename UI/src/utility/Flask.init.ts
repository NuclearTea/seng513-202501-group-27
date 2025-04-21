import { File } from "../proto/filetree/filetree_pb";
import { FlaskInitFormData } from "../components/CreateProjectForm/FlaskInitForm";

const FlaskInitFileStructure = (formData: FlaskInitFormData): File[] => {
  const appPy = new File();
  appPy.setId("1");
  appPy.setName("app.py");
  appPy.setContent(
    `
from flask import Flask
import os

app = Flask(__name__)
port = int(os.environ.get("PORT", 5000))

@app.route("/")
def hello():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)
  `.trim(),
  );
  appPy.setPathList([]);

  const readme = new File();
  readme.setId("2");
  readme.setName("README.md");
  readme.setContent(`# Hello Flask Server

Run the following commands to start:

\`\`\`bash
pip install -r requirements.txt
python app.py
\`\`\`
`);
  readme.setPathList([]);

  const requirements = new File();
  requirements.setId("3");
  requirements.setName("requirements.txt");
  requirements.setContent(`flask==2.3.2\npython-dotenv==1.0.1\n`);
  requirements.setPathList([]);

  const gitignore = new File();
  gitignore.setId("4");
  gitignore.setName(".gitignore");
  gitignore.setContent(`__pycache__/\n.env\n`);
  gitignore.setPathList([]);

  const env = new File();
  env.setId("5");
  env.setName(".env");
  env.setContent(`PORT=5000\n`);
  env.setPathList([]);

  const meta = new File();
  meta.setId("6");
  meta.setName("project.json");
  meta.setContent(JSON.stringify({ ...formData, entry: "app.py" }, null, 2));
  meta.setPathList([]);

  return [appPy, readme, requirements, gitignore, env, meta];
};

export default FlaskInitFileStructure;
