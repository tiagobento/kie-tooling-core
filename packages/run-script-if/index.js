#!/usr/bin/env node

/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { spawn } = require("child_process");

async function main() {
  const argv = yargs(hideBin(process.argv))
    .strict()
    .options({
      env: {
        required: true,
        alias: "e",
        type: "string",
        description: "Environment variable name",
      },
      eq: {
        default: "true",
        alias: "equals",
        type: "string",
        description: "Value to be compared with the environment variable.",
      },
      then: {
        array: true,
        required: true,
        type: "string",
        description: "Command to execute if environment variable has the desired value",
      },
      else: {
        default: [],
        array: true,
        required: false,
        type: "string",
        description: "Command to execute if environment variable doesn't have the desired value",
      },
      "true-if-empty": {
        default: false,
        type: "boolean",
        description: "Runs the command if the environment variable is not set.",
      },
      silent: {
        default: false,
        type: "boolean",
        description: "Hide logs from output.",
      },
      force: {
        default: false,
        type: "boolean",
        description: "Runs commands supplied to --then regardless of the environment variable value.",
      },
    }).argv;

  const log = (logFunction, ...args) => {
    if (!argv.silent) {
      logFunction(`[run-script-if]`, ...args);
    }
  };

  const envVarName = argv.env;
  const envVarValue = process.env[envVarName];
  const shouldRunIfEmpty = argv["true-if-empty"];

  const condition =
    // env var value is logically empty and --true-if-empty is enabled
    ((envVarValue === undefined || envVarValue === "") && shouldRunIfEmpty) ||
    // env var value is equal to the --eq argument
    envVarValue === argv.eq ||
    // env var value is ignored and the --then commands are executed
    argv.force;

  let commandStringsToRun;
  let commandStringsToSkip;

  if (condition) {
    commandStringsToRun = argv.then;
    commandStringsToSkip = argv.else;
  } else {
    commandStringsToRun = argv.else;
    commandStringsToSkip = argv.then;
  }

  log(console.info, LOGS.envVarSummary(envVarName, envVarValue, shouldRunIfEmpty));

  if (commandStringsToRun.length > 0) {
    log(console.info, LOGS.running(commandStringsToRun));
  } else {
    log(console.info, LOGS.runningZero());
  }

  if (commandStringsToSkip.length > 0) {
    log(console.info, LOGS.skipping(commandStringsToSkip));
  }

  let nCommandsFinished = 0;
  for (const runningCommandString of commandStringsToRun) {
    await new Promise((res, rej) => {
      log(console.info, LOGS.runningCommand(runningCommandString));

      const bin = runningCommandString.split(" ")[0];
      const args = runningCommandString
        .split(" ")
        .slice(1)
        .filter((arg) => arg.trim().length > 0);
      const command = spawn(bin, args, { stdio: "inherit" });

      command.on("error", (data) => {
        logCommandError(log, commandStringsToRun, nCommandsFinished, runningCommandString);
        rej({ code: 1, msg: data.toString() });
      });

      command.on("exit", (code) => {
        if (code !== 0) {
          logCommandError(log, commandStringsToRun, nCommandsFinished, runningCommandString);
          rej({ code });
          return;
        }

        nCommandsFinished += 1;
        log(console.info, LOGS.finishCommand(runningCommandString));
        res();
      });
    });
  }
}

function logCommandError(log, commandStringsToRun, nCommandsFinished, runningCommandString) {
  const commandsLeft = commandStringsToRun.length - nCommandsFinished - 1;
  if (commandsLeft > 0) {
    const skippedCommands = commandStringsToRun.splice(nCommandsFinished + 1);
    log(console.error, LOGS.errorOnMiddleCommand(runningCommandString, commandsLeft, skippedCommands));
  } else {
    log(console.error, LOGS.errorOnLastCommand(runningCommandString));
  }
}

const LOGS = {
  runningCommand: (commandString) => {
    return `Running '${commandString}'`;
  },
  runningZero: () => {
    return `No commands to run.`;
  },
  finishCommand: (commandString) => {
    return `Finished '${commandString}'`;
  },
  errorOnLastCommand: (cmd) => {
    return `Error executing '${cmd}'.`;
  },
  skipping: (commandStrings) => {
    return `Skipping ${commandStrings.length} command(s): ['${commandStrings.join("', '")}']`;
  },
  running: (commandStrings) => {
    return `Running ${commandStrings.length} command(s): ['${commandStrings.join("', '")}']`;
  },
  errorOnMiddleCommand: (commandString, commandsLeft, skippedCommandStrings) => {
    const skippedCommandStringsLog = `'${skippedCommandStrings.join("', '")}'`;
    return `Error executing '${commandString}'. Stopping and skipping ${commandsLeft} command(s): [${skippedCommandStringsLog}]`;
  },
  envVarSummary: (envVarName, envVarValue, shouldRunIfEmpty) => {
    let envVarValueLog;
    if (envVarValue === "") {
      envVarValueLog = `not set ("")`;
    } else if (envVarValue === undefined) {
      envVarValueLog = "not set";
    } else {
      envVarValueLog = `'${envVarValue}'`;
    }

    const trueIfEmptyLog = shouldRunIfEmpty ? "enabled" : "disabled";
    return `Environment variable '${envVarName}' is ${envVarValueLog} and --true-if-empty is ${trueIfEmptyLog}.`;
  },
};

main().catch((err) => {
  if (err.msg) {
    console.error(err.msg);
  }

  process.exit(err.code);
});
