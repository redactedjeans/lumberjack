const Parser = require('./parser')

/** A class to parse log files. */
class Lumberjack {
  constructor () {
    // set the default format to Common Log Format
    this.with('%h %l %u %t "%r" %>s %b')
  }

  /**
   * Sets the log format for the parser.
   * @param {string} format The log format string.
   * @return {Lumberjack}
   */
  with (format) {
    this.parser = new Parser(format.split(' '))
    return this
  }

  /**
   * Processes the given logs (ignoring empty lines) and returns the result.
   * @param {string} logs The logs.
   * @returns {[Array]} The parsed logs as a two-dimensional array of tokens.
   */
  saw (logs) {
    return logs.split(/\r?\n/)
      .filter(log => log.trim())
      .map((log, i) => {
        return this.parser.parse(log, i)
      })
  }
}

module.exports = Lumberjack
