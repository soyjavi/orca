import chalk from 'chalk';
import ora from 'ora';

const INDENT = 16;

class Log {
  constructor(prefix = '', welcomeMessage) {
    let prefixText = prefix.substr(0, INDENT).trim();

    if (prefixText.length > 0) {
      prefixText = `${chalk.bold(prefixText)}${Array(INDENT - prefixText.length)
        .fill(' ')
        .join('')} `;
    }

    this.prefix = prefixText;
    this.instance = ora().start();

    if (welcomeMessage) this.text(welcomeMessage);

    return this;
  }

  clear() {
    this.instance.clear();
  }

  stop() {
    this.instance.stop();
  }

  text(value) {
    this.instance.text = `${chalk(this.prefix)}${chalk.dim(value)}`;
  }

  error(value) {
    this.instance.fail(`${chalk.red(this.prefix)}${value}`);
  }

  succeed(value) {
    this.instance.succeed(`${chalk.green(this.prefix)}${value}`);
  }

  warn(value) {
    this.instance.warn(`${chalk.yellow(this.prefix)}${value}`);
  }

  info(value) {
    this.instance.info(`${chalk.blue(this.prefix)}${value}`);
  }
}

export { Log };
