/*基于静态资源的User-Agent模块*/
const express = require("express");
const path = require("path");
const agentParser = require("user-agent-parser");
const app = express();
const config = require("./config");

/*统计数据*/
var visits = config.visits;


app.use(function(req,res,next){
  req.agent = agentParser(req.headers['user-agent'] || '');
  next();
})

app.get('/',function(req,res){
  counts('req.agent.os.name',req);
  counts('req.agent.browser.name',req);
  //console.log(req.agent);
  console.log(visits);
  res.send(req.agent);
})

app.listen(config.port);


function counts(str,req){
  var a = str.split('.').slice(1);
  for(var i=0;i<a.length;i++){
    if( !(a[i] in req) ){
      return;
    }else{
      req = req[a[i]];
    }
  }
  var name = ''
  if(!name)return;
  if( ! (name in visits) ){
    visits[name] = 0;
  }
  visits[name]++;
}
