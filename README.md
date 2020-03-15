# Lumberjack
A log parser built in JavaScript.

## Usage
The main class, `Lumberjack`, can be invoked as such:
```js
const parsed = new Lumberjack().with(format).saw(logs)
```

The `src/main.js` file expects a file named `logs` containing some Apache access logs in the `src` directory. It will parse the logs and print the result to the console. To see it in action, run `node src/main` in the command line.
