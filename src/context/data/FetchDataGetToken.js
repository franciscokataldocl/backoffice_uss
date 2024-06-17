
//Obtener token de blackboard
const FetchDataGetToken = async () => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${process.env.REACT_APP_BLACKBOARD_BASIC_TOKEN}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.REACT_APP_BLACKBOARD_CLIENT_ID,
      client_secret: process.env.REACT_APP_BLACKBOARD_CLIENT_SECRET,
    }),
  };

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BLACKBOARD_URL}/oauth2/token`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Error al obtener el token de acceso");
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = FetchDataGetToken;