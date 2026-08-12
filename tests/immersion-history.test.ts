import assert from "node:assert/strict";
import test from "node:test";
import { exitImmersionHistory } from "../src/utils/immersionHistory.ts";

test("confirmed exit removes record and guard before returning home", () => {
  const entries = ["/", "/immersion/record", "/immersion/record"];
  let index = entries.length - 1;
  let popStateListener: (() => void) | undefined;

  exitImmersionHistory({
    history: {
      go(delta) {
        index += delta;
        popStateListener?.();
      },
      pushState() {
        entries.splice(index + 1);
        entries.push(entries[index]);
        index += 1;
      },
    },
    target: {
      addEventListener(_type, listener) {
        popStateListener = listener;
      },
    },
    onHistoryCleared() {
      entries[index] = "/immersion/returning";
      entries[index] = "/";
    },
  });

  assert.equal(entries[index], "/");
  assert.equal(entries.includes("/immersion/record"), false);

  index = Math.min(index + 1, entries.length - 1);
  assert.equal(entries[index], "/", "Forward from home cannot restore record mode");
});
