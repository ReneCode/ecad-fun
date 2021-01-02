const fs = require("fs");
const path = require("path");

const dataPath = path.join(
  __dirname,
  "../..",
  process.env.PROJECT_PATH || "./"
);

export const saveJson = (fileName: string, content: object) => {
  const fullPath = path.join(dataPath, fileName);
  const dirName = path.dirname(fullPath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  fs.writeFileSync(fullPath, JSON.stringify(content, null, 1));
};

export const loadJson = (fileName: string) => {
  try {
    const fullPath = path.join(dataPath, fileName);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const json = fs.readFileSync(fullPath, "utf8");
    if (json) {
      const obj = JSON.parse(json);
      return obj;
    }
    return null;
  } catch (err) {
    return null;
  }
};
