import { File } from "../proto/filetree/filetree_pb";
import { NodeJSInitFormData } from "../components/CreateProjectForm/NpmInitForm";

const createNodeJSInitFiles = (formData: NodeJSInitFormData): File[] => {
  const indexJs = new File();
  indexJs.setId("1");
  indexJs.setName("index.js");

  indexJs.setContent(
    `
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// don't remove the '0.0.0.0'
app.listen(port, '0.0.0.0', () => {
  console.log(\`Server is running at http://0.0.0.0:\${port}\`);
});
  `.trim(),
  );
  indexJs.setPathList(["src"]);

  const readme = new File();
  readme.setId("2");
  readme.setName("README.md");
  readme.setContent(`# Hello World Web Server

Run the following commands to start:

\`\`\`bash
npm install
node src/index.js
\`\`\`
`);
  readme.setPathList([]);

  const pkg = new File();
  pkg.setId("3");
  pkg.setName("package.json");
  pkg.setContent(
    JSON.stringify(
      {
        ...formData,
        main: "src/index.js",
        scripts: {
          start: "node src/index.js",
        },
        dependencies: {
          express: "^4.18.2",
          dotenv: "^16.3.1",
        },
      },
      null,
      2,
    ),
  );
  pkg.setPathList([]);

  const gitignore = new File();
  gitignore.setId("4");
  gitignore.setName(".gitignore");
  gitignore.setContent("node_modules/\n.env\n");
  gitignore.setPathList([]);

  const env = new File();
  env.setId("5");
  env.setName(".env");
  env.setContent("PORT=3001\n");
  env.setPathList([]);

  return [indexJs, readme, pkg, gitignore, env];
};

export default createNodeJSInitFiles;
