var schedule = require('node-schedule');
var cp = require('child_process');
var path = require('path');
var exec = cp.exec;

var sh = `git pull https://github.com/BozhongFE/blog.git master & hexo generate`;

schedule.scheduleJob('* */5 * * * *', () => {
  exec(sh, (error, stdout, stderr) => {
    if (error) {
      console.error('error: ', error);
      return;
    }
  });
});