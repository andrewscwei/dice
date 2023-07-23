const CACHE_KEY_PERMISSION_REQUESTED = 'permission-requested';

export function hasAccelerometer() {
  return typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function';
}

export function hasRequestedAccelerometerPermission() {
  return typeof localStorage.getItem(CACHE_KEY_PERMISSION_REQUESTED) !== 'string';
}

export async function requestAccelerometerPermission() {
  if (!hasAccelerometer()) return;

  const res = await DeviceMotionEvent.requestPermission();

  if (res === 'granted') {
    sessionStorage.setItem(CACHE_KEY_PERMISSION_REQUESTED, 'granted');
  }
  else {
    sessionStorage.setItem(CACHE_KEY_PERMISSION_REQUESTED, 'denied');
  }
}

export async function cancelRequestAccelerometerPermission() {
  if (!hasAccelerometer()) return;

  localStorage.setItem(CACHE_KEY_PERMISSION_REQUESTED, 'pending');
}

export function isAccelerometerPermissionGranted() {
  return sessionStorage.getItem(CACHE_KEY_PERMISSION_REQUESTED) === 'granted';
}

export function isAcclerometerPermissionDenied() {
  return sessionStorage.getItem(CACHE_KEY_PERMISSION_REQUESTED) === 'denied';
}
