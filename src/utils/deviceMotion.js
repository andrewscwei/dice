const CACHE_KEY_DEVICE_MOTION = 'device-motion';
const CACHE_KEY_DEVICE_MOTION_REQUEST_DATE = 'device-motion-request-date';

export function needsDeviceMotionPermission() {
  return typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function';
}

export async function requestDeviceMotionPermission() {
  if (!needsDeviceMotionPermission()) return 'notSupported';

  let status;

  try {
    status = await DeviceMotionEvent.requestPermission(); // either 'granted' or 'denied'
  }
  catch (err) {
    status = 'notDetermined';
  }

  sessionStorage.setItem(CACHE_KEY_DEVICE_MOTION, status);

  return status;
}

export function getDeviceMotionPermission() {
  if (!needsDeviceMotionPermission()) return 'notSupported';

  return sessionStorage.getItem(CACHE_KEY_DEVICE_MOTION) ?? 'notDetermined';
}

export function rememberDeviceMotionRequestDate() {
  sessionStorage.setItem(CACHE_KEY_DEVICE_MOTION_REQUEST_DATE, String(Date.now()));
}

export function hasRequestedDeviceMotionPermission() {
  return typeof sessionStorage.getItem(CACHE_KEY_DEVICE_MOTION_REQUEST_DATE) !== 'string';
}
