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

  // skips all characters matching the given value
  // if no value is provided, skip all spaces
  skip (val = ' ') {
    while (this.peek() === val) {
      this.next()
    }
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
        case '%l':
        case '%u':
          parsed.push(this.tokenDel())
          break
        case '%t': // TODO: date
          parsed.push(this.tokenIn('[', ']'))
          break
        case '"%r"':
        case '"%{Referer}i"':
        case '"%{User-agent}i"':
          parsed.push(this.tokenIn('"', '"'))
          break
        case '%>s':
        case '%b': // TODO: int
          parsed.push(this.tokenDel())
          break
        default:
          throw new Error(`unrecognized log format ${format}`)
      }
    }

    // return the array of parsed elements
    return parsed
  }

  tokenDel (del = ' ') {
    // init the token
    let token = ''
    // skip all leading whitespace
    this.skip()

    // grab everything until the delimiter
    while (this.peek() !== del) {
      token += this.next()
    }

    // return the consumed token
    return token
  }

  tokenIn (start = '"', end = '"') {
    // init the token
    let token = ''
    // skip all leading whitespace
    this.skip()

    // make sure the token starts with the opening delimiter
    if (this.next() !== start) {
      throw new Error(`line ${this.num}: unexpected character ${this.line[this.pos - 1]} at position ${this.pos} (expected [)`)
    }
    // grab everything until the closing delimiter
    while (this.peek() !== end) {
      token += this.next()
    }
    // consume the closing delimiter
    this.next()

    // return the consumed token
    return token
  }
}

module.exports = Parser
