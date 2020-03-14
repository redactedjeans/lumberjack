# TODO
- [ ] tests!
- [ ] parse dates into js Date object
- [ ] handle escaped delimiter characters (_e.g._ "GET /blah?q=\\"search\\"+term")
- [ ] sometimes in `next()` and `peek()` we expect a specific character (_e.g._ Parser lines 89 + 97)
  - if we throw an error here we could add "expected foo" to the error message
- [ ] create custom error classes to abstract away common tasks (_e.g._ printing line number + position)
- [ ] add proper docstrings (jsdoc?) with types to all files
- [ ] check that "%l" and "%u" are indeed just simple tokens
