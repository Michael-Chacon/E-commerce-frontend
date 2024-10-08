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
    this.filtro();
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

                <button type="button" class="btn btn-outline-danger btn-sm" id="mostrarTodo">
                    Mostrar todo
                </button>

                  <hr>
                  <table class="table table-bordered">
                  <thead>
                      <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Last name 1</th>
                      <th scope="col">Last name 2</th>
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
                <form id="empleadoOficina">
              
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

    //Select office
    const selectOficina = document.createElement("div");
    selectOficina.innerHTML = `
    <label for="office_id" class="form-label mt-3">Office</label>
    <select class="form-select " name="office_id" id="office_id" required aria-label="Employees">
    </select>
    `;
    this.formulario.appendChild(selectOficina);

    const padreCliente = document.querySelector("#office_id");
    this.oficinas.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.address.city.name;
      padreCliente.appendChild(option);
    });

    //Select office for filter
    const selectOficinaFilter = document.createElement("div");
    selectOficinaFilter.innerHTML = `
    <label for="filterOffice" class="form-label mt-3">Office</label>
    <select class="form-select " name="filterOffice" id="filterOffice" required aria-label="Employees">
    </select>
    `;
    document.querySelector("#empleadoOficina").appendChild(selectOficinaFilter);

    const selectFilter = document.querySelector("#filterOffice");
    this.oficinas.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.address.city.name;
      selectFilter.appendChild(option);
    });

    const botones = document.createElement("div");
    botones.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Registrar</button>
            </div>
          `;
    this.formulario.appendChild(botones);

    const botonesempleadoOficina = document.createElement("div");
    botonesempleadoOficina.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Enviar</button>
            </div>
          `;
    document
      .querySelector("#empleadoOficina")
      .appendChild(botonesempleadoOficina);
  }

  registrar() {
    this.formulario.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);
      data.office = { id: parseInt(data.office_id) };
      if (data.id !== "") {
        const respuesta = await updateData(data, this.endPoint, data.id);
      } else if (data.id === "") {
        const respuesta = await postData(data, this.endPoint);
      } else {
        console.log("Error metodo registrar");
      }
      manipularModal(this.modal, "hide");
      alertaTemporal(this.alerta, "Successful process", "success");
      this.filtro();
      this.formulario.reset();
    });
  }

  async filtro() {
    const info = await getData(this.endPoint, "");
    this.datos = info.data;

    const todo = document.querySelector("#mostrarTodo");
    todo.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const info = await getData(this.endPoint, "");
      this.datos = info.data;
      this.tabla();
    });
    this.tabla();

    // Filter by office
    const formCustomer = document.querySelector("#empleadoOficina");
    formCustomer.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const data = new FormData(formCustomer);
      const obj = Object.fromEntries(data);
      console.log(obj);
      formCustomer.reset();
      manipularModal(document.querySelector("#filtroOficina"), "hide");
      const filtro = await getData(
        "api/employees/by-office/" + obj.filterOffice
      );

      if (filtro.success && filtro.data.length != 0) {
        const convertedData = filtro.data.map((item) => {
          return {
            id: item[0],
            firstName: item[1],
            lastName1: item[2],
            lastName2: item[3],
            email: item[4],
            office: item[5],
          };
        });
        this.datos = convertedData;
      } else {
        alertaTemporal(this.alerta, filtro.error, "danger");
        this.datos = [];
      }

      this.tabla();
    });
  }

  async tabla() {
    const contenedor = document.querySelector(".contenedor");
    if (this.datos.length === 0) {
      alertaGenerica("No registered", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.forEach((dato) => {
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
      e.stopPropagation();
      e.stopImmediatePropagation();
      const id = e.target.id;
      if (e.target.classList.contains("editar")) {
        const objeto = await this.buscarObjecto(id);
        objeto.office_id = objeto.office.id;
        delete objeto.office;
        poblarFormulario(objeto, this.formulario, this.modal);
      } else if (e.target.classList.contains("eliminar")) {
        if (pedirConfirmacion("este empleado")) {
          const response = await deleteData(id, this.endPoint);
          if (response.success) {
            alertaTemporal(this.alerta, "Eliminado correctacmente", "info");
          } else {
            alertaTemporal(
              this.alerta,
              "No se puede borrar este elemento porque está relacionada con otros datos",
              "danger"
            );
          }
          this.filtro();
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
