var path = require('path');
var ghdownload = require('github-download');

function downloadSubModuleFromGithub(user, repo, callback) {
  var dist = path.join(process.cwd(), 'ios/' + repo);

  console.log('\r\n Start downloading ' + repo + ' to `' + dist + '`');
  ghdownload({user: user, repo: repo, ref: 'master'}, dist)
    .on('end', function() {
      console.log('Download ' + repo + ' library success!');
      callback && callback();
    })
    .on('error', function (err) {
      console.error('Download ' + repo + ' library from github failed with err:', err);
    });
}

downloadSubModuleFromGithub('adamwulf', 'PerformanceBezier', function () {
  downloadSubModuleFromGithub('magicismight', 'QuartzBookPack');
});
