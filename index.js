const fs = require('fs');
const readline = require('readline');

const PATH_TO_REPORT = './acme_worksheet.csv';

const fileReader = readline.createInterface({
  input: fs.createReadStream(PATH_TO_REPORT)
});

let ignoreHeaders = true;
const lines = ""

fileReader.on('line', function(line) {
  if (ignoreHeaders) {
    ignoreHeaders = false;
    return;  
  }
  lines += line
});

fileReader.on('close', function() {
  fs.writeFile('out.csv', lines, function (err) {
    if (err) return console.log(err);
    console.log('DONE! :)');
  });
})
