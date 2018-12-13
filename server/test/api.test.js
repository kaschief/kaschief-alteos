const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;

makeRandomUser = function() {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

const randomStr = makeRandomUser();

//SIGN UP

describe('Signing up', function() {
  const user = {
    username: `${randomStr}`,
    password: `${randomStr}`
  };
  it('responds with 200', function(done) {
    request(app)
      .post('/api/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//SIGN UP, MISSING CREDENTIALS

describe('Signing up without username or password', function() {
  const user = {
    username: `${randomStr}`,
    password: null
  };
  it('responds with 401, indicate username or password', function(done) {
    request(app)
      .post('/api/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//LOG IN

describe('Logging In', function() {
  const user = {
    username: `${randomStr}`,
    password: `${randomStr}`
  };
  it('responds with 200', function(done) {
    request(app)
      .post('/api/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//LOG IN with INCORRECT CREDENTIALS

describe('Logging in with incorrect credentials', function() {
  const user = {
    username: `${randomStr}`,
    password: '1234'
  };

  it('responds with 401, credentials failure', function(done) {
    request(app)
      .post('/api/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//GET ALL ARTICLES
describe('Getting all the articles', () => {
  it('responds with a JSON containing a list of all articles', done => {
    request(app)
      .get('/api/articles')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

//GET SINGLE ARTICLE

describe('Getting a single (but nonexistent) article', function() {
  it('responds with 400, "invalid ID, post not found"', function(done) {
    request(app)
      .get(`/api/articles/${randomStr}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({ error: 'Invalid ID. Post not found.' })
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//CREATE NEW ARTICLE as ADMIN

describe('Creating a new article as admin', function() {
  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end((err, response) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'Made Up Title',
    contents: 'This text is not really real'
  };
  it('respond with 200 if it is created', function(done) {
    authenticatedAdmin
      .post('/api/articles')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//CREATE NEW ARTICLE as NON-ADMIN

describe('Creating a new article as user (non-admin role)', function() {
  const user = {
    username: `${randomStr}`,
    password: `${randomStr}`
  };

  const authenticatedUser = request.agent(app);

  before(function(done) {
    authenticatedUser
      .post('/api/login')
      .send(user)
      .end((err, response) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'Made Up Title',
    contents: 'This text is not really real'
  };

  it('respond with 403, no permission to perform this action', function(done) {
    authenticatedUser
      .post('/api/articles')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//CREATE SINGLE ARTICLE, NO TITLE

describe('Creating a new article, but without title', function() {
  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: null,
    contents: 'This blog post does not have a title'
  };

  it('should respond with 422, title is required', function(done) {
    authenticatedAdmin
      // request(app)
      .post('/api/articles')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//CREATE SINGLE ARTICLE, NO CONTENT

describe('Creating a new article, but without content', function() {
  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'Help! This Post Does Not Have Any Body',
    contents: null
  };

  it('should respond with 422, content is required', function(done) {
    authenticatedAdmin
      // request(app)
      .post('/api/articles')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//DELETE ARTICLE as NON-ADMIN

describe('Delete an article (as non-admin)', function() {
  const user = {
    username: `${randomStr}`,
    password: `${randomStr}`
  };

  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedUser = request.agent(app);
  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  before(function(done) {
    authenticatedUser
      .post('/api/login')
      .send(user)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'Why Do You Want To Delete Me?',
    contents: 'If you were not a fake blog post, then I would keep you.'
  };

  let theID;

  before(function(done) {
    authenticatedAdmin
      .post('/api/articles')
      .send(data)
      .end(function(err, response) {
        theID = response.body.articleCreated._id;
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it('should respond with 200 if article is deleted', function(done) {
    authenticatedUser
      .delete(`/api/articles/${theID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//DELETE ARTICLE with INCORRECT ID

describe('Delete an article, but with invalid ID params', function() {
  const user = {
    username: `${randomStr}`,
    password: `${randomStr}`
  };

  const authenticatedUser = request.agent(app);

  before(function(done) {
    authenticatedUser
      .post('/api/login')
      .send(user)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it('should respond with 400, Invalid ID', function(done) {
    authenticatedUser
      .delete(`/api/articles/${randomStr}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//UPDATE ARTICLE as NON-ADMIN

describe('Updating an article as user (non-admin) role', function() {
  const user = {
    username: `${randomStr}`,
    password: `${randomStr}`
  };

  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedUser = request.agent(app);
  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  before(function(done) {
    authenticatedUser
      .post('/api/login')
      .send(user)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'Update U?',
    contents: 'Excuse me! Update Who?'
  };

  let theID;

  before(function(done) {
    authenticatedAdmin
      .post('/api/articles')
      .send(data)
      .end(function(err, response) {
        theID = response.body.articleCreated._id;
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const updatedData = {
    title: 'Update Each Other',
    contents: 'I am happy that we are now updated.'
  };

  it('should respond with 403, no permission to perform this action', function(done) {
    authenticatedUser
      .patch(`/api/articles/${theID}`)
      .send(updatedData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//UPDATE ARTICLE as ADMIN

describe('Updating an article as admin', function() {
  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'Update U?',
    contents: 'Excuse me! Update Who?'
  };

  let theID;

  before(function(done) {
    authenticatedAdmin
      .post('/api/articles')
      .send(data)
      .end(function(err, response) {
        theID = response.body.articleCreated._id;
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const updatedData = {
    title: 'Update Each Other',
    contents: 'I am happy that we are now updated.'
  };

  it('should respond with 200 if it was updated', function(done) {
    authenticatedAdmin
      .patch(`/api/articles/${theID}`)
      .send(updatedData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//UPDATE ARTICLE with INCORRECT PARAMS

describe('Updating an article with incorrect ID params', function() {
  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'Why Do You Want To Update Me?',
    contents: 'Because you entered the incorrect ID and that is not cool.'
  };

  let theID;

  before(function(done) {
    authenticatedAdmin
      .post('/api/articles')
      .send(data)
      .end(function(err, response) {
        theID = response.body.articleCreated._id;
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const updatedData = {
    title: 'Why Do You Want To Update Me?',
    contents: 'Now all the info is correct. You will be golden now.'
  };

  it('should respond with 400, invalid ID', function(done) {
    authenticatedAdmin
      .patch(`/api/articles/${randomStr}`)
      .send(updatedData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//UPDATE ARTICLE with MISSING CONTENT

describe('Updating an article with missing contents', function() {
  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'I Heard...',
    contents: 'The information you heard is incorrect.'
  };

  let theID;

  before(function(done) {
    authenticatedAdmin
      .post('/api/articles')
      .send(data)
      .end(function(err, response) {
        theID = response.body.articleCreated._id;
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const updatedData = {
    title: 'I Heard...',
    contents: null
  };

  it('should respond with 422, content is required', function(done) {
    authenticatedAdmin
      .patch(`/api/articles/${theID}`)
      .send(updatedData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

//UPDATE ARTICLE with MISSING DATA

describe('Updating an article with missing title or content', function() {
  const admin = {
    username: 'kash',
    password: 'kash'
  };

  const authenticatedAdmin = request.agent(app);

  before(function(done) {
    authenticatedAdmin
      .post('/api/login')
      .send(admin)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const data = {
    title: 'I heard...wait, what?',
    contents: 'What did you hear?'
  };

  let theID;

  before(function(done) {
    authenticatedAdmin
      .post('/api/articles')
      .send(data)
      .end(function(err, response) {
        theID = response.body.articleCreated._id;
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  const updatedData = {
    title: null,
    contents: 'No one will hear what you heard.'
  };

  it('should respond with 422, title is required', function(done) {
    authenticatedAdmin
      .patch(`/api/articles/${theID}`)
      .send(updatedData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});
