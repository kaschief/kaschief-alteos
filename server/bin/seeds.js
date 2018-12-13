const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Article = require('../models/Article');

const bcryptSalt = 10;

mongoose
  .connect(
    'mongodb://localhost/christmas-collection',
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

let users = [
  {
    username: 'kash',
    password: bcrypt.hashSync('kash', bcrypt.genSaltSync(bcryptSalt)),
    role: 'admin'
  }
];

User.deleteMany()
  .then(() => {
    return Article.deleteMany()
      .then(() => {
        return User.create(users);
      })
      .then(user => {
        console.log('User created', user);
        let id;
        user.forEach(u => {
          return (id = u._id);
        });

        let newArticle = [
          {
            title:
              'Taylor Swift used facial recognition software to detect stalkers at LA concert',
            contents:
              'The Rose Bowl venue didn’t inform concert-goers that their image might be collected at a special kiosk showing Taylor Swift rehearsal clips',
            _owner: id,
            timestamps: true
          },
          {
            title:
              'Manhunt for Strasbourg gunman continues across German border',
            contents:
              'A major manhunt is continuing in France and across the German border as police appealed to the public for information about the suspected Strasbourg gunman who killed three and left several people seriously wounded before escaping the security services on Tuesday night.',
            _owner: id,
            timestamps: true
          },
          {
            title: `'Planet of the chickens': How the bird took over the world`,
            contents:
              'A study of chicken bones dug up at London archaeological sites shows how the bird we know today has altered beyond recognition from its ancestors.',
            _owner: id,
            timestamps: true
          }
        ];

        return Article.create(newArticle).then(createdArticle => {
          console.log('Articles created', createdArticle);
          mongoose.disconnect();
        });
      });
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
