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

  // returns whether the next character matches the given value
  //  val can be either a regex or a string (converted to regex)
  matches (val) {
    // init the regex using val; if it's a string, make sure to escape necessary chars:
    //  https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    const regex = RegExp(typeof val === 'string' ? val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : val)
    // return whether it matches
    return regex.test(this.peek())
  }

  // skips all characters matching the given value
  //  if no value is provided, skip all whitespace
  skip (val = ' ') {
    while (this.matches(val)) {
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
          parsed.push(this.token())
          break
        case '%t': // TODO: date
          parsed.push(this.token(']', '['))
          break
        case '"%r"':
        case '"%{Referer}i"':
        case '"%{User-agent}i"':
          parsed.push(this.token('"', '"'))
          break
        case '%>s':
        case '%b':
          parsed.push(parseInt(this.token()))
          break
        default:
          throw new Error(`unrecognized log format ${format}`)
      }
    }

    // return the array of parsed elements
    return parsed
  }

  // parses a token by accepting all characters until the given end delimiter;
  //  if a start is given also makes sure the token begins with it
  token (end = ' ', start = null) {
    // init the token
    let token = ''
    // skip all leading whitespace
    this.skip(/\s/)

    // if we have an opening delimiter...
    if (start !== null) {
      // ...make sure it's matched
      if (!this.matches(start)) {
        throw new Error(`line ${this.num}: unexpected character ${this.peek()} at position ${this.pos} (expected ${this.start})`)
      }
      // consume the opening delimiter
      this.next()
    }

    // grab everything until the closing delimiter
    while (!this.matches(end)) {
      token += this.next()
    }
    // consume the closing delimiter
    this.next()

    // return the consumed token
    return token
  }
}

module.exports = Parser
