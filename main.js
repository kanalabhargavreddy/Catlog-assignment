const fs = require('fs');

function decodeBaseValue(base, value) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points, k) {
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        let li = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                li *= -xj / (xi - xj);
            }
        }

        constantTerm += yi * li;
    }

    return constantTerm;
}

function findSecretConstant(jsonData) {
    let n = jsonData.keys.n;
    let k = jsonData.keys.k;

    let points = [];
    Object.keys(jsonData).forEach(key => {
        if (key !== 'keys') {
            let base = parseInt(jsonData[key].base);
            let value = jsonData[key].value;
            let x = parseInt(key);  // 'key' is the x-value
            let y = decodeBaseValue(base, value);  // Decode the y-value
            points.push({ x, y });
        }
    });

    points.sort((a, b) => a.x - b.x);  // Sort points by x-value

    return lagrangeInterpolation(points, k);
}

function processTestCasesFromFile(fileNames) {
    fileNames.forEach((fileName, index) => {
        const jsonData = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        let result = findSecretConstant(jsonData);
        console.log(`Secret key for test case ${index + 1} from file ${fileName} is: ${result}`);
    });
}

// Array of file names containing the test cases
const testCaseFiles = ['./testcase1.json', './testcase2.json'];
processTestCasesFromFile(testCaseFiles);
