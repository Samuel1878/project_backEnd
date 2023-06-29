const chalk = require("chalk");
const logger = {
    debug: (...arg) => {
      console.log(chalk.cyanBright(new Date().toISOString(), ':DEBUG:', ...arg));
    },
    info: (...arg) => {
      console.log(chalk.blue((new Date()).toISOString(), ':INFO:', ...arg));
    },
    warn: (...arg) => {
      console.log(chalk.redBright.bold.bgWhiteBright((new Date()).toISOString(), ':WARN:', ...arg));
    },
    tip: (...arg) => {
        console.log(chalk.magenta((new Date()).toISOString(), "Tip: ", ...arg))
    }
  };
  
module.exports = logger;