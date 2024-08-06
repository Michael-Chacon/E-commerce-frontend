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

export class CustomerComponent extends HTMLElement {
  endPoint = "api/customers";

  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.ciudades = [];
    this.empleados = [];
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
                  Add customer
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#filtroCiudad">
                  Filtrar por ciudad
                </button>
                <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#filtroPedidoPend">
                  Filtrar por pedidos pendientes
                </button>

                <button type="button" class="btn btn-outline-danger btn-sm">
                    Mostrar todo
                </button>
                
                  <hr>
                  <table class="table table-bordered">
                  <thead>
                      <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Last name </th>
                      <th scope="col">Email</th>
                      <th scope="col">City</th>
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
              <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div class="modal-content">
                  <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">New customer </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form id="formGama">
                        <div class="row">
                            <div class="col" id="n1"></div>
                            <div class="col" id="l1"></div>
                            <div class="col" id="l2"></div>
                        </div>
                        <hr>  
                        <div class="row">
                            <div class="col" id="em"></div>
                            <div class="col" id="tel"></div>
                        </div>
                        <div class="row">
                            <div class="col" id="d1"></div>
                            <div class="col" id="d2"></div>
                        </div>
                        <div class="row">
                            <div class="col" id="cc"></div>
                            <div class="col" id="ec"></div>
                        </div>
                        
                      </form>
                  </div>


              </div>
              </div>
          </div>
          <div class="modal fade " id="filtroCiudad" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog ">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Consultar clientes por ciudad</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="clienteCiudad">
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
    this.empleados = await getData("api/employees");
    this.ciudades = await getData("api/cities");
    createImput(this.formulario, "", "text", "id", "", "input", true);

    createImput(
      document.querySelector("#n1"),
      "",
      "text",
      "firstName",
      "Name",
      "input"
    );

    createImput(
      document.querySelector("#l1"),
      "",
      "text",
      "lastName1",
      "First last name",
      "input"
    );

    createImput(
      document.querySelector("#l2"),
      "",
      "text",
      "lastName2",
      "Second last name",
      "input"
    );

    createImput(
      document.querySelector("#em"),
      "",
      "email",
      "email",
      "Email",
      "input"
    );

    createImput(
      document.querySelector("#d1"),
      "",
      "text",
      "addressLine1",
      "Address 1",
      "input"
    );

    createImput(
      document.querySelector("#d2"),
      "",
      "text",
      "addressLine2",
      "Address 2",
      "input"
    );

    createSelect(
      document.querySelector("#cc"),
      "",
      "city",
      "nada",
      this.ciudades.data
    );

    createSelect(
      document.querySelector("#clienteCiudad"),
      "",
      "city",
      "",
      this.ciudades.data
    );

    createImput(
      document.querySelector("#tel"),
      "",
      "number",
      "number",
      "Telefon",
      "input"
    );

    const selectEmployee = document.createElement("div");
    selectEmployee.innerHTML = `
    <label for="exampleInputEmail1" class="form-label mt-3">Employees</label>
    <select class="form-select " name="salesRep" id="salesRep" required aria-label="Employees">
        <option>Seleccione el empleado</option>
    </select>
    `;
    document.querySelector("#ec").appendChild(selectEmployee);
    const padre = document.querySelector("#salesRep");
    this.empleados.data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.firstName} ${item.lastName1}`;
      padre.appendChild(option);
    });

    const botonCiudad = document.createElement("div");
    botonCiudad.innerHTML = `
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-outline-dark" id="btnEnviar">Enviar</button>
          </div>
        `;
    document.querySelector("#clienteCiudad").appendChild(botonCiudad);

    const botones = document.createElement("div");
    botones.innerHTML = `
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-outline-dark" id="btnRegistrar">Enviar</button>
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
      const information = {
        id: data.id,
        firstName: data.firstName,
        lastName1: data.lastName1,
        lastName2: data.lastName2,
        email: data.email,
        city: { id: parseInt(data.city) },
        address: {
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: { id: parseInt(data.city) },
        },
        salesRep: { id: parseInt(data.salesRep) },
      };
      console.log(information)
      if (data.id !== "") {
        const respuesta = await updateData(information, this.endPoint, data.id);
        console.log(respuesta);
      } else if (data.id === "") {
        const respuesta = await postData(information, this.endPoint);
        console.log(respuesta);
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
      alertaGenerica("No registered customer ", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.data.forEach((dato) => {
      const { email, firstName, id, lastName1, lastName2, city, number } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${firstName}</td>
                <td>${lastName1} ${lastName2}</td>
                <td>${email}</td>
                <td>${city.name}</td>
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
        if (pedirConfirmacion("este cliente")) {
          await deleteData(id, this.endPoint);
          alertaTemporal(this.alerta, "Eliminado correctacmente", "info");
          this.tabla();
        }
      } else {
        console.log("Este elemento no tiene la clase");
      }
    });
  }

  async buscarObjecto(ida) {
    const dato = await getOneData(ida, this.endPoint);
    console.log(dato);    
    const {
      id: id,
      address: {  
        addressLine1,
        addressLine2,
        city: { id: city, name: name }
      },
      id: officeId,
      email,
      firstName,
      lastName1,
      lastName2, 
    } = dato  ;

    const newObj = {
      officeId,
      addressLine1,
      addressLine2,
      id,
      name,
      email,
      firstName,
      lastName1,
      lastName2,
    };
    newObj.number = 1234
    newObj.city = dato.city.id
    newObj.salesRep = dato.salesRep.id
    console.log(newObj);
    return newObj;
  }
}
customElements.define("customer-component", CustomerComponent);
