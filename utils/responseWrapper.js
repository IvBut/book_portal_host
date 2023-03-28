const errorWrapper = error => {
  return { error };
};

const dataWrapper = data => {
  return { data };
};

module.exports = {
  errorWrapper,
  dataWrapper
};
