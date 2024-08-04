import {
  createImput,
  manipularModal,
  poblarFormulario,
  alertaGenerica,
  alertaTemporal,
  createSelect,
} from "../../js/utils/form.js";

export class CustomerComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.ciudades = [
      { id: 1, name: "San Gil" },
      { id: 2, name: "Bogotá" },
      { id: 3, name: "Medellín" },
    ];
    this.empleados = [
      { id: 1, name: "Alexis" },
      { id: 2, name: "Maritza" },
      { id: 3, name: "Duvan" },
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
          <div class="row padre">
              <div class="col-12 hija2 shadow p-3 mb-5 bg-body rounded">
              <div class="alerta"></div>
              <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                  Add customer
                  </button>
                  <hr>
                  <table class="table table-bordered">
                  <thead>
                      <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Last name </th>
                      <th scope="col">Phone</th>
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
          `;
  }

  // --------------------------- metodos ----------------------------------------------------
  // export function createImput(elementoPadre, iddinamico, tipo, nombre, subtexto, etiqueta, hidden)

  llenarFormulario() {
    createImput(this.formulario, "", "text", "id", "", "input", true);

    createImput(
      document.querySelector("#n1"),
      "",
      "text",
      "first_name",
      "Name",
      "input"
    );

    createImput(
      document.querySelector("#l1"),
      "",
      "text",
      "last_name1",
      "First last name",
      "input"
    );

    createImput(
      document.querySelector("#l2"),
      "",
      "text",
      "last_name2",
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
      "address_line1",
      "Address 1",
      "input"
    );

    createImput(
      document.querySelector("#d2"),
      "",
      "text",
      "address_line2",
      "Address 2",
      "input"
    );

    createSelect(
      document.querySelector("#cc"),
      "",
      "city_code_d",
      "somebody to love",
      this.ciudades
    );

    createSelect(
      document.querySelector("#ec"),
      "",
      "sales_rep_employee_code",
      "somebody to love",
      this.empleados
    );

    createImput(
      document.querySelector("#tel"),
      "",
      "number",
      "number",
      "Telefon",
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
      alertaGenerica("No registered customer ", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.forEach((dato) => {
      const {
        email,
        first_name,
        id,
        last_name1,
        last_name2,
        city_code_d,
        number,
      } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
                <tr>
                <th scope="row">${id}</th>
                <td>${first_name}</td>
                <td>${last_name1} ${last_name2}</td>
                <td>${number}</td>
                <td>${email}</td>
                <td>${city_code_d}</td>
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
        d.first_name = data.first_name;
        d.last_name1 = data.last_name1;
        d.last_name2 = data.last_name2;
        d.email = data.email;
        d.number = data.number;
        d.city_code_d = data.city_code_d;
        d.address_line1 = data.address_line1;
        d.address_line2 = data.address_line2;
        d.sales_rep_employee_code = data.sales_rep_employee_code;
      }
    });
  }
}
customElements.define("customer-component", CustomerComponent);
