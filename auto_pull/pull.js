const schedule = require('node-schedule');
const cp = require('child_process');
const path = require('path');
const exec = cp.exec;

const sh = `git pull https://github.com/BozhongFE/blog.git master & hexo generate`;

schedule.scheduleJob('* */5 * * * *', () => {
  exec(sh, (error, stdout, stderr) => {
    if (error) {
      console.error('error: ', error);
      return;
    }
  });
});