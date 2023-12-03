const { readdirSync } = require('fs');
const prompts = require('prompts');

const [dayOrAction, maybeAction] = process.argv.slice(2);

const isDayFirst = !(dayOrAction === 'test' || dayOrAction === 'main');

const actionArg = maybeAction || (!isDayFirst ? dayOrAction : undefined);
const dayArg = isDayFirst ? dayOrAction : undefined;

(async () => {
  // read folders from current directory

  const days = readdirSync('./').filter((file) => file.startsWith('day'));

  // prompt user for day
  const day =
    dayArg ||
    (
      await prompts({
        type: 'select',
        name: 'day',
        message: 'Select day',
        choices: ['all', ...days.map((day) => ({ title: day, value: day }))],
      })
    ).day;

  // prompt user for action
  const action =
    actionArg ||
    (
      await prompts({
        type: 'select',
        name: 'action',
        message: 'Select action',
        choices: [
          { title: 'Run main', value: 'main' },
          { title: 'Run test', value: 'test' },
        ],
      })
    ).action;

  if (day === 'all') {
    for (const day of days) {
      await run(day, action);
    }

    return;
  }

  run(day, action);
})();

async function run(day, action) {
  const { main, test } = await import(`./${day}/index.js`);

  if (action === 'main') {
    main();
  } else if (action === 'test') {
    test();
  }
}
