const path = require('path');
const spawn = require('cross-spawn');
const CLI = require('clui');
const simpleGit = require('simple-git');

const Spinner = CLI.Spinner;

const ora = require('ora');

async function deploy() {
    let argv = require('minimist')(process.argv.slice(2));
    const env = argv['e'];

    // pre and prod corresponding the release branch of web-ui-dist
    let branch = env === 'pre' || !env ? 'release' : env;
    let command = 'build';
    if (env) {
        command = env === 'dev' ? 'build:qa' : `build:${env}`;
    }
    ora('部署开始...').info();
    // spawn.sync('yarn', ['build:qa'], { stdio: 'inherit' });
    spawn.sync('yarn', [command], { stdio: 'inherit' }); // 打包
    ora('build 完成').info();
    const status = new Spinner('初始化git...');
    status.start();
    const git = simpleGit({
        baseDir: path.resolve(__dirname, 'build'),
        binary: 'git'
    });
    try {
        const gitUrl = 'http://gitlab.apps.test.datadrivecloud.com/aikg/ai-graph-client-dist.git';
        await git
            .init()
            .checkoutLocalBranch(branch)
            .add('./*')
            .commit('auto commit')
            .addRemote('origin', gitUrl)
            .push(['origin', branch, '--force']);
        status.stop();
        ora('buid push完成..').info();
    } catch (err) {
        console.log(err.toString());
        status.stop();
    }
}

deploy();
