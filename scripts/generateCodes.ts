import fs from "fs";

type CodeTracker = {
  [key: number]: "valid" | "invalid";
};

const numberOfCodesToGenerate = 365;
const isTestRun = true;

const generateCodes = (numberOfCodes: number): number[] => {
  let codesList: Array<number> = [];
  let generatedCodes: CodeTracker = {};
  let i = 0;
  while (i < numberOfCodes) {
    const currentCode = Math.floor(Math.random() * 16777215);
    if (!generatedCodes[currentCode]) {
      if (Math.floor(currentCode).toString(16).length === 6) {
        codesList.push(currentCode);
        generatedCodes[currentCode] = "valid";
        i++;
      } else {
        generatedCodes[currentCode] = "invalid";
      }
    }
  }
  return codesList;
};

const run = () => {
  console.log(`Beginning ${isTestRun ? "test run" : "writing new codes"}.`);
  const codes = generateCodes(numberOfCodesToGenerate);
  fs.readFile(
    "src/codes.json",
    "utf8",
    function readFileCallback(err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        let codesList = JSON.parse(data);
        console.log(`Original file has a length of ${codesList.codes.length}`);
        codesList.codes.push(...codes);
        console.log(`New file will have a length of ${codesList.codes.length}`);
        if (!isTestRun) {
          let json = JSON.stringify({ codes: codesList.codes });
          fs.writeFile("src/codes.json", json, "utf8", () => {});
          console.log("Completed writing new file");
        } else {
          // console.log('Here is the new codesList', codesList);
          console.log(codesList.codes[codesList.codes.length - 1]);
        }
      }
    }
  );
};

run();
