/** Class to parse log lines. */
class Parser {
  /**
   * @param {string[]} formats The formats for a single line log.
   */
  constructor (formats) {
    this.formats = formats
  }

  /**
   * Returns the next character in the line without consuming it.
   * @returns {string} The next character in the line.
   */
  peek () {
    if (this.pos === this.line.length) throw new Error(`line ${this.num}: unexpected EOL at position ${this.pos}`)
    return this.line[this.pos]
  }

  /**
   * Consumes and returns the next character in the line.
   * @returns {string} The next character in the line.
   */
  next () {
    if (this.pos === this.line.length) throw new Error(`line ${this.num}: unexpected EOL at position ${this.pos}`)
    return this.line[this.pos++]
  }

  /**
   * Returns whether the next character matches the given value.
   * @param {string|RegExp} val The character or regex to match.
   * @returns {boolean} Whether the next character matches val.
   */
  matches (val) {
    // init the regex using val; if it's a string, make sure to escape necessary chars:
    //  https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    const regex = RegExp(typeof val === 'string' ? val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : val)
    // return whether it matches
    return regex.test(this.peek())
  }

  /**
   * Skips all characters matching the given value.
   * @param {string|RegExp} [val=' '] The value to skip.
   */
  skip (val = ' ') {
    while (this.matches(val)) {
      this.next()
    }
  }

  /**
   * Parses a given log line and returns the resulting array of tokens.
   * @param {string} line The log line to parse.
   * @param {integer} num The line number of the log line.
   * @return {Array} The log's parsed tokens.
   */
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

  /**
   * Parses a single token by accepting all characters until the given end delimiter;
   *  if a start is given also makes sure the token begins with it.
   * @param {string} [end=' '] The token's end delimiter.
   * @param {string} [start] The token's start delimiter.
   * @returns {string} The token.
   */
  token (end = ' ', start = null) {
    // init the token
    let token = ''
    // skip all leading whitespace
    this.skip(/\s/)

    // if we have an opening delimiter...
    if (start !== null) {
      // ...make sure it's matched
      if (!this.matches(start)) {
        throw new Error(`line ${this.num}: unexpected character ${this.peek()} at position ${this.pos} (expected ${start})`)
      }
      // consume the opening delimiter
      this.next()
    }

    // grab everything until the closing delimiter
    while (!this.matches(end)) {
      const next = this.next()
      // if the char is backslash, consume the next one; otherwise consume this one
      token += (next === '\\') ? this.next() : next
    }
    // consume the closing delimiter
    this.next()

    // return the consumed token
    return token
  }
}

module.exports = Parser
