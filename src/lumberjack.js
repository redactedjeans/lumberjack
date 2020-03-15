const Parser = require('./parser')

class Lumberjack {
  // creates a Lumberjack with the Common Log Format
  constructor () {
    this.with('%h %l %u %t "%r" %>s %b')
  }

  // sets the format for this Lumberjack
  with (format) {
    this.parser = new Parser(format.split(' '))
    return this
  }

  // processes the given logs and returns the result
  saw (logs) {
    return logs.split(/\r?\n/)
      .filter(log => log.trim())
      .map((log, i) => {
        return this.parser.parse(log, i)
      })
  }
}

module.exports = Lumberjack
