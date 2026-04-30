export const validate = (schema) => (req, res, next) => {

  const data = {
    ...req.body,
    price: req.body.price ? Number(req.body.price) : undefined,
    duration: req.body.duration ? Number(req.body.duration) : undefined,
  }

  const result = schema.safeParse(data);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation Error",
      errors: result.error.issues.map(err => err.message)
    });
  }

  req.body = result.data;
  next();
};


