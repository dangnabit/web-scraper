var path = require('path');

module.exports = function(app, request, cheerio, Article, Note) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Web-Scraper' });
  });

  app.get('/article', function(req, res) {
    // Grabs all articles from the DB
    Article.find({}).sort({_id: -1}).exec(function(error, data) {
      if (error) throw error;
      console.log(data);
      res.render('index', { article: data });
    });
  });

  app.get('/api/article', function(req, res) {
    // Grabs all articles from the DB
    Article.find({}, function(error, data) {
      if (error) throw error;
      console.log(data);
      res.json(data);
    });
  });

  app.get('/api/article/:id', function(req, res) {
    // Finds one article by entry ID and populates any Notes with it.
    Article
      .findOne({
        '_id': req.params.id
      })
      .populate('note')
      .exec(function(error, data) {
        if (error) throw error;
        res.json(data);
      });
  });

  //Posts notes to the DB and then updates the associated Article DB entry to add the Note Reference
  app.post("/api/articles/:id", function(req, res) {

    var newNote = new Note(req.body);

    newNote.save(function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        Article.findOneAndUpdate({
          "_id": req.params.id
        }, {
          $set: {
            "note": doc._id
          }
        }, {
          new: true
        }, function(error, doc) {
          if (error) {
            res.json(error);
          } else {
            res.json(doc);
          }
        });
      }
    });
  });

  // Uses request to scraped TechCrunch.com and grabs all of the latest story information and adds them to the database
  app.get('/scrape', function(req, res) {
    request('https://techcrunch.com/', function(error, response, html) {

      var $ = cheerio.load(html);

      var result = [];

      $('.river').each(function() {
        $(this).find('div.block-content').each(function() {
          var title = $(this).find('h2.post-title a').text();
          var link = $(this).find('h2.post-title a').attr('href');
          var excerpt = $(this).find('p.excerpt').html();
          var author = $(this).find('div.byline a').text();
          var authorLink = 'https://www.techcrunch.com' + $(this).find('div.byline a').attr('href');

          // Creates object and pushes it to the result array.
          result.push({
            title: title,
            link: link,
            excerpt: excerpt,
            author: author,
            authorLink: authorLink
          });
        });

      });

      for (var i = 0; i < result.length; i++) {

        var entry = new Article(result[i]);

        Article.findOneAndUpdate({
            title: entry.title
          },
          entry, {
            upsert: true
          },
          function(err, doc) {
            if (err) {
              console.log(err);
            } else {
              // console.log(doc);
            }
          });
      }
      res.redirect('/article');
    });
  });
}
