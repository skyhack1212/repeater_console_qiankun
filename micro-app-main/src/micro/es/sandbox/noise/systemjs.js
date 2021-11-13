/**
 * @author Kuitos
 * @since 2020-04-26
 */
export function interceptSystemJsProps(p, value) {
  // FIXME System.js used a indirect call with eval, which would make it scope escape to global
  // To make System.js works well, we write it back to global window temporary
  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
  if (p === 'System') {
    // @ts-ignore
    window.System = value;
  } // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357


  if (p === '__cjsWrapper') {
    // @ts-ignore
    window.__cjsWrapper = value;
  }
} // FIXME see interceptSystemJsProps function

export function clearSystemJsProps(map, allInactive) {
  if (!allInactive) return;

  if (map.has('System')) {
    // @ts-ignore
    delete window.System;
  }

  if (map.has('__cjsWrapper')) {
    // @ts-ignore
    delete window.__cjsWrapper;
  }
}