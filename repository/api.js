const URL_BASE = "http://localhost:8080";

const headers = new Headers({
  "Content-Type": "application/json",
});

/**
 * Realiza una solicitud POST para obtener el token.
 * @param {Object} data - Los datos que se enviarán en la solicitud POST.
 * @returns {Promise<Response>} Una promesa que se resuelve con la respuesta de la solicitud POST.
 */

export async function login(data) {
  // console.log(data)
  try {
    const response = await fetch(`${URL_BASE}/login`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Manejar errores HTTP
      const errorData = await response.json();
      console.error(
        `Error ${response.status}: ${response.statusText}`,
        errorData
      );
      return { success: false, status: response.status, error: errorData };
    }

    const responseData = await response.json();
    return { success: true, status: response.status, data: responseData };
  } catch (error) {
    // Manejar errores de red u otros errores
    console.error("Network error:", error);
    return { success: false, status: null, error: error };
  }
}

// Metodo para obtener el token de localStorage
const token = () => {
  const headersjwt = new Headers({
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("tokenJwt"),
  });
  return headersjwt;
};

/**
 * Obtiene datos de un endpoint específico.
 * @param {string} endpoint - El endpoint al que se enviará la solicitud.
 * @param {string} [embed=""] - Parámetro opcional para incrustar datos adicionales.
 * @returns {Promise<any>} Una promesa que se resolverá con los datos obtenidos del endpoint.
 */

export async function getData(endpoint, embed = "") {
  console.log("-------------here");
  try {
    const response = await fetch(`${URL_BASE}/${endpoint}${embed}`, {
      headers: token(),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, status: response.status, data: data };
    } else if (response.status === 404) {
      console.error(
        "Error 404: El servidor no pudo encontrar el contenido solicitado"
      );
      return { success: false, status: response.status, error: "Not Found" };
    } else {
      console.error(
        `Error ${response.status}: El servidor ha encontrado una situación que no sabe cómo manejarla`
      );
      return {
        success: false,
        status: response.status,
        error: response.statusText,
      };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { success: false, status: null, error: error };
  }
}

/**
 * Realiza una solicitud POST a un punto final específico.
 * @param {Object} data - Los datos que se enviarán en la solicitud POST.
 * @param {string} endpoint - El punto final al que se enviarán los datos.
 * @returns {Promise<Response>} Una promesa que se resuelve con la respuesta de la solicitud POST.
 */

export async function postData(data, endpoint) {
  // console.log(data)
  try {
    const response = await fetch(`${URL_BASE}/${endpoint}`, {
      method: "POST",
      headers: token(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Manejar errores HTTP
      const errorData = await response.json();
      console.error(
        `Error ${response.status}: ${response.statusText}`,
        errorData
      );
      return { success: false, status: response.status, error: errorData };
    }

    const responseData = await response.json();
    return { success: true, status: response.status, data: responseData };
  } catch (error) {
    // Manejar errores de red u otros errores
    console.error("Network error:", error);
    return { success: false, status: null, error: error };
  }
}

/**
 * Actualiza los datos en el servidor utilizando el método PUT.
 * @param {Object} data - Los datos que se van a actualizar.
 * @param {string} endpoint - El punto final (endpoint) al que se enviarán los datos.
 * @param {string} id - El identificador único del elemento que se va a actualizar.
 * @returns {Promise} Una promesa que se resuelve cuando la solicitud de actualización se completa.
 */
export async function updateData(data, endpoint, id) {
  try {
    const response = await fetch(`${URL_BASE}/${endpoint}/${id}`, {
      method: "PUT",
      headers: token(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Manejar errores HTTP
      const errorData = await response.json();
      console.error(
        `Error ${response.status}: ${response.statusText}`,
        errorData
      );
      return { success: false, status: response.status, error: errorData };
    }

    const responseData = await response.json();
    return { success: true, status: response.status, data: responseData };
  } catch (error) {
    // Manejar errores de red u otros errores
    console.error("Network error:", error);
    return { success: false, status: null, error: error };
  }
}

/**
 * Obtiene un único conjunto de datos del servidor.
 * @param {string} id - El identificador del conjunto de datos que se desea obtener.
 * @param {string} endpoint - El punto final (endpoint) al que se realizará la solicitud.
 * @returns {Promise<object>} Un objeto que representa los datos obtenidos del servidor.
 * @throws {Error} Si ocurre algún error durante la solicitud.
 */
export async function getOneData(id, endpoint) {
  try {
    const response = await fetch(`${URL_BASE}/${endpoint}/${id}`, {
      headers: token(),
    });
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else if (response.status === 404) {
      console.log(
        "El servidor no pudo encontrar el contenido solicitado" +
          response.errorData
      );
    } else {
      console.log(
        "El servidor ha encontrado una situación que no sabe cómo manejarla"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Elimina datos de un endpoint mediante una solicitud DELETE.
 * @param {string} id - El ID del dato que se va a eliminar.
 * @param {string} endpoint - El endpoint al que se va a realizar la solicitud DELETE.
 * @returns {Promise} Una promesa que se resuelve cuando se completa la solicitud DELETE.
 */

export async function deleteData(id, endpoint) {
  try {
    const response = await fetch(`${URL_BASE}/${endpoint}/${id}`, {
      method: "DELETE",
      headers: token(),
    });

    if (!response.ok) {
      // Manejar errores HTTP
      const errorData = await response.json();
      console.error(
        `Error ${response.status}: ${response.statusText}`,
        errorData
      );
      return { success: false, status: response.status, error: errorData };
    }

    return { success: true, status: response.status };
  } catch (error) {
    // Manejar errores de red u otros errores
    console.error("Network error:", error);
    return { success: false, status: null, error: error };
  }
}
