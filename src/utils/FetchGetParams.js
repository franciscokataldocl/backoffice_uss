const { default: axios } = require("axios");

const FetchGetParams = async (url, params) => {
  try {
    const res = await axios.get(
     url,
      {
        data: params,
      }
    );
    return res.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports = FetchGetParams;
