# Lumberjack
A log parser built in JavaScript.

## Usage
The main class, `Lumberjack`, can be invoked as such:
```js
const parsed = new Lumberjack().with(format).saw(logs)
```

The `main.js` file expects a file named `logs` containing some apache access logs in the current directory. It will parse the logs and print the result to the console. To see it in action, run `node main` in the command line.
