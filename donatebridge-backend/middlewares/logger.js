export const log = (req, res, next) => {
  console.log(`Current url: ${req.url}; Method: ${req.method};  ${new Date()}`);
  next();
};
