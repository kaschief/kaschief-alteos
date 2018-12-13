function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) next();
  else next({ status: 403, message: 'Unauthorized' });
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else
      next({
        status: 403,
        message: 'You do not have permission to perform this action'
      });
  };
}

module.exports = {
  isLoggedIn,
  checkRoles
};
