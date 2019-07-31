/* eslint-disable no-console */
const path = require('path');
var electron_notarize = require('electron-notarize');
const pjson = require('../package.json');
const fs = require('fs');

module.exports = async function (params) {
  // Only notarize the app on Mac OS only.
  if (process.platform !== 'darwin') {
    return;
  }
  console.log('afterSign hook triggered', params);

  let appId = pjson.build.appId;

  let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

  console.log(`Notarizing ${appId} found at ${appPath}`);

  try {
    await electron_notarize.notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`Done notarizing ${appId}`);
};
