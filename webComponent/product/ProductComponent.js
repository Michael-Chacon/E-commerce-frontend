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
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.filtro();
    this.alerta = document.querySelector(".alerta");
  }

  render() {
    this.innerHTML = /*html*/`
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
    this.gama = await getData("api/productRanges")
    createSelect(this.filtroGama,"", "rangeCode", "", this.gama.data)
    createImput(this.filtroStock, "", "number", "stockQuantity", "Filtrar por esta cantidad", "input", false)

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

    const selectCliente = document.createElement("div");
    selectCliente.innerHTML = `
    <label for="rangeCode" class="form-label mt-3">rangeCode</label>
    <select class="form-select " name="rangeCode" id="rangeCode" required aria-label="Employees">
        <option>Gamas</option>
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
    // createSelect(this.formulario, "", "rangeCode", "Office code", this.gama.data);

    const botones = document.createElement("div");
    botones.innerHTML = `
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Registrar</button>
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

      const inputs = new FormData(this.formulario);
      const data = Object.fromEntries(inputs);
    
      console.log(data)
      data.rangeCode = {"id": parseInt(data.rangeCode)}
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

  async filtro(){
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

    const filtroPorGama = document.querySelector("#gamaProducto");
    filtroPorGama.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(filtroPorGama);
      const obj = Object.fromEntries(data);
      console.log(obj);
      filtroPorGama.reset();
      manipularModal(document.querySelector("#filtroGama"), "hide");
      const filtro = await getData("api/customers/by-city/" + obj.city);
      console.log(filtro.data);
      const convertedData = filtro.data.map((item) => {
        return {
          id: item[0],
          firstName: item[1],
          lastName1: item[2],
          lastName2: item[3],
          email: item[4],
          city: item[5],
          addressLine1: item[6].addressLine1,
          addressLine2: item[6].addressLine2,
          number: 1234,
          salesRep: item[7].id,
        };
      });
      console.log(convertedData);
      this.datos = convertedData;
      this.tabla();
    });
  }

  async tabla() {
    const contenedor = document.querySelector(".contenedor");
    this.datos = await getData(this.endPoint, "");
    if (this.datos.data.length === 0) {
      alertaGenerica("No registered status ", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.data.forEach((dato) => {
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
      const id = e.target.id;
      if (e.target.classList.contains("editar")) {
        const objeto = await this.buscarObjecto(id);
        objeto.rangeCode = objeto.rangeCode.id
        poblarFormulario(objeto, this.formulario, this.modal);
      } else if (e.target.classList.contains("eliminar")) {
        if (pedirConfirmacion("este producto")) {
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
customElements.define("product-component", ProductComponent);
