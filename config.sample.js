const TWO_HOURS = 7_200_000;

module.exports = {
  loginPage: 'http://lms.some.com/login/index.php',
  classes: [
    {
      link: 'http://lms.some.com/mod/adobeconnect/view.php?id=59104',
      name: 'IR',
      credentials: [
        {
          username: '??',
          password: '??',
        },
      ],
      duration: TWO_HOURS,
      shouldJoin({ currentDate, weekNumber }) {
        return true;
      },
    },
  ],
};
