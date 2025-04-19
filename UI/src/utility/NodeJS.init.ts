import { File } from "../proto/filetree/filetree_pb";
import { NodeJSInitFormData } from "../components/CreateProjectForm/NpmInitForm";

const createNodeJSInitFiles = (formData: NodeJSInitFormData): File[] => {
  const indexJs = new File();
  indexJs.setId("1");
  indexJs.setName("index.js");
  indexJs.setContent(
    `
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Server is running at http://localhost:\${port}\`);
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
        },
      },

      null,
      2,
    ),
    // JSON.stringify(
    //   {
    //     name: formData.name || "hello-world-server",
    //     version: "1.0.0",
    //     main: "src/index.js",
    //     scripts: {
    //       start: "node src/index.js",
    //     },
    //     dependencies: {
    //       express: "^4.18.2",
    //     },
    //     ...formData,
    //   },
    //   null,
    //   2,
    // ),
  );
  pkg.setPathList([]);

  const gitignore = new File();
  gitignore.setId("4");
  gitignore.setName(".gitignore");
  gitignore.setContent("node_modules/\n");
  gitignore.setPathList([]);

  return [indexJs, readme, pkg, gitignore];
};

export default createNodeJSInitFiles;
