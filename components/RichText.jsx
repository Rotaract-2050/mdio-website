import React from 'react';

// Renders a string that may contain a small whitelist of inline tags:
// <em>, <strong>, <br/>. Everything else is rendered as plain text, so no
// HTML is ever injected (no dangerouslySetInnerHTML).
const TAG = /<(\/?)(em|strong|br)\s*\/?>/g;

const RichText = ({ text }) => {
  if (text === null || text === undefined) return null;
  const str = String(text);
  const root = [];
  const stack = [{ children: root }];
  const push = (node) => stack[stack.length - 1].children.push(node);
  const close = () => {
    const f = stack.pop();
    push(React.createElement(f.name, { key: f.key }, ...f.children));
  };
  const re = new RegExp(TAG);
  let last = 0;
  let key = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) push(str.slice(last, m.index));
    const [, closing, name] = m;
    if (name === 'br') {
      push(<br key={key++} />);
    } else if (closing) {
      if (stack.length > 1 && stack[stack.length - 1].name === name) close();
    } else {
      stack.push({ name, key: key++, children: [] });
    }
    last = re.lastIndex;
  }
  if (last < str.length) push(str.slice(last));
  while (stack.length > 1) close();
  return <>{root}</>;
};

export default RichText;
