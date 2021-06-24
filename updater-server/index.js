const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const serve = require('koa-static-server');
const router = new Router();
const compareVersions = require('compare-versions');
const multer = require('koa-multer');

const upload = multer({ dest: 'crash/' });

router.post('/crash', upload.single('upload_file_minidump'), (ctx) => {
  ctx.body = {
    code: 1,
    data: 'done',
  };
  console.log('crash', ctx.req);
  // todo 存DB
});

function getNewVersion(version) {
  if (!version) return null;
  const maxVersion = {
    name: '1.0.1',
    pub_date: '2021-06-24T12:26:53+1:00',
    notes: '新增功能: 自定义下载路径',
    url: `http://127.0.0.1:9999/public/spiderchat-1.0.1-mac.zip`,
  };
  if (compareVersions.compare(maxVersion.name, version, '>')) {
    return maxVersion;
  }
  return null;
}

router.get('/darwin', (ctx, next) => {
  const { version } = ctx.query;
  const newVersion = getNewVersion(version);
  if (newVersion) {
    ctx.body = newVersion;
  } else {
    ctx.status = 204;
  }
});
app.use(
  serve({
    rootDir: 'public',
    rootPath: '/public',
  })
);
app.use(router.routes()).use(router.allowedMethods());

app.listen(9999);
