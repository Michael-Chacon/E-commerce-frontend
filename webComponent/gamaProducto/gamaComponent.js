// root/webComponent/menu/menuComponent.js
import { createImput, manipularModal } from "../../js/utils/form.js";
export class MyElement extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modalGama");
    this.datos = [];
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    // this.actualizarData();
  }

  render() {
    this.innerHTML = `
      <div class="container " style="margin-top: 20px;">
        <div class="row padre">
          <div class="col hija1">
            1 of 3
          </div>
          <div class="col-8 hija2 shadow p-3 mb-5 bg-body rounded">
            <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modalGama">
                Crear gama de producto
              </button>
              <hr>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripcion</th>
                    <th colspan="2"></th>
                  </tr>
                </thead>
                <tbody id="info-tabla">
                </tbody>
              </table>
          </div>
          <div class="col hija3">
            3 of 3
          </div>
        </div>
        <!-- Button trigger modal -->  
        <!-- Modal -->
        <div class="modal fade" id="modalGama" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Nueva gama</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="#" id="formGama">
                    </form>
                </div>
            </div>
            </div>
        </div>
      `;
  }

  llenarFormulario() {
    createImput(this.formulario, "", "text", "id", "", "input", true);

    createImput(
      this.formulario,
      "",
      "text",
      "name",
      "Nombre de la gama",
      "input"
    );
    createImput(
      this.formulario,
      "",
      "text",
      "description",
      "Descripción detallada de la gama",
      "textarea"
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
      console.log(data)
      if (data.id !== '') {
        console.log("actaulizar");
        this.actualizarData(data);
      } else if (data.id === '') {
        console.log("registro");
        data.id = this.datos.length + 1;
        console.log(data);
        this.datos.push(data);
        console.log(this.datos);
      } else {
        console.log("no se que pasa");
      }
      
      manipularModal(this.modal, "hide");
      this.tabla();
      this.formulario.reset();
    });
  }

  tabla() {
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    this.datos.forEach((dato) => {
      const { name, description, id } = dato;
      cuerpoTabal.innerHTML += /*html*/ `
          <tr>
          <th scope="row">${id}</th>
          <td>${name}</td>
          <td>${description}</td>
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
        console.log(id);
        const objeto = this.buscarObjecto(id);
        this.poblarFormulario(objeto);
        console.log(objeto);
      } else {
        console.log("No hay evento");
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

  poblarFormulario(datos) {
    console.log(datos);
    Object.keys(datos).forEach((llave) => {
      const input = this.formulario.querySelector(
        `[name="${llave}"], #${llave}`
      );
      console.log(input);
      if (input) {
        input.value = datos[llave];
      } else {
        console.log(`Campo ${llave} no existe en el formulario`);
      }
    });

    manipularModal(this.modal, "show");
  }

  actualizarData(data) {
    this.datos.forEach((d) => {
      if (d.id == data.id) {
        d.name = data.name;
        d.description = data.description;
      }
    });
  }
} //fin de la clase

customElements.define("my-element", MyElement);
