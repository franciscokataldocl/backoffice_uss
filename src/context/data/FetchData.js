// Importa las variables de entorno desde un archivo .env
const FetchData = async ({ url = '', method = 'GET', body = null, cache = 'no-cache', responseType = 'json' }) => {
  try {
    const safeMethods = ['GET', 'POST', 'PUT', 'DELETE']; // Lista de métodos seguros

    if (!safeMethods.includes(method)) {
      throw new Error('Método de solicitud no válido');
    }

    let headers = new Headers();

    // Añadir Content-Type solo si hay un cuerpo en la solicitud
    const bodyMethods = ['POST', 'PUT'];
    if (body !== null && bodyMethods.includes(method)) {
      headers.append("Content-Type", "application/json");
    }

    // Añadir Accept solo si se espera una respuesta JSON
    if (responseType === 'json') {
      headers.append("Accept", "application/json");
    }

    let requestOptions = {
      method: method,
      headers: headers,
      cache: cache,
      redirect: 'follow',
    };
    // Validación de cuerpo
    if (body !== null && bodyMethods.includes(method)) {
      requestOptions.body = JSON.stringify(body);
    }

    // Si se espera una respuesta de tipo blob (archivo binario)
    if (responseType === 'blob') {
      requestOptions.responseType = 'blob';
    }
    
    const response = await fetch(url, requestOptions);
 
    if (!response.ok) {
      if (responseType === 'blob') {
        // Manejar errores específicos para descargas de archivos binarios
        throw new Error('Error al descargar el archivo');
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error');
      }
    }

    if (responseType === 'blob') {
      return response.blob();
    } else {
      const result = await response.json();
      return result;
    }
  } catch (error) {
    if (error instanceof TypeError) {
      // Este tipo de error podría ocurrir si hay un problema de red, por ejemplo
      return { statusCode: 0, message: 'Error de red' };
    } else if (error instanceof SyntaxError) {
      // Este tipo de error podría ocurrir si la respuesta no es un JSON válido
      return { statusCode: 500, message: 'Error en el formato de la respuesta' };
    } else {
      // Otros tipos de errores
      return { statusCode: 500, message: error.message || 'Error Global' };
    }
  }
};

module.exports = FetchData;
