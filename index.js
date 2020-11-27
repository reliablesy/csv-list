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

  getDates() {
    return Array.from(this.hours.keys()).sort();
  }

  getUsers() {
    const result = new Set();

    for (let users of this.hours.values()) {
      for (let user of users.keys()) {
        result.add(user);
      }
    }

    return result;
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

  const formatedDate = new Date(date).toISOString().slice(0,10);

  report.addHours(name, formatedDate, parseFloat(hours))
});

fileReader.on('close', function() {
  let rows = []
 
  const dates = report.getDates();
  const headers = ['Name / Date', ...dates];

  rows.push(headers);

  for (const user of report.getUsers()) {
    const row = [user];
    for (const date of dates) {
      row.push(report.getHours(user, date))
    }
    rows.push(row)
  }

  const csvString = rows.map(row => row.join(',')).join('\n');
  
  fs.writeFile('out.csv', csvString, function (err) {
    if (err) return console.log(err);
    console.log('DONE! :)');
  });
})