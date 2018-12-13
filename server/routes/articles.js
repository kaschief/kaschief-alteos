const express = require('express');
const Article = require('../models/Article');
const { isLoggedIn, checkRoles } = require('../middlewares');

const router = express.Router();
const checkAdmin = checkRoles('admin');

router.get('/', (req, res, next) => {
  Article.find()
    .sort({ created_at: -1 })
    .then(articles => {
      res.json(articles);
    })
    .catch(err => next(err));
});

//Route to get a single post
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Article.findById(id)
    .then(article => {
      res.json(article);
    })
    .catch(err =>
      res.status(400).json({ error: 'Invalid ID. Post not found.' })
    );
});

// Route to add an article
router.post('/', checkAdmin, (req, res, next) => {
  const { title, contents } = req.body;
  const _owner = req.user.id;
  let newArticle;

  if (!title || title.trim().length < 1) {
    return res.status(422).json({
      errors: {
        title: 'is required'
      }
    });
  } else if (!contents || contents.trim().length < 1) {
    return res.status(422).json({
      errors: {
        content: 'is required'
      }
    });
  } else
    newArticle = {
      title: title.trim(),
      contents: contents.trim(),
      _owner: _owner
    };
  Article.create(newArticle)
    .then(articleCreated => {
      res.json({
        success: true,
        articleCreated
      });
    })
    .catch(err => next(err));
});

// Route to delete an article
router.delete('/:id', isLoggedIn, (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndRemove(id)
    .then(article => {
      res.json({
        success: true,
        article
      });
    })
    .catch(err =>
      res.status(400).json({ error: 'Invalid ID. Article does not exist.' })
    );
});

// Route to update an article
router.patch('/:id', checkAdmin, (req, res, next) => {
  const id = req.params.id;
  const { title, contents } = req.body;
  let theUpdate;

  if (!title || title.trim().length < 1) {
    return res.status(422).json({
      errors: {
        title: 'is required'
      }
    });
  } else if (!contents || contents.trim().length < 1) {
    return res.status(422).json({
      errors: {
        content: 'is required'
      }
    });
  } else
    theUpdate = {
      title: title.trim(),
      contents: contents.trim()
    };
  Article.findByIdAndUpdate(id, theUpdate)
    .then(article => {
      res.json({
        success: true,
        article
      });
    })

    .catch(err =>
      res.status(400).json({ error: 'Invalid ID. Article does not exist.' })
    );
});

module.exports = router;
