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

export class OrderDetailComponent extends HTMLElement {
  endPoint = "api/orderDetails";
  constructor() {
    super();
    this.idOrder = this.getAttribute("idOrder");
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.cliente = [];
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.tabla();
    this.alerta = document.querySelector(".alerta");
    this.llenarCards();
  }

  render() {
    this.innerHTML = /*html*/ `
          <div class="container " style="margin-top: 20px;">
          <div class="row">
          <div class="col"></div>
          <div class="col-8">
              <div class="row">
                <div class="col">
                  <div class="card shadow mb-4 mt-2 bg-white" >
                  <div class="card-body">
                    <h5 class="card-title text-center ">Order Details ${this.idOrder}</h5>
                    <table class="table table-hover">
                      <tbody>
                        <tr>
                          <th scope="row">Order date</th>
                          <td id="ordenado"></td>
                        </tr>
                        <tr>
                          <th scope="row">Status</th>
                          <td id="estado"></td>
                        </tr>
                        <tr>
                          <th scope="row">Delivery date</th>
                          <td id="entregado"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
                <div class="col">
                  <div class="card mb-4 mt-2 bg-dark" >
                    <div class="card-body">
                      <h5 class="card-title text-center text-white">Customer Details</h5>
                      <table class="table table-dark table-hover">
                        <tbody>
                          <tr>
                            <th scope="row">Name</th>
                            <td id="nombrec"></td>
                          </tr>
                          <tr>
                            <th scope="row">Emain</th>
                            <td id="emailc"></td>
                          </tr>
                          <tr>
                            <th scope="row">City</th>
                            <td id="ciudadc"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div class="col"></div>
        </div>
          <div class="row padre">
              <div class="col">
              </div>
              <div class="col-10 hija2 shadow p-3 mb-5 bg-body rounded">
              <div class="alerta"></div>
              <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                  Add product
                  </button>
                  <hr>
                  <table class="table table-bordered">
                  <thead>
                      <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Amoung</th>
                      <th scope="col">Unit price</th>
                      <th scope="col">Total</th>
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
              <div class="modal-dialog ">
              <div class="modal-content">
                  <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">New product</h5>
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

  // --------------------------- metodos ----------------------------------------------------
  // export function createImput(elementoPadre, iddinamico, tipo, nombre, subtexto, etiqueta, hidden)

  async llenarCards() {
    const pedido = await getOneData(this.idOrder, "api/nOrders");
    document.querySelector("#ordenado").textContent = pedido.orderDate;
    document.querySelector("#estado").textContent =
      pedido.statusCodeOr.statusName;
    document.querySelector("#entregado").textContent = pedido.deliveryDate;
    document.querySelector(
      "#nombrec"
    ).textContent = `${pedido.customerCodeOr.firstName} ${pedido.customerCodeOr.lastName1}`;
    document.querySelector("#emailc").textContent = pedido.customerCodeOr.email;
    document.querySelector("#ciudadc").textContent =
      pedido.customerCodeOr.city.name;
  }

  async llenarFormulario() {
    const productos = await getData("api/products");
    console.log(productos);
    createImput(this.formulario, "", "text", "id", "", "input", true);
    // createImput(
    //   this.formulario,
    //   this.idOrder,
    //   "text",
    //   "orderIdProduct",
    //   "",
    //   "input",
    //   true
    // );

    const selectProduc = document.createElement("div");
    selectProduc.innerHTML = `
    <label for="productIdOrder" class="form-label mt-3">Products</label>
    <select class="form-select " name="productIdOrder" id="productIdOrder" required aria-label="Employees">
        <option>Select the product</option>
    </select>
    `;
    this.formulario.appendChild(selectProduc);

    const padreProducto = document.querySelector("#productIdOrder");
    productos.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} - $${item.salePrice}`;
      padreProducto.appendChild(option);
    });

    createImput(
      this.formulario,
      "",
      "number",
      "quantity",
      "Amoung units",
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
  }

  registrar() {
    this.formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);
      console.log(data);
      const getProdut = await getOneData(data.productIdOrder, "api/products");
      console.log(getProdut);
      data.unitPrice = getProdut.salePrice;
      data.orderIdProduct = { id: parseInt(this.idOrder) };
      data.productIdOrder = { id: parseInt(data.productIdOrder) };
      console.log(data);
      if (data.id !== "") {
        const respuesta = await updateData(data, this.endPoint, data.id);
        console.log(respuesta.status);
      } else if (data.id === "") {
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
    console.log(this.datos.data);
    if (this.datos.length === 0) {
      alertaGenerica("No registered ", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    let contador = 0;
    this.datos.data.forEach((dato) => {
      const { productIdOrder, quantity, id } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${productIdOrder.name}</td>
                <td>${quantity}</td>
                <td>${productIdOrder.salePrice}</td>
                <td>${quantity * productIdOrder.salePrice}</td>
                <td class="text-center"><a href="#" "><i class='bx bx-pencil icon-actions editar' id="${id}"></i></a></td>
                <td class="text-center"><i class='bx bx-trash-alt icon-actions eliminar' id="${id}"></i></td>
              </tr>
            `;
            contador += quantity * productIdOrder.salePrice
    });

    cuerpoTabal.innerHTML += `<tr>
    <tr>
      <td colspan="4"></td>
      <th scope="row">Total</th>
      <td>${contador}</td>
    </tr>`
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
            quantity: objeto.quantity,
            productIdOrder: objeto.productIdOrder.id,
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

customElements.define("order-detail-component", OrderDetailComponent);
