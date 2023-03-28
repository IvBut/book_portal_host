const extractValidationErrors = error => {
  if (!error?.inner?.length) return [];
  const result = {};
  for (const item of error.inner) {
    const path = item.path;
    if (!result[path]) {
      result[path] = [];
    }
    result[path].push(item.message);
  }
  return Object.keys(result).map(key => ({ path: key, messages: result[key] }));
};

module.exports = {
  extractValidationErrors
};
