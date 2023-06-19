var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require('querystring');

function templateHTML(title, list, body, post) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${post}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list = "<ul>";
  var i = 0;
  while (i < filelist.length) {
    if (filelist[i].includes("WELCOME")) {
      i += 1;
      continue;
    }
    list += `
    <li>
      <a href="/?id=${filelist[i]}">${filelist[i]}</a>
    </li>`;
    i += 1;
  }
  list += "</ul>";

  return list;
}

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
      var post = `<a href="/create">create</a> <a href="/update">update</a>`;
    }
    fs.readdir("./data", function (errir, filelist) {
      fs.readFile(`data/${title}`, "utf8", function (err, description) {
        var list = templateList(filelist);
        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          post
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/create") {
    fs.readdir("./data", function (errir, filelist) {
      var title = "WEB - Create";
      var list = templateList(filelist);
      var template = templateHTML(
        title,
        list,
        `
          <form action="http://localhost:3000/create_process" method="post">
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
      response.end(template);
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
      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        if (err) throw err;
        response.writeHead(302, {Location: `/?id=${title}`});
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
