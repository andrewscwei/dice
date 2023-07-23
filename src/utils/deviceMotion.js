const CACHE_KEY_DEVICE_MOTION = 'device-motion';

export function needsDeviceMotionPermission() {
  return typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function';
}

export async function checkDeviceMotionPermissionStatus() {
  try {
    const res = await DeviceMotionEvent.requestPermission();
    console.log('STATUS', res);
    return res;
  }
  catch (err) {
    console.log('ERR', err);
  }
}

export function hasRequestedDeviceMotionPermission() {
  return typeof localStorage.getItem(CACHE_KEY_DEVICE_MOTION) !== 'string';
}

export async function requestDeviceMotionPermission() {
  if (!needsDeviceMotionPermission()) return;

  const res = await DeviceMotionEvent.requestPermission();

  if (res === 'granted') {
    sessionStorage.setItem(CACHE_KEY_DEVICE_MOTION, 'granted');
  }
  else {
    sessionStorage.setItem(CACHE_KEY_DEVICE_MOTION, 'denied');
  }
}

export async function cancelDeviceMotionPermissionRequest() {
  if (!needsDeviceMotionPermission()) return;

  localStorage.setItem(CACHE_KEY_DEVICE_MOTION, 'dismissed');
}

export function isDeviceMotionPermissionGranted() {
  return sessionStorage.getItem(CACHE_KEY_DEVICE_MOTION) === 'granted';
}

export function isDeviceMotionPermissionDenied() {
  return sessionStorage.getItem(CACHE_KEY_DEVICE_MOTION) === 'denied';
}
