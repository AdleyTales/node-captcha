const Koa = require('koa');
const Router = require('koa-router');
const captchapng = require('captchapng2');
const static = require('koa-static'); 
const session = require('koa-session');

const app = new Koa();
const router = new Router();

app.keys = ['abcdef'];

const CONFIG = {
  key: 'koa:sess', 
  maxAge: 86400000,
  autoCommit: true, 
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: false,   
  renew: false, 
};


router.get('/img', async ctx => {
	let rand = parseInt(Math.random() * 9000 + 1000);
    let png = new captchapng(80, 30, rand); // width,height, numeric captcha

    ctx.session.vcode = rand;
 
    ctx.response.set({ 'Content-Type':'image/png'});
    ctx.body = png.getBuffer();
});

router.get('/vcode', async ctx => {

	let { captcha } = ctx.request.query;

	console.log(captcha);

	if(captcha != ctx.session.vcode){
		return ctx.body = {
					retCode: -1,
					msg: '验证码不正确！',
					vcode: ctx.session.vcode
				}
	}

	ctx.body = {
		retCode: 0,
		msg: '通过！',
		vcode: ctx.session.vcode
	}
	
	// ctx.body = 'abc';
});

app.use(session(CONFIG,app));

app.use(static('./public'));

app.use(router.routes());

app.listen(8080, ()=> {
	console.log(`server is running at 8080 ...`);
});