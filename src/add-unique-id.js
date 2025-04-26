const glob = require("glob");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");

const buildDir = "src/data/build/";

console.log(
  `Adding unique IDs to every object in the JSON files, and writing them to ${buildDir}`
);

const traverseData = (data) => {
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      data.forEach(traverseData);
    } else {
      data.id = uniqid();
      Object.values(data).forEach(traverseData);
    }
  }
};

async function main() {
  try {
    // Using glob to get all JSON files in the src/data folder
    glob("src/data/*.json", async (err, files) => {
      if (err) {
        throw new Error(`Error reading files: ${err.message}`);
      }

      if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
      }

      // Process each file asynchronously
      for (const file of files) {
        try {
          const data = await fs.promises.readFile(file, "utf8");
          const obj = JSON.parse(data);

          traverseData(obj);

          const final = JSON.stringify(obj, null, 2); // Prettier formatting with 2 spaces

          const outputPath = path.join(buildDir, path.basename(file));
          await fs.promises.writeFile(outputPath, final);

          console.log(`Processed and saved: ${outputPath}`);
        } catch (fileErr) {
          console.error(`Error processing file ${file}: ${fileErr.message}`);
        }
      }
    });
  } catch (err) {
    console.error("Error processing files:", err);
  }
}

main();
