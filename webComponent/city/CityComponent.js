import { createImput, manipularModal, poblarFormulario, alertaGenerica, alertaTemporal } from "../../js/utils/form.js";

export class CityComponent extends HTMLElement{
    constructor(){
        super();
        this.render();
        this.formulario = document.querySelector("#formGama");
        this.modal = document.querySelector("#modal");
        this.datos = [];
        this.llenarFormulario();
        this.registrar();
        this.detectarId();
        this.tabla();
        this.alerta = document.querySelector(".alerta")
    }

    render(){
        this.innerHTML = `
        <div class="container " style="margin-top: 20px;">
        <div class="row padre">
            <div class="col">
            </div>
            <div class="col-10 hija2 shadow p-3 mb-5 bg-body rounded">
            <div class="alerta"></div>
            <button type="button" class="btn btn-outline-dark"  data-bs-toggle="modal" data-bs-target="#modal">
                Add city 
                </button>
                <hr>
                <table class="table table-bordered">
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
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
                <h5 class="modal-title" id="staticBackdropLabel">New city </h5>
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
    
        createImput(
          this.formulario,
          "",
          "text",
          "name",
          "Madrid",
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
    
          if (data.id !== '') {
            this.actualizarData(data);
          } else if (data.id === '') {
            data.id = this.datos.length + 1;
            this.datos.push(data);
          } else {
            console.log("Error metodo registrar");
          }
          console.log(data)
          manipularModal(this.modal, "hide");
          alertaTemporal(this.alerta, "Successful process", 'success')
          this.tabla();
          this.formulario.reset();
        });
      }
    
    
      tabla() {
        const contenedor = document.querySelector(".contenedor")
        if(this.datos.length === 0){
          alertaGenerica('No registered',contenedor)
        }else{contenedor.innerHTML = ""}
        const cuerpoTabal = document.querySelector("#info-tabla");
        cuerpoTabal.innerHTML = "";
        this.datos.forEach((dato) => {
          const { name, id } = dato;
          cuerpoTabal.innerHTML += /*html*/ `
              <tr>
              <th scope="row">${id}</th>
              <td>${name}</td>
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
            d.name = data.name;
          }
        });
      }
}
customElements.define('city-component', CityComponent)