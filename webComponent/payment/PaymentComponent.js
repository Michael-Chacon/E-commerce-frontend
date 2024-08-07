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

export class PaymentComponent extends HTMLElement {
  endPoint = "api/payments";

  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.metodo = [];
    this.cliente = [];
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
              <div class="col">
              </div>
              <div class="col-10 hija2 shadow p-3 mb-5 bg-body rounded">
              <div class="alerta"></div>
                <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                  Add payment
                </button>

                <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#filtroCliente">
                    Filtrar por cliente
                </button>

                <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#filtroMetodoPago">
                    Filtrar por método de pago
                </button>

                  <hr>
                  <table class="table table-bordered">
                  <thead>
                      <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Method</th>
                      <th scope="col">Date</th>
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
          <!-- Modal -->
          <div class="modal fade" id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">New payment</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form  id="formGama">
                      </form>
                  </div>
              </div>
              </div>
          </div>

          <div class="modal fade " id="filtroCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog ">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar pagos por cliente</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="pagoCliente">
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="filtroMetodoPago" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar pagos realizados</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="pagoMetodo">
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
    this.metodo = await getData("api/payment-methods");
    this.cliente = await getData("api/customers");

    const selectMetodo = document.createElement("div");
    selectMetodo.innerHTML = `
    <label for="exampleInputEmail1" class="form-label mt-3">Payment method</label>
    <select class="form-select " name="paymentMethod" id="paymentMethod" required aria-label="Employees">
        <option>Seleccione el metodo de pago</option>
    </select>
    `;
    this.formulario.appendChild(selectMetodo);

    const padreMetodo = document.querySelector("#paymentMethod");
    this.metodo.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.methodName;
      padreMetodo.appendChild(option);
    });

    const selectCliente = document.createElement("div");
    selectCliente.innerHTML = `
    <label for="customer" class="form-label mt-3">Customer</label>
    <select class="form-select " name="customer" id="customer" required aria-label="Employees">
        <option>Cliente que paga</option>
    </select>
    `;
    this.formulario.appendChild(selectCliente);

    const padreCliente = document.querySelector("#customer");
    this.cliente.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.firstName} ${item.lastName1}`;
      padreCliente.appendChild(option);
    });

    createImput(this.formulario, "", "text", "id", "", "input", true);

    // createSelect(
    //   this.formulario,
    //   "",
    //   "customer_code_pa",
    //   "customer",
    //   this.cliente.data
    // );

    // createSelect(this.formulario, "", "payment_method", "Metodo", this.metodo.data);

    createImput(
      this.formulario,
      "",
      "number",
      "total",
      "Total payment",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "date",
      "paymentDate",
      "Date of payment",
      "input"
    );

    const botones = document.createElement("div");
    botones.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Registrar</button>
            </div>
          `;
    this.formulario.appendChild(botones);

    const botonespagoCliente = document.createElement("div");
    botonespagoCliente.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Enviar</button>
            </div>
          `;
    document.querySelector("#pagoCliente").appendChild(botonespagoCliente);

    const botonesMetodoPago = document.createElement("div");
    botonesMetodoPago.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Enviar</button>
            </div>
          `;
    document.querySelector("#pagoMetodo").appendChild(botonesMetodoPago);
  }

  registrar() {
    this.formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);
      const obj = {
        paymentDate: data.paymentDate,
        paymentMethod: { id: parseInt(data.paymentMethod) }, // Representa la relación con paymentMethod
        total: 120000,
        customer: { id: parseInt(data.customer) }, // Representa la relación con customer
      };
      console.log(obj);
      if (data.id !== "") {
        const respuesta = await updateData(obj, this.endPoint, data.id);
        console.log(respuesta.status);
      } else if (data.id === "") {
        const respuesta = await postData(obj, this.endPoint);
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
    console.log(this.datos.data);
    if (this.datos.data.length === 0) {
      alertaGenerica("No registered payments ", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.data.forEach((dato) => {
      const { paymentDate, total, paymentMethod, id, customer } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${customer.firstName} ${customer.lastName1}</td>
                <td>${total}</td>
                <td>${paymentMethod.methodName}</td>
                <td>${paymentDate}</td>
                <td class="text-center"><a href="#"><i class='bx bx-pencil icon-actions editar' id="${id}"></i></a></td>
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
        console.log(objeto);
        const newObjs = {
            id: objeto.id,
            total: objeto.total,
            paymentDate: objeto.paymentDate,
            customer: objeto.customer.id,
            paymentMethod: objeto.paymentMethod.id,
        };
        console.log(newObjs);
        poblarFormulario(newObjs, this.formulario, this.modal);
      } else if (e.target.classList.contains("eliminar")) {
        if (pedirConfirmacion("este pago")) {
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
customElements.define("payment-component", PaymentComponent);
