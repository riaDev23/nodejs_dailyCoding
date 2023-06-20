console.log('hello no daemon');

var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require('querystring');
var template = require('./lib/template.js')
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;
  if (pathname === "/") {
    if (title === undefined) {
      var title = "WELCOME !";
      var post = `<a href="/create">create</a>`;
    } else {
      var post = `
      <a href="/create">create</a>
      <a href="/update?id=${title}">update</a>
      <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <input type="submit" value="delete">
      </form>
      `;
    }
    fs.readdir("./data", function (err, filelist) {
      var filterdId = path.parse(title).base;
      fs.readFile(`data/${filterdId}`, "utf8", function (err, description) {
        var sanitizeTitle = sanitizeHtml(title);
        var sanitizeDescription = sanitizeHtml(description);
        var list = template.list(filelist);
        var html = template.html(
          sanitizeTitle,
          list,
          `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
          post
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (err, filelist) {
      var filterdId = path.parse(title).base;
      fs.readFile(`data/${filterdId}`, "utf8", function (err, de scription) {
        var list = template.list(filelist);
        var html = template.html(
          title,
          list,
          `
          <form action="/update_process" method="post">
            <p>
              <input type="hidden" name="id" value="${title}">
              <input type="text" name="title" placeholder="title" value="${title}">
            </p>
            
            <p>
              <textarea name="description" cols="25" rows="5" placeholder="내용을 입력하세요" style="resize:none;">${description}</textarea>
            </p>
            
            <p>
              <input type="submit">
            </p>
          </form>
        `,
        `<h4>${title} - 글수정</h4>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    var body = '';
    request.on('data', function(data){
      body += data;
      
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          if (err) throw err;
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
          console.log('The file has been saved!')
        })
      });
    });
  } else if (pathname === "/delete_process") {
    var body = '';
    request.on('data', function(data){
      body += data;
      
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, (err) => {
        if (err) throw err;
        response.writeHead(302, {Location: `/`});
        response.end();
        console.log(`data/${id} was deleted`)
      });
    });
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, filelist) {
      var title = "WEB - Create";
      var list = template.list(filelist);
      var html = template.html(
        title,
        list,
        `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            
            <p>
              <textarea name="description" cols="25" rows="5" placeholder="내용을 입력하세요" style="resize:none;"></textarea>
            </p>
            
            <p>
              <input type="submit">
            </p>
          </form>
        `,
        `<h4>글쓰기</h4>`
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    var body = '';
    request.on('data', function(data){
      body += data;
      if (body.length > 1e6) request.connection.destory();
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      var filterdId = path.parse(title).base;
      fs.writeFile(`data/${filterdId}`, description, 'utf8', (err) => {
        if (err) throw err;
        response.writeHead(302, {Location: `/?id=${filterdId}`});
        response.end();
        console.log('The file has been saved!')
      })
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
