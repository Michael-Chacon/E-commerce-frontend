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
  if(!hidden){
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
  if(!hidden){
      element.setAttribute("required", true);
  }
  if(hidden){
    element.setAttribute("hidden", true)
  }

  if(!hidden){
      divPadre.appendChild(newLabel);
  }

  divPadre.appendChild(element);
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
