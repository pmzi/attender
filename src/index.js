/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const schedule = require('node-schedule');
const moment = require('moment');

const attend = require('./attend');

async function checkForAttends(config) {
  const classes = config.classes.filter((individualClass) => {
    const currentDate = new Date();
    const weekNumber = moment().format('W');

    return individualClass.shouldJoin({ currentDate, weekNumber });
  });

  for (const individualClass of classes) {
    for (const credential of individualClass.credentials) {
      attend({
        link: individualClass.link,
        username: credential.username,
        password: credential.password,
        duration: individualClass.duration,
        loginPage: config.loginPage,
      });
    }
  }
}

module.exports = async (config) => {
  schedule.scheduleJob('30 * * * *', () => checkForAttends(config));
  schedule.scheduleJob('00 * * * *', () => checkForAttends(config));
};
