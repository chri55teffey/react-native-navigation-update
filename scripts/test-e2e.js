const _ = require('lodash');
const exec = require('shell-utils').exec;

const android = _.includes(process.argv, '--android');
const release = _.includes(process.argv, '--release');
const skipBuild = _.includes(process.argv, '--skipBuild');
const headless = _.includes(process.argv, '--headless');
const multi = _.includes(process.argv, '--multi');

run();

function run() {
    const platform = android ? `android` : `ios`;
    const prefix = android ? `android.emu` : `ios.sim`;
    const suffix = release ? `release` : `debug`;
    const configuration = `${prefix}.${suffix}`;
    const headless$ = android ? headless ? `--headless` : `` : ``;
    const workers = multi ? 3 : 1;
    
    console.log('guyca', `CI: ${process.env.CI} JENKINS_CI: ${process.env.JENKINS_CI}`)
    if (platform === 'android' && process.env.JENKINS_CI) {
        const sdkmanager = '/usr/local/share/android-sdk/tools/bin/sdkmanager';
        exec.execSync(`echo y | ${sdkmanager} --update && echo y | ${sdkmanager} --licenses`);
    }

    if (!skipBuild) {
        exec.execSync(`detox build --configuration ${configuration}`);
    }
    exec.execSync(`detox test --configuration ${configuration} --platform ${platform} ${headless$} ${!android ? `-w ${workers}` : ``}`); //-f "ScreenStyle.test.js" --loglevel trace
}
