const FetchDataBlackBoardToken = async (token, method, body = null, url) => {
  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports = FetchDataBlackBoardToken;
