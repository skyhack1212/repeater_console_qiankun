/**
 * @author Kuitos
 * @since 2019-04-11
 */
import patchDynamicAppend from './dynamicHeadAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import patchWindowListener from './windowListener';
export function patchAtMounting(appName, elementGetter, proxy, singular) {
  return [patchInterval(), patchWindowListener(), patchHistoryListener(), patchDynamicAppend(appName, elementGetter, proxy, true, singular)];
}
export function patchAtBootstrapping(appName, elementGetter, proxy, singular) {
  return [patchDynamicAppend(appName, elementGetter, proxy, false, singular)];
}