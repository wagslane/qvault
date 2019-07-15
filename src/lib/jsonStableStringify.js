// modified from https://github.com/substack/json-stable-stringify

export default function jsonStableStringify(obj) {
  let seen = [];
  return (function stringify (parent, key, node, level) {
    if (node && node.toJSON && typeof node.toJSON === 'function') {
      node = node.toJSON();
    }
    
    if (node === undefined) {
      return;
    }

    if (typeof node !== 'object' || node === null) {
      return JSON.stringify(node);
    }

    if (Array.isArray(node)) {
      const stringified = node.map((val, i, arr) => stringify(arr, i, val, level+1) || JSON.stringify(null));
      return `[${stringified}]`;
    }

    if (seen.indexOf(node) !== -1) {
      throw 'Converting circular structure to JSON';
    }
    seen.push(node);

    let keys = Object.keys(node).sort();
    let out = [];
    for (const key of keys) {
      let value = stringify(node, key, node[key], level+1);
      if(!value) return;
      out.push(`${JSON.stringify(key)}:${value}`);
    }
    seen.splice(seen.indexOf(node), 1);
    return `{${out.join(',')}}`;

  })({ '': obj }, '', obj, 0);
}
