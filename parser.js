class Parser {
  // takes a formats array and initializes a new Parser
  constructor (formats) {
    this.formats = formats
  }

  // returns the next character in the line without consuming it
  peek () {
    if (this.pos === this.line.length) throw new Error(`line ${this.num}: unexpected EOL at position ${this.pos}`)
    return this.line[this.pos]
  }

  // consumes and returns the next character in the line
  next () {
    if (this.pos === this.line.length) throw new Error(`line ${this.num}: unexpected EOL at position ${this.pos}`)
    return this.line[this.pos++]
  }

  // takes a log line and it's line number and returns an array of parsed tokens
  parse (line, num) {
    // init line & parsed tokens
    this.line = line
    this.num = num
    this.pos = 0
    const parsed = []

    // loop through the formats, parsing each token from the log
    for (const format of this.formats) {
      switch (format) {
        case '%h':
          parsed.push(this.token())
          break
        case '%l':
        case '%u':
        case '%t':
        case '%>s':
        case '%b':
        case '"%r"':
        case '"%{Referer}i"':
        case '"%{User-agent}i"':
          break
        default:
          throw new Error(`unrecognized log format ${format}`)
      }
    }

    // return the array of parsed elements
    return parsed
  }

  token (del = ' ') {
    // init the token
    let token = ''

    // grab everything until the delimiter
    while (this.peek() !== del) {
      token += this.next()
    }

    // return the consumed token
    return token
  }
}

module.exports = Parser
