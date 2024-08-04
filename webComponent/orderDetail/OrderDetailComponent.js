import {
  createImput,
  manipularModal,
  poblarFormulario,
  alertaGenerica,
  alertaTemporal,
  createSelect,
} from "../../js/utils/form.js";

export class OrderDetailComponent extends HTMLElement {
  constructor() {
    super();
    this.idOrder = this.getAttribute("idOrder");
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.cliente = [
      { id: 1, name: "Teclado" },
      { id: 2, name: "Monitor" },
      { id: 3, name: "Desktop" },
    ];
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.tabla();
    this.alerta = document.querySelector(".alerta");
  }

  render() {
    this.innerHTML = /*html*/ `
          <div class="container " style="margin-top: 20px;">
          <div class="row">
          <div class="col"></div>
          <div class="col-8">
              <div class="row">
                <div class="col">
                  <div class="card mb-4 mt-2 bg-dark" >
                  <div class="card-body">
                    <h5 class="card-title text-center text-white">Order Details (id)</h5>
                    <table class="table table-dark table-hover">
                      <tbody>
                        <tr>
                          <th scope="row">Order date</th>
                          <td>10/10/2025</td>
                        </tr>
                        <tr>
                          <th scope="row">Status</th>
                          <td>Send</td>
                        </tr>
                        <tr>
                          <th scope="row">Delivery date</th>
                          <td>Send</td>
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
                            <td>Mark</td>
                          </tr>
                          <tr>
                            <th scope="row">Emain</th>
                            <td>alexis@gmail.com</td>
                          </tr>
                          <tr>
                            <th scope="row">Phone</th>
                            <td>1234567890</td>
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
              <div class="modal-dialog modal-sm">
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

  llenarFormulario() {
    createImput(this.formulario, "", "text", "id", "", "input", true);

    createSelect(
      this.formulario,
      "",
      "producto_id_order",
      "customer",
      this.cliente
    );

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
    this.formulario.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);

      if (data.id !== "") {
        this.actualizarData(data);
      } else if (data.id === "") {
        data.id = this.datos.length + 1;
        this.datos.push(data);
      } else {
        console.log("Error metodo registrar");
      }

      manipularModal(this.modal, "hide");
      alertaTemporal(this.alerta, "Successful process", "success");
      this.tabla();
      this.formulario.reset();
    });
  }

  tabla() {
    const contenedor = document.querySelector(".contenedor");
    if (this.datos.length === 0) {
      alertaGenerica("No registered ", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.forEach((dato) => {
      const { payment_date, total, payment_method, id, customer_code_pa } =
        dato;
      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${customer_code_pa}</td>
                <td>${total}</td>
                <td>${payment_method}</td>
                <td>${payment_date}</td>
                <td class="text-center"><a href="#" "><i class='bx bx-pencil icon-actions idHere' id="${id}"></i></a></td>
                <td class="text-center"><i class='bx bx-trash-alt icon-actions'></i></td>
              </tr>
            `;
    });
  }

  detectarId() {
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.addEventListener("click", (e) => {
      if (e.target.classList.contains("idHere")) {
        e.preventDefault();
        let id = e.target.id;
        const objeto = this.buscarObjecto(id);
        poblarFormulario(objeto, this.formulario, this.modal);
      } else {
        console.log("Este elemento no tiene la clase");
      }
    });
  }

  buscarObjecto(id) {
    let dato = "";
    this.datos.forEach((d) => {
      if (d.id == id) dato = d;
    });
    return dato;
  }

  actualizarData(data) {
    this.datos.forEach((d) => {
      if (d.id == data.id) {
        d.customer_code_pa = data.customer_code_pa;
        d.payment_date = data.payment_date;
        d.payment_method = data.payment_method;
        d.total = data.total;
      }
    });
  }
}

customElements.define("order-detail-component", OrderDetailComponent);
