module.exports = {
  html:function(title, list, body, post) {
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
  },
  list:function(filelist) {
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
}