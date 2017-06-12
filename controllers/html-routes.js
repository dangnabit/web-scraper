var path = require('path');

module.exports = function(app, request, cheerio) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Web-Scraper' });
  });

  app.get('/scrape', function(req, res) {
    request('https://techcrunch.com/', function(error, response, html) {

      var $ = cheerio.load(html);

      var result = [];

      $('.river').each(function() {
        $(this).find('div.block-content').each(function() {
          var title = $(this).find('h2.post-title a').text();
          var link = $(this).find('h2.post-title a').attr("href");
          var author = $(this).find('div.byline a').text();
          var authorLink = 'https://www.techcrunch.com' + $(this).find('div.byline a').attr("href");
          var excerpt = $(this).find('p.excerpt').html();
          result.push({
            title: title,
            link: link,
            excerpt: excerpt,
            author: author,
          	authorLink: authorLink
          });
        });
      });

      res.json(result);
    });
  });
}
