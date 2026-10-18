// Behavioural harness for dsh-plugin-effort-slider's chip registration.
// Loads the real client bundle in a faked client runtime and asserts where the
// plugin registers and what its slot inject() returns. The plugin must NOT touch
// `conversation.input.model` (the built-in model seat lives there).
//
// Run: node test/chip.test.mjs   (or: pnpm test)
import assert from "node:assert/strict";
import fs from "node:fs";

const bundlePath = process.argv[2]
  ?? new URL("../client/bundle.js", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// ---- fake browser + module loader ----
let definition;
globalThis.window = { __ModuleLoader__: { load(def) { definition = def; } } };
globalThis.document = {
  createElement: () => ({ dataset: {}, textContent: "" }),
  head: { appendChild() {} },
  querySelector: () => null,
};
const React = {
  createElement: () => null,
  Fragment: Symbol("fragment"),
  useState: (init) => [typeof init === "function" ? init() : init, () => {}],
  useEffect: () => {},
  useRef: (init) => ({ current: init ?? null }),
};
const requireStub = (name) => {
  if (name === "react") return React;
  throw new Error(`unexpected require: ${name}`);
};

(0, eval)(fs.readFileSync(bundlePath, "utf8"));
assert.ok(definition !== undefined, "bundle did not register with __ModuleLoader__");

const plugin = definition.factory(requireStub);
assert.equal(typeof plugin.apply, "function", "bundle exports apply");

// ---- fake cordis context ----
function makeContext(services) {
  const registered = [];
  const ctx = {
    timer: {},
    get: (name) => services[name],
    on: () => () => {},
    effect: (fn) => fn(),
    inject(deps, callback) {
      if (deps.every((dep) => services[dep] !== undefined)) callback({ ...services });
      return () => {};
    },
  };
  services.slots = {
    inject(ownerKey, factory) { registered.push({ ownerKey, entry: factory() }); },
    register(options, component) { return { options, component }; },
  };
  return { ctx, registered };
}

const stubDirectory = {
  store: {
    getSnapshot: () => ({ groups: [], current: null, status: "idle", failures: [], error: null }),
    subscribe: () => () => {},
  },
  load: async () => {},
  select: async () => {},
};

// ---- case 0: never registers into the built-in model seat ----
{
  const { ctx, registered } = makeContext({});
  plugin.apply(ctx);
  const targets = registered.map((r) => r.ownerKey);
  assert.deepEqual(targets, ["conversation.input.right"], "registers only the input-right chip");
  assert.ok(!targets.includes("conversation.input.model"), "must not shadow the built-in model seat");
  const { options } = registered[0].entry;
  assert.equal(options.name, "conversation.input.right");
  assert.equal(options.id, "effort-slider");
  console.log("ok   registers into conversation.input.right only (model seat untouched)");
}

// ---- case 1: modelDirectories not mounted yet ----
{
  const { ctx, registered } = makeContext({});
  plugin.apply(ctx);
  const injected = registered[0].entry.options.inject("s1");
  assert.equal(injected.available, true, "chip stays visible without modelDirectories");
  assert.equal(injected.degraded, true);
  console.log("ok   early load: available=true degraded=true");
}

// ---- case 2: services present ----
{
  const { ctx, registered } = makeContext({
    modelDirectories: { directoryFor: () => stubDirectory },
    sessions: { subagentAddress: () => undefined },
  });
  plugin.apply(ctx);
  const injected = registered[0].entry.options.inject("s1");
  assert.equal(injected.available, true);
  assert.equal(injected.degraded, false);
  assert.equal(injected.directory, stubDirectory.store);
  console.log("ok   normal session: real directory wired (degraded=false)");
}

// ---- case 3: subagent session hidden, like the built-in seat ----
{
  const { ctx, registered } = makeContext({
    modelDirectories: { directoryFor: () => stubDirectory },
    sessions: { subagentAddress: () => ({ childSessionId: "child" }) },
  });
  plugin.apply(ctx);
  assert.equal(registered[0].entry.options.inject("s2").available, false);
  console.log("ok   subagent session: available=false (hidden)");
}

// ---- case 4: directoryFor throws -> degraded, not a crash ----
{
  const { ctx, registered } = makeContext({
    modelDirectories: { directoryFor: () => { throw new Error("no live directory"); } },
    sessions: { subagentAddress: () => undefined },
  });
  plugin.apply(ctx);
  const injected = registered[0].entry.options.inject("s3");
  assert.equal(injected.available, true);
  assert.equal(injected.degraded, true);
  console.log("ok   throwing directoryFor: degraded=true instead of a crash");
}

console.log("\n5/5 passed");
