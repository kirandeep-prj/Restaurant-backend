const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const errorsArray = err.errors || err.issues || [];

    return res.status(400).json({
      message: "Validation failed",
      errors: errorsArray.map(e => ({
        field: e.path?.join(".") || "unknown",
        message: e.message
      }))
    });
  }
};

module.exports = validate;
