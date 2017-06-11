var path = require('path');

module.exports = function(app, Horseman, cheerio) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Web-Scraper' });
  });

  app.get('/scrape', function(req, res){
  	var horseman = new Horseman();
  	horseman
  		.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
  		.open('https://techcrunch.com/')
  		.text('h2.post-title')
  		.then(function(data){
  			console.log(data);
  			res.json(data);
  		})
  		.close();
  });
}
