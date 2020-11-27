const fs = require('fs');
const readline = require('readline');

const PATH_TO_REPORT = './acme_worksheet.csv';

class Report {
  constructor() {
    this.hours = new Map();
  }

  addHours(user, date, hours) {
    if (!this.hours.has(date)) this.hours.set(date, new Map());

    const users = this.hours.get(date);

    if (!users.has(user)) users.set(user, 0);

    users.set(user, users.get(user) + hours);
  }

  getHours(user, date) {
    const users = this.hours.get(date);

    if (!users) return 0;

    return users.get(user) || 0;
  }
}

const report = new Report()

const fileReader = readline.createInterface({
  input: fs.createReadStream(PATH_TO_REPORT)
});

let ignoreHeaders = true;

fileReader.on('line', function(line) {
  if (ignoreHeaders) {
    ignoreHeaders = false;
    return;  
  }

  const [name, date, hours] = line.split(",");

  report.addHours(name, date, parseFloat(hours))
});

fileReader.on('close', function() {
  const csvString = "";

  console.log(report)
  
  fs.writeFile('out.csv', csvString, function (err) {
    if (err) return console.log(err);
    console.log('DONE! :)');
  });
})