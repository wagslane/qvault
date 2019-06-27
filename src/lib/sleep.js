export default function sleep(duration) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
