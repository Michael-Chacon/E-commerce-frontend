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

export class ProductComponent extends HTMLElement {
  endPoint = "api/products";
  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.filtroGama = document.querySelector("#gamaProducto");
    this.filtroStock = document.querySelector("#stockProducto");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.gama = [];
    this.filtro();
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.alerta = document.querySelector(".alerta");
  }

  render() {
    this.innerHTML = /*html*/ `
          <div class="container " style="margin-top: 20px;">
          <div class="row padre">
              <div class="col-12 hija2 shadow p-3 mb-5 bg-body rounded">
              <div class="alerta"></div>
                  <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                    Add product
                  </button>
            
                  <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#filtroGama">
                    Filtrar por gama
                  </button>

                  <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#filtroStock">
                    Filtrar por Bajo Stock
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
                      <th scope="col">Stock</th>
                      <th scope="col">Price</th>
                      <th scope="col">Gama</th>
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
                    <h5 class="modal-title" id="staticBackdropLabel">New product </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form  id="formGama">
                    </form>
                  </div>
              </div>
              </div>
          </div>
          <!-- Modal filtro por gama -->
        <div class="modal fade " id="filtroGama" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog ">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar productos por gama</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="gamaProducto">
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal filtro por bajo stock -->
        <div class="modal fade" id="filtroStock" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar productos con bajo stock</h5>
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
    this.gama = await getData("api/productRanges");
    console.log(this.gama.data);

    createSelect(this.filtroGama, "", "rangeCode", "", this.gama.data);

    createImput(
      this.filtroStock,
      "",
      "number",
      "stockQuantity",
      "Filtrar por esta cantidad",
      "input",
      false
    );

    createImput(this.formulario, "", "text", "id", "", "input", true);

    createImput(this.formulario, "", "text", "name", "Name", "input");

    createImput(
      this.formulario,
      "",
      "number",
      "stockQuantity",
      "Amount",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "number",
      "salePrice",
      "Second last name",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "text",
      "productDescription",
      "Description",
      "textarea"
    );

    createImput(
      this.formulario,
      "",
      "text",
      "dimensions",
      "Dimensions",
      "input"
    );

    // select range code
    const selectCliente = document.createElement("div");
    selectCliente.innerHTML = `
    <label for="rangeCode" class="form-label mt-3">rangeCode</label>
    <select class="form-select " name="rangeCode" id="rangeCode" required aria-label="Employees">

    </select>
    `;
    this.formulario.appendChild(selectCliente);

    const padreCliente = document.querySelector("#rangeCode");
    this.gama.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      padreCliente.appendChild(option);
    });

    const botones = document.createElement("div");
    botones.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" >Registrar</button>
            </div>
          `;

    const botonesGama = document.createElement("div");
    botonesGama.innerHTML = `
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Filtrar</button>
          </div>      
          `;
    const botonesstock = document.createElement("div");
    botonesstock.innerHTML = `
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Filtrar</button>
          </div>      
          `;

    this.filtroGama.appendChild(botonesGama);
    this.filtroStock.appendChild(botonesstock);
    this.formulario.appendChild(botones);
  }

  registrar() {
    this.formulario.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);

      console.log(data);
      data.rangeCode = { id: parseInt(data.rangeCode) };
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
      this.filtro();
      this.formulario.reset();
    });
  }

  async filtro() {
    const info = await getData(this.endPoint, "");
    this.datos = info.data;
    console.log(this.datos);
    this.tabla();

    const todo = document.querySelector("#mostrarTodo");
    todo.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const info = await getData(this.endPoint, "");
      this.datos = info.data;
      this.tabla();
    });

    // Filter for range code
    this.filtroGama.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const obj = this.getFormData(this.filtroGama, "#filtroGama");
      console.log("--------gama = " + obj.rangeCode);
      const filtro = await getData("api/products/by-range/" + obj.rangeCode);
      this.dto(filtro);
      this.tabla();
    });

    // Filter for amount in stock
    this.filtroStock.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const obj = this.getFormData(this.filtroStock, "#filtroStock");
      console.log("--------cantidad = " + obj.stockQuantity);
      const filtro = await getData(
        "api/products/by-low-stock/" + obj.stockQuantity
      );
      this.dto(filtro);
      this.tabla();
    });
  }

  getFormData(form, modal) {
    const data = new FormData(form);
    const obj = Object.fromEntries(data);
    form.reset();
    console.log(obj);
    manipularModal(document.querySelector(modal), "hide");
    return obj;
  }

  dto(data) {
    if (data.success && data.data.length != 0) {
      const convertedData = data.data.map((item) => {
        return {
          id: item[0],
          name: item[1],
          stockQuantity: item[2],
          salePrice: item[3],
          rangeCode: item[4],
          productDescription: item[5],
          dimensions: item[6],
        };
      });
      this.datos = convertedData;
    } else {
      alertaTemporal(this.alerta, "Order not found", "danger");
      this.datos = [];
    }
  }

  async tabla() {
    console.log("Hola desde tabla");
    const contenedor = document.querySelector(".contenedor");
    // this.datos = await getData(this.endPoint, "");
    if (this.datos.length === 0) {
      alertaGenerica("No registered status ", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.forEach((dato) => {
      const { name, stockQuantity, id, salePrice, rangeCode } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${name}</td>
                <td>${stockQuantity}</td>
                <td>$${salePrice}</td>
                <td>${rangeCode.name}</td>
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
        objeto.rangeCode = objeto.rangeCode.id;
        console.log(objeto);
        poblarFormulario(objeto, this.formulario, this.modal);
      } else if (e.target.classList.contains("eliminar")) {
        if (pedirConfirmacion("este producto")) {
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
customElements.define("product-component", ProductComponent);
