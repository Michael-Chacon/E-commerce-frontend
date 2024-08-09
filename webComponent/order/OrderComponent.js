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

export class OrderComponent extends HTMLElement {
  endPoint = "api/nOrders";

  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.status = [];
    this.cliente = [];
    this.employees = [];
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.tablaFiltro();
    this.alerta = document.querySelector(".alerta");
  }

  render() {
    this.innerHTML = /*html*/ `
          <div class="container " style="margin-top: 20px;">
          <div class="row padre">
              <div class="col-12 hija2 shadow p-3 mb-5 bg-body rounded">
              <div class="alerta"></div>
                <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                  Add order
                </button>

                <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#filtroEstado">
                  Filtrar por estado
                </button>

                <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#filtroRangoFecha">
                  Filtrar por rango de fechas
                </button>

                <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#filtroPedidoAsignado">
                  Pedidos asignados a empleados
                </button>

                <button type="button" class="btn btn-outline-danger btn-sm" id="mostrarTodo">
                    Mostrar todo
                </button>

                  <hr>
                  <table class="table table-bordered">
                  <thead>
                      <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Status</th>
                      <th scope="col">Order date</th>
                      <th scope="col">Expected date</th>
                      <th scope="col">Delivery date</th>
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
          <!-- Modal -->
          <div class="modal fade" id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">New order</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form  id="formGama">
                      </form>
                  </div>
              </div>
              </div>
          </div>

          <div class="modal fade " id="filtroEstado" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog ">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar pedidos por estado</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="ordenStatus">
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="filtroRangoFecha" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar pedidos por rango de fecha</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="rangoFecha">
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="filtroPedidoAsignado" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar pedidos asignados a empleados</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="pedidosEmpleado">
                </form>
              </div>
            </div>
          </div>
        </div>
          `;
    // console.log(mainHtml)
  }

  // --------------------------- metodos ----------------------------------------------------
  // export function createImput(elementoPadre, iddinamico, tipo, nombre, subtexto, etiqueta, hidden)

  async llenarFormulario() {
    this.status = await getData("api/status");
    this.cliente = await getData("api/customers");
    this.employees = await getData("api/employees");
    createImput(this.formulario, "", "text", "id", "", "input", true);

    const selectCliente = document.createElement("div");
    selectCliente.innerHTML = `
    <label for="customerCodeOr" class="form-label mt-3">Cliente</label>
    <select class="form-select " name="customerCodeOr" id="customerCodeOr" required aria-label="Employees">
        <option>Cliente que paga</option>
    </select>
    `;
    this.formulario.appendChild(selectCliente);

    const padreCliente = document.querySelector("#customerCodeOr");
    this.cliente.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.firstName} ${item.lastName1}`;
      padreCliente.appendChild(option);
    });

    const selectEmpleado = document.createElement("div");
    selectEmpleado.innerHTML = `
    <label for="filtroEmpleado" class="form-label mt-3">Cliente</label>
    <select class="form-select " name="filtroEmpleado" id="filtroEmpleado" required aria-label="Employees">
        <option>Empleados</option>
    </select>
    `;
    document.querySelector("#pedidosEmpleado").appendChild(selectEmpleado);

    const padreFiltroEmpleado = document.querySelector("#filtroEmpleado");
    this.employees.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.firstName} ${item.lastName1}`;
      padreFiltroEmpleado.appendChild(option);
    });

    createImput(
      this.formulario,
      "",
      "date",
      "orderDate",
      "Order date",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "date",
      "expectedDate",
      "Expected date",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "date",
      "deliveryDate",
      "Delivery date",
      "input"
    );

    createImput(
      document.querySelector("#rangoFecha"),
      "",
      "date",
      "startDate",
      "Order date",
      "input"
    );

    createImput(
      document.querySelector("#rangoFecha"),
      "",
      "date",
      "endDate",
      "Order date",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "text",
      "comment",
      "Commente about order",
      "textarea"
    );

    const selectStatus = document.createElement("div");
    selectStatus.innerHTML = `
    <label for="statusCodeOr" class="form-label mt-3">Status</label>
    <select class="form-select " name="statusCodeOr" id="statusCodeOr" required aria-label="Employees">
        <option>Status</option>
    </select>
    `;
    this.formulario.appendChild(selectStatus);

    const padreStatus = document.querySelector("#statusCodeOr");
    this.status.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.statusName;
      padreStatus.appendChild(option);
    });

    const selectStatusfilter = document.createElement("div");
    selectStatusfilter.innerHTML = `
    <label for="filtroStatus" class="form-label mt-3">Status</label>
    <select class="form-select " name="filtroStatus" id="filtroStatus" required aria-label="Employees">
        <option>Status</option>
    </select>
    `;
    document.querySelector("#ordenStatus").appendChild(selectStatusfilter);

    const padreStfilter = document.querySelector("#filtroStatus");
    this.status.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.statusName;
      padreStfilter.appendChild(option);
    });

    const botones = document.createElement("div");
    botones.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Registrar</button>
            </div>
          `;
    this.formulario.appendChild(botones);

    const botonesEstado = document.createElement("div");
    botonesEstado.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="filtrarStatus">Filtrar</button>
            </div>
          `;
    document.querySelector("#ordenStatus").appendChild(botonesEstado);

    const botonesRangoFecha = document.createElement("div");
    botonesRangoFecha.innerHTML = `
            <div class="modal-footer fecha" id="btnfecha">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark enviar" id="">Enviar</button>
            </div>
          `;
    document.querySelector("#rangoFecha").appendChild(botonesRangoFecha);

    const botonesPedidoEmpleado = document.createElement("div");
    botonesPedidoEmpleado.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Enviar</button>
            </div>
          `;
    document
      .querySelector("#pedidosEmpleado")
      .appendChild(botonesPedidoEmpleado);
  }

  registrar() {
    this.formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);
      console.log(data);

      const order = {
        comment: data.comment,
        customerCodeOr: {
          id: parseInt(data.customerCodeOr),
        },
        deliveryDate: data.deliveryDate,
        expectedDate: data.expectedDate,
        id: data.id,
        orderDate: data.orderDate,
        statusCodeOr: {
          id: parseInt(data.statusCodeOr), // Asumiendo que `statusCodeOr` es un objeto con un ID
        },
      };
      console.log(order);

      if (data.id !== "") {
        const respuesta = await updateData(order, this.endPoint, data.id);
        console.log(respuesta.status);
      } else if (data.id === "") {
        const respuesta = await postData(order, this.endPoint);
        console.log(respuesta.status);
      } else {
        console.log("Error metodo registrar");
      }

      manipularModal(this.modal, "hide");
      alertaTemporal(this.alerta, "Successful process", "success");
      this.tablaFiltro();
      this.formulario.reset();
    });
  }

  async tablaFiltro() {
    const porFecha = document.querySelector("#rangoFecha");
    const info = await getData(this.endPoint, "");
    this.datos = info.data;

    const todo = document.querySelector("#mostrarTodo");
    todo.addEventListener("click", async (e) => {
      e.preventDefault();
      const info = await getData(this.endPoint, "");
      this.datos = info.data;
      this.tabla();
    });
    this.tabla();

    const filtroEstado = document.querySelector("#ordenStatus");

    filtroEstado.addEventListener("submit", async (e) => {
      e.preventDefault();
      const obj = this.getFormData(filtroEstado, "#filtroEstado");
      const filtro = await getData("api/nOrders/by-status/" + obj.filtroStatus);
      this.dto(filtro);
      this.tabla();
    });

    const filtrarPorFecha = document.querySelector("#rangoFecha");
    filtrarPorFecha.addEventListener("submit", async (e) => {
      e.preventDefault();
      const obj = this.getFormData(filtrarPorFecha, "#filtroRangoFecha");
      const filtro = await getData(
        `api/nOrders/by-range?startDate=${obj.startDate}&endDate=${obj.endDate}`
      );
      this.dto(filtro);
      this.tabla();
    });

    const filtrarPorEmpleado = document.querySelector("#pedidosEmpleado");
    filtrarPorEmpleado.addEventListener("submit", async (e) => {
      e.preventDefault();
      const obj = this.getFormData(filtrarPorEmpleado, "#filtroPedidoAsignado");
      const filtro = await getData(
        `api/nOrders/employee/${obj.filtroEmpleado}`
      );
      this.dto(filtro);
      this.tabla();
    });
  }

  getFormData(form, modal) {
    console.log("obtener form");
    const data = new FormData(form);
    const obj = Object.fromEntries(data);
    form.reset();
    manipularModal(document.querySelector(modal), "hide");
    return obj;
  }

  dto(data) {
    if (data.success && data.data.length != 0) {
      const convertedData = data.data.map((item) => {
        return {
          id: item[0],
          orderDate: item[1],
          expectedDate: item[2],
          deliveryDate: item[3],
          customerCodeOr: item[4],
          statusCodeOr: item[5],
        };
      });
      this.datos = convertedData;
    } else {
      alertaTemporal(this.alerta, "Order not found", "danger");
      this.datos = [];
    }
  }

  async tabla() {
    const contenedor = document.querySelector(".contenedor");
    // console.log(this.datos)
    if (this.datos.length === 0) {
      alertaGenerica("No registered", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.forEach((dato) => {
      const {
        customerCodeOr,
        statusCodeOr,
        deliveryDate,
        id,
        orderDate,
        expectedDate,
      } = dato;

      const statusColors = {
        Pending: "danger",
        Shipped: "info",
        Delivered: "success",
      };
      let color = statusColors[statusCodeOr.statusName] || "Secondary";

      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${customerCodeOr.firstName}</td>
                <td><span class="badge bg-${color}">${statusCodeOr.statusName}</span></td>
                <td>${orderDate}</td>
                <td>${expectedDate}</td>
                <td>${deliveryDate}</td>
                <td class="text-center"><a href="#" "><i class='bx bx-pencil icon-actions editar' id="${id}"></i></a></td>
                <td class="text-center"><i class='bx bx-trash-alt icon-actions eliminar' id="${id}"></i></td>
                <td class="text-center"><i class='bx bx-detail icon-actions redireccionar' id="${id}"></i></td>
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
        objeto.customerCodeOr = objeto.customerCodeOr.id;
        objeto.statusCodeOr = objeto.statusCodeOr.id;
        poblarFormulario(objeto, this.formulario, this.modal);
      } else if (e.target.classList.contains("eliminar")) {
        if (pedirConfirmacion("esta orden")) {
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
          this.tablaFiltro();
        }
      } else if (e.target.classList.contains("redireccionar")) {
        console.log("aja", id);
        const contenido = document.querySelector(".container");
        contenido.parentElement.parentElement.innerHTML = `<order-detail-component idOrder="${id}"></order-detail-component>`;
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
customElements.define("order-component", OrderComponent);
