const logger = (req, res, next) => {
    const time = new Date().toLocaleString();
    console.log(`${time} - ${req.method} request to ${req.originalUrl}`);
    next();
};

module.exports = logger;