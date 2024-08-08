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

export class OfficeComponent extends HTMLElement {
  endPoint = "api/offices";

  constructor() {
    super();
    this.render();
    this.formulario = document.querySelector("#formGama");
    this.modal = document.querySelector("#modal");
    this.datos = [];
    this.ciudades = [];
    this.llenarFormulario();
    this.registrar();
    this.detectarId();
    this.tabla();
    this.alerta = document.querySelector(".alerta");
  }

  render() {
    this.innerHTML = `
        <div class="container " style="margin-top: 20px;">
        <div class="row padre">
            <div class="col">
            </div>
            <div class="col-10 hija2 shadow p-3 mb-5 bg-body rounded">
            <div class="alerta"></div>
            <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                Add office
                </button>
                <hr>
                <table class="table table-bordered">
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Id city</th>
                    <th scope="col">Address 1</th>
                    <th scope="col">Address 2</th>
                    <th scope="col">Tel</th>
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
        <!-- Button trigger modal -->  
        <!-- Modal -->
        <div class="modal fade" id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">New office </h5>
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

  async llenarFormulario() {
    this.ciudades = await getData("api/cities");
    createImput(this.formulario, "", "text", "id", "", "input", true);
    createImput(this.formulario, "", "text", "iddir", "", "input", true);

    createImput(
      this.formulario,
      "",
      "text",
      "addressLine1",
      "Address 1",
      "input"
    );

    createImput(
      this.formulario,
      "",
      "text",
      "addressLine2",
      "Address 2",
      "input"
    );

    createImput(this.formulario, "", "number", "number", "Phone", "input");

    createSelect(
      this.formulario,
      "",
      "city",
      "somebody to love",
      this.ciudades.data
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
      
      const obj = {
        id: data.id,
        address: {
          id: data.iddir,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: { id: parseInt(data.city) },
        },
        phones: [{ number: parseInt(data.number) }],
      };
      
      if (obj.id !== "") {
        const respuesta = await updateData(obj, this.endPoint, obj.id);
        console.log(respuesta.status);
      } else if (obj.id === "") {
        const respuesta = await postData(obj, this.endPoint);
        this.guardarTelefono(respuesta, data.number);
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

  async guardarTelefono(oficina, numero) {
    const obj = {
      officeCodePh: { id: oficina.data.id },
      number: parseInt(numero),
    };
    const telefon = await postData(obj, "api/phones");
    
  }

  async tabla() {
    const contenedor = document.querySelector(".contenedor");
    this.datos = await getData(this.endPoint, "");
    // console.log(this.datos.data);
    if (this.datos.data.length === 0) {
      alertaGenerica("No registered", contenedor);
    } else {
      contenedor.innerHTML = "";
    }
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.innerHTML = "";
    for (const dato of this.datos.data) {
      const { address, id } = dato;
      const n = await this.obtenerNumero(id);
      console.log(n)
      stop();
      let numero;
      if(n.number === null){
        numero = 888
      }
      numero = n.number;
      console.log(numero)
      cuerpoTabal.innerHTML += /*html*/ `
        <tr>
          <th scope="row">${id}</th>
          <td>${address.city.name}</td>
          <td>${address.addressLine1}</td>
          <td>${address.addressLine2}</td>
          <td>${numero}</td>
          <td class="text-center"><a href="#" "><i class='bx bx-pencil icon-actions editar' id="${id}"></i></a></td>
          <td class="text-center"><i class='bx bx-trash-alt icon-actions eliminar' id="${id}"></i></td>
        </tr>
      `;
    }
  }

  detectarId() {
    const cuerpoTabal = document.querySelector("#info-tabla");
    cuerpoTabal.addEventListener("click", async (e) => {
      e.preventDefault();
      const idOffice = e.target.id;
      if (e.target.classList.contains("editar")) {
        const objeto = await this.buscarObjecto(idOffice);

        console.log(objeto);
        objeto.x = objeto.address.city.id;
        objeto.iddir = objeto.address.id;
        const {
          id,
          address: { addressLine1, addressLine2 },
          x,
          iddir,
        } = objeto;

        const datosend = {
          id,
          addressLine1,
          addressLine2,
          iddir,
        };
        datosend.city = x;
        const numero = await this.obtenerNumero(id);
        datosend.number = numero.number;

        poblarFormulario(datosend, this.formulario, this.modal);
      } else if (e.target.classList.contains("eliminar")) {
        if (pedirConfirmacion("esta oficina")) {
          const getPhone = await this.obtenerNumero(e.target.id);
          await deleteData(getPhone.id, "api/phones");
          // setTimeout(async () => {
            await deleteData(idOffice, this.endPoint);
            alertaTemporal(this.alerta, "Eliminado correctacmente", "info");
            this.tabla();
          // }, 2000);
        }
      } else {
        console.log("Este elemento no tiene la clase");
      }
    });
  }

  async obtenerNumero(idOficina) {
    const telefono = await getOneData(idOficina, "api/phones");
    return telefono;
  }

  async buscarObjecto(id) {
    const dato = await getOneData(id, this.endPoint);
    return dato;
  }
}
customElements.define("office-component", OfficeComponent);
