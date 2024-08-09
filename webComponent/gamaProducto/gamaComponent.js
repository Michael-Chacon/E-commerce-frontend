import {
  createImput,
  manipularModal,
  poblarFormulario,
  alertaGenerica,
  alertaTemporal,
  pedirConfirmacion,
} from "../../js/utils/form.js";

import {
  deleteData,
  getData,
  getOneData,
  postData,
  updateData,
} from "../../repository/api.js";

export class GamaComponent extends HTMLElement {
  endPoint = "api/productRanges";
  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modalGama");
    this.datos = [];
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.tabla();
    this.alerta = document.querySelector(".alerta");
  }

  render() {
    this.innerHTML = `
      <div class="container " style="margin-top: 20px;">
        <div class="row padre">
          <div class="col">
          </div>
          <div class="col-10 hija2 shadow p-3 mb-5 bg-body rounded">
          <div class="alerta"></div>
            <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modalGama">
                Crear gama de producto
              </button>
              <hr>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripcion</th>
                    <th colspan="2"></th>
                  </tr>
                </thead>
                <tbody id="info-tabla">
                </tbody>
              </table>
              <div class="contenedor">
              </div>
          </div>
          <div class="col">
          </div>
        </div>
        <!-- Button trigger modal -->  
        <!-- Modal -->
        <div class="modal fade" id="modalGama" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Nueva gama</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form  id="formGama">
                    </form>
                </div>
            </div>
            </div>
        </div>
      `;
  }


  llenarFormulario() {
    createImput(this.formulario, "", "text", "id", "", "input", true);

    createImput(
      this.formulario,
      "",
      "text",
      "name",
      "Nombre de la gama",
      "input"
    );
    
    createImput(
      this.formulario,
      "",
      "text",
      "description",
      "Descripción detallada de la gama",
      "textarea"
    );

    const botones = document.createElement("div");
    botones.innerHTML = `
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Registrar</button>
      </div>
    `;
    this.formulario.appendChild(botones);
  }


  registrar() {
    this.formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);

      if (data.id !== "") {
        const respuesta = await updateData(data, this.endPoint, data.id);
      } else if (data.id === "") {
        const respuesta = await postData(data, this.endPoint);
      } else {
        console.log("Error al detectar el tipo de acción");
      }

      manipularModal(this.modal, "hide");
      alertaTemporal(
        this.alerta,
        "Procedimiento realizado con exito",
        "success"
      );
      this.tabla();
      this.formulario.reset();
    });
  }


  async tabla() {
    const contenedor = document.querySelector(".contenedor");
    this.datos = await getData(this.endPoint, "");

    if (this.datos.length === 0) {
      alertaGenerica("No hay gamas de producto registradas", contenedor);
    } else {
      contenedor.innerHTML = "";
    }

    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";

    this.datos.data.forEach((dato) => {
      const { name, description, id } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
          <tr>
          <th scope="row">${id}</th>
          <td>${name}</td>
          <td>${description}</td>
          <td class="text-center"><i class='bx bx-pencil icon-actions editar' id="${id}"></i></td>
          <td class="text-center"><i class='bx bx-trash-alt icon-actions eliminar' id="${id}"></i></td>
        </tr>
      `;
    });
  }


  detectarId() {
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = e.target.id;
      if (e.target.classList.contains("editar")) {
        const objeto = await this.buscarObjecto(id);
        poblarFormulario(objeto, this.formulario, this.modal);
      } else if(e.target.classList.contains("eliminar")){
        if(pedirConfirmacion("esta gama")){
          const response = await deleteData(id, this.endPoint)
          if (response.success) {
            alertaTemporal(this.alerta, "Eliminado correctacmente", "info");
          } else {
            alertaTemporal(
              this.alerta,
              "No se puede borrar este elemento porque está relacionada con otros datos",
              "danger"
            );
          }
          this.tabla();
        }
      } else {
        console.log("Este elemento no tiene la clase");
      }
    });
  }

  
  async buscarObjecto(id) {
    const dato = await getOneData(id, this.endPoint);
    return dato;
  }
} //fin de la clase

customElements.define("gama-component", GamaComponent);
