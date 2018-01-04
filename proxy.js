
/*基于静态资源的proxy模块*/


const express = require("express");
//const proxy = require("http-proxy").createProxyServer();
const config = require("./config");
const request = require('request');
const app = express();

/*活力服务器*/
var liveServer = {};
/*kill掉的机器.*/
var dieServer = {};

/*初始化所有集群服务器*/
liveServer = config.proxy_web;

/*切换后的负载函数.*/
function proxy(req,res,servers){
  var index = 0;
  function next(){
    var tar_url = servers[index++];
    request( tar_url,function(error,response,body){
      if(!error && response.statusCode == 200){
        return res.end(body);
      }else{
        next();
      }
    })
  }
  next();
}

/*代理的关键函数. 首次访问网站*/
function proxyPass(liveServer){
  return function(req,res,next){
    var servers = liveServer[req.hostname];
    proxy(req,res,servers);
    /*
    proxy.web(req,res,{
      target:target
    });
    */
  }
}

app.use(proxyPass(liveServer));


app.listen(config.prot);

/*多应用服务器.*/
const app10001 = express();
app10001.get('/',function(req,res){
  res.end('app10001');
})
app10001.listen(10001);

const app10002 = express();
app10002.get('/',function(req,res){
  res.end('app10002');
})
app10002.listen(10002);



const app2001 = express();
app2001.get('/',function(req,res){
  res.end('app2003');
})
app2001.listen(20003);
