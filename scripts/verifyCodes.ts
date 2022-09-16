//@ts-ignore
const fs = require('fs');

const isDryRun = true;
const startingIndex = 0;

const verifyCode = (code: number) => {
  const string = code.toString(16);
  return string.length === 6;
}

const removeInvalidCodes = (startingIndex: number = 0) => {
  console.log('Checking for invalid codes...');
  fs.readFile('src/codes.json', 'utf8', function readFileCallback(err: any, data: any) {
    if (err) {
      console.log(err);
    } else {
      let codesList: { codes: number[] } = JSON.parse(data);
      let numberOfInvalidCodes = 0;
      let oldCodes = codesList.codes;
      let newCodes: number[] = [];
      for (let i = startingIndex; i < oldCodes.length; i++) {
        const isValidCode = verifyCode(oldCodes[i])
        if (!isValidCode) {
          numberOfInvalidCodes++;
        } else {
          newCodes.push(oldCodes[i]);
        }
      }
      console.log(`Total invalid codes: ${numberOfInvalidCodes}`)
      if (!isDryRun) {
        console.log(`Removing invalid codes...`);
        let json = JSON.stringify({ codes: newCodes });
        fs.writeFile('src/codes.json', json, 'utf8', () => {});
      }
    }
    console.log('Completed!')
  });
}

removeInvalidCodes(startingIndex);