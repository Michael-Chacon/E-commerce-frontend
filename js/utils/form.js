export function createImput(
  elementoPadre,
  iddinamico,
  tipo,
  nombre,
  subtexto,
  etiqueta,
  hidden
) {
  const divPadre = document.createElement("div");
  divPadre.classList.add("mt-3");

  const newLabel = document.createElement("label");
  if (!hidden) {
    newLabel.classList.add("form-label");
    newLabel.setAttribute("for", iddinamico);
    newLabel.textContent = capitalizeFirstLetter(nombre);
  }

  const element = document.createElement(etiqueta);
  element.classList.add("form-control", "mb-3");
  element.setAttribute("type", tipo);
  element.setAttribute("id", iddinamico);
  element.setAttribute("name", nombre);
  element.setAttribute("placeholder", subtexto);
  if (!hidden) {
    element.setAttribute("required", true);
  }
  if (hidden) {
    element.setAttribute("hidden", true);
  }

  if (!hidden) {
    divPadre.appendChild(newLabel);
  }

  divPadre.appendChild(element);
  elementoPadre.appendChild(divPadre);
  return elementoPadre;
}

export function createSelect(elementoPadre, iddinamico, nombre, subtexto, data){
  const divPadre = document.createElement("div");
  divPadre.classList.add("mt-3");

  const newLabel = document.createElement("label");
  newLabel.classList.add("form-label");
  newLabel.setAttribute("for", iddinamico);
  newLabel.textContent = capitalizeFirstLetter(nombre);

  const select = document.createElement('select');
  select.classList.add("form-select", "mb-3");
  select.setAttribute("id", iddinamico);
  select.setAttribute("name", nombre);
  select.setAttribute("placeholder", subtexto);
  select.setAttribute("required", true);
  select.setAttribute("aria-label", "Default select example");

  console.log(data)
  data.forEach(city => {
    const option = document.createElement('option');
    option.value = city.id;
    option.textContent = city.name;
    select.appendChild(option);
  });

  divPadre.appendChild(newLabel);
  
  divPadre.appendChild(select);
  elementoPadre.appendChild(divPadre);
  return elementoPadre;
}

function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function manipularModal(modalElement, accion) {
  // Intentar obtener la instancia existente del modal
  let modal = bootstrap.Modal.getInstance(modalElement);

  // Si no existe la instancia, crear una nueva
  if (!modal) {
    modal = new bootstrap.Modal(modalElement);
  }

  if (accion === "show") {
    modal.show();
  } else if (accion === "hide") {
    modal.hide();
  } else {
    console.log("Error, la acción no existe");
  }
}

export function poblarFormulario(datos, formulario, modal) {
  Object.keys(datos).forEach((llave) => {
    const input = formulario.querySelector(`[name="${llave}"], #${llave}`);
    if (input) {
      input.value = datos[llave];
    } else {
      console.log(`Campo ${llave} no existe en el formulario`);
    }
  });
  manipularModal(modal, "show");
}

export function alertaGenerica(mensaje, contenedor) {
  contenedor.innerHTML = `
       <div class="alert alert-dark d-flex align-items-center justify-content-center text-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div style="text-align: center;">
                ${mensaje}
            </div>
        </div>
        `;
}

export function alertaTemporal(padre, mensaje, color) {
  const alert = document.createElement("div");
  alert.innerHTML = `
       <div class="alert alert-${color} d-flex align-items-center justify-content-center text-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div style="text-align: center;">
                ${mensaje}
            </div>
        </div>
        `;
  padre.appendChild(alert);
  setTimeout(() => {
    padre.removeChild(alert);
  }, 4000);
}

export function pedirConfirmacion(element){
  return confirm("¿Está seguro de que quiere eliminar " + element + "?")
}
