const { raw } = require('body-parser');
const { readFile } = require('fs/promises');
const path = require('path');

function zip(keys, values) {
  return keys.map((key, index) => [key, values[index]]);
}

function set(obj, path, rawValue) {
  const keys = path.split('.');
  let value = rawValue;
  if (rawValue === '-') {
    value = null;
    if (keys[0] === 'action') {
      return obj;
    }
  }
  if (rawValue === 'true') {
    value = true;
  }
  if (rawValue === 'false') {
    value = false;
  }
  if (rawValue === 'empty') {
    value = '';
  }
  let current = obj;
  for (const key of keys.slice(0, -1)) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}

const key2StatePath = {
  SDIValue: 'state.display.input.value',
  SDIStatus: 'state.display.input.status',
  SDRData: 'state.display.result',
  SDSLoading: 'state.display.status.loading',
  SDEMessage: 'state.display.error',
  SNRequest: 'state.network.request',
  STStatus: 'state.timer.debounce',
  Action: 'action.type',
  AQuery: 'action.query',
  ASuccess: 'action.payload',
};

async function combinations2JSON(defaultCombinations) {
  let combinations = defaultCombinations;
  if (!defaultCombinations) {
    combinations = await readFile(
      path.resolve(__dirname, './combinations'),
      'utf-8',
    );
  }
  const rawLines = combinations
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);
  const keys = rawLines[0].split(/\s+/gm);
  const testCases = rawLines
    .slice(1)
    .map(line => zip(keys, line.split(/\s+/gm)))
    .map(entries =>
      entries.reduce(
        (acc, [key, value]) => set(acc, key2StatePath[key], value),
        {},
      ),
    );
  console.log(JSON.stringify(testCases, null, 2));
}

if (require.main.filename === __filename) {
  combinations2JSON();
}

module.exports = combinations2JSON;
