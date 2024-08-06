import {
  createImput,
  manipularModal,
  poblarFormulario,
  alertaGenerica,
  alertaTemporal,
  createSelect,
  pedirConfirmacion,
} from "../../js/utils/form.js";

import {
  deleteData,
  getData,
  getOneData,
  postData,
  updateData,
} from "../../repository/api.js";

export class EmployeeComponent extends HTMLElement {
  endPoint = "api/employees";
  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.oficinas = [];
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.tabla();
    this.alerta = document.querySelector(".alerta");
  }

  render() {
    this.innerHTML = /*html*/ `
          <div class="container " style="margin-top: 20px;">
          <div class="row padre">
              <div class="col-12 hija2 shadow p-3 mb-5 bg-body rounded">
              <div class="alerta"></div>
                <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                  Add employee
                </button>

                <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#filtroOficina">
                  Filtrar por Oficina
                </button>

                <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#filtroPedidoAsignado">
                  Filtrar por pedidos asignados
                </button>
                  <hr>
                  <table class="table table-bordered">
                  <thead>
                      <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Last name 1</th>
                      <th scope="col">Last name 2</th>
                      <th scope="col">Email</th>
                      <th scope="col">Office</th>
                      <th colspan="2"></th>
                      </tr>
                  </thead>
                  <tbody id="info-tabla">
                  </tbody>
                  </table>
                  <div class="contenedor">
                  </div>
              </div>
          </div>
          <!-- Button trigger modal -->  
          <!-- Modal -->
          <div class="modal fade" id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">New employee </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form  id="formGama">
                      </form>
                  </div>
              </div>
            </div>
          </div>

          <div class="modal fade " id="filtroOficina" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog ">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar empleados por oficina</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="gamaProducto">
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="filtroPedidoAsignado" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar empleados por pedidos asignados</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="stockProducto">
                </form>
              </div>
            </div>
          </div>
        </div>
          `;
  }

  // --------------------------- metodos ----------------------------------------------------
  // export function createImput(elementoPadre, iddinamico, tipo, nombre, subtexto, etiqueta, hidden)

  async llenarFormulario() {
    this.oficinas = await getData("api/offices");
    createImput(this.formulario, "", "text", "id", "", "input", true);

    createImput(this.formulario, "", "text", "firstName", "Name", "input");

    createImput(
      this.formulario,
      "",
      "text",
      "lastName1",
      "First last name",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "text",
      "lastName2",
      "Second last name",
      "input"
    );

    createImput(this.formulario, "", "email", "email", "Email", "input");

    const select = document.createElement("select");
    select.classList.add("form-select", "mb-3");
    select.setAttribute("id", "");
    select.setAttribute("name", "office_id");
    select.setAttribute("required", true);
    select.setAttribute("aria-label", "Default select example");

    // console.log(data)
    this.oficinas.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.address.city.name;
      select.appendChild(option);
    });

    this.formulario.appendChild(select);

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
      data.office = { id: parseInt(data.office_id) };
      console.log(data);
      if (data.id !== "") {
        const respuesta = await updateData(data, this.endPoint, data.id);
        console.log(respuesta.status);
      } else if (data.id === "") {
        data.id = parseInt(this.datos.data.length + 1);
        const respuesta = await postData(data, this.endPoint);
        console.log(respuesta.status);
      } else {
        console.log("Error metodo registrar");
      }
      manipularModal(this.modal, "hide");
      alertaTemporal(this.alerta, "Successful process", "success");
      this.tabla();
      this.formulario.reset();
    });
  }

  async tabla() {
    const contenedor = document.querySelector(".contenedor");
    this.datos = await getData(this.endPoint, "");
    if (this.datos.data.length === 0) {
      alertaGenerica("No registered", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.data.forEach((dato) => {
      const { email, firstName, id, lastName1, lastName2, office } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${firstName}</td>
                <td>${lastName1}</td>
                <td>${lastName2}</td>
                <td>${office.address.city.name}</td>
                <td class="text-center"><a href="#" "><i class='bx bx-pencil icon-actions editar' id="${id}"></i></a></td>
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
      } else if (e.target.classList.contains("eliminar")) {
        if (pedirConfirmacion("este empleado")) {
          await deleteData(id, this.endPoint);
          alertaTemporal(this.alerta, "Eliminado correctacmente", "info");
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
}
customElements.define("employee-component", EmployeeComponent);
