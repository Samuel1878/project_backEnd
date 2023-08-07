import chalk from "chalk";

const logger = {
  debug: (...arg) => {
    console.log(chalk.cyanBright(new Date().toISOString(), ":DEBUG:", ...arg));
  },
  info: (...arg) => {
    console.log(chalk.blue(new Date().toISOString(), ":INFO:", ...arg));
  },
  warn: (...arg) => {
    console.log(
      chalk.redBright.bold.bgWhiteBright(
        new Date().toISOString(),
        ":WARN:",
        ...arg
      )
    );
  },
  tip: (...arg) => {
    console.log(chalk.magenta(new Date().toISOString(), "Tip: ", ...arg));
  },
  err: (...arg) => {
    console.log(
      chalk.red.bgWhiteBright(
        new Date().toISOString(),
        ":ERROR:",
        ...arg
      )
    );
  },
};
export default logger;
