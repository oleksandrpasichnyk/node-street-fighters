const responseMiddleware = (req, res) => {
  if (res.err) {
    res.json({
      error: true,
      message: res.err || 'Something went wrong',
    });
  }
  res.status(200).json(res.data);
};

exports.responseMiddleware = responseMiddleware;
