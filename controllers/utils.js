exports.errCatch = (res, statusCode, err) => {
  res.status(statusCode).json({
    status: 'fail',
    message: err,
  });
};
exports.arraySanitize = (arrayToClean) => {
  const cleanedArray = [];
  arrayToClean.forEach((val) => {
    if (val !== null && typeof val !== 'undefined' && ('' + val).trim() !== '') {
      cleanedArray.push(val);
    }
  });

  return cleanedArray;
};
