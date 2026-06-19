import { exec } from '@lerna-lite/core';
import { log } from '@lerna-lite/npmlog';
export function gitPush(remote, branch, opts, dryRun = false) {
    log.silly('gitPush', remote, branch);
    return exec('git', ['push', '--follow-tags', '--no-verify', '--atomic', remote, branch], opts, dryRun).catch((error) => {
        if (/does not support --atomic/.test(error.stderr) ||
            (process.env.GIT_REDIRECT_STDERR === '2>&1' && /does not support --atomic/.test(error.stdout))) {
            process.exitCode = 0;
            log.warn('gitPush', error.stderr);
            log.info('gitPush', '--atomic failed, attempting non-atomic push');
            return exec('git', ['push', '--follow-tags', '--no-verify', remote, branch], opts, dryRun);
        }
        throw error;
    });
}
export function gitPushSingleTag(remote, branch, tag, opts, dryRun = false) {
    log.silly('gitPush', remote, branch);
    return exec('git', ['push', '--no-verify', '--atomic', remote, tag, branch], opts, dryRun).catch((error) => {
        if (/does not support --atomic/.test(error.stderr) ||
            (process.env.GIT_REDIRECT_STDERR === '2>&1' && /does not support --atomic/.test(error.stdout))) {
            process.exitCode = 0;
            log.warn('gitPush', error.stderr);
            log.info('gitPush', '--atomic failed, attempting non-atomic push');
            return exec('git', ['push', '--no-verify', remote, tag, branch], opts, dryRun);
        }
        throw error;
    });
}
//# sourceMappingURL=git-push.js.map