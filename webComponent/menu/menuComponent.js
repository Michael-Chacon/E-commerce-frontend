export class MenuComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /*html*/ `
    <style rel="stylesheet">
        @import "/webComponent/menu/style.css";
    </style>
    <section id="sidebar">
    <a href="#" class="brand"><img class="logo1" src="../storage/images/logo-removebg-preview.png"><span>Vendo</span></a>
    <ul class="side-menu">
      <!-- <li>
        <a href="#" class="active"
          ><i class="bx bxs-dashboard icon"></i> Dashboard</a>
      </li> -->
      <li>
        <a href="#"
          ><i class='bx bx-package icon'></i> Productos
          <i class="bx bx-chevron-right icon-right"></i
        ></a>
        <ul class="side-dropdown">
          <li><a href="#" class="listaProductos">Listado</a></li>
          <li><a href="#" class="gama">Gama producto</a></li>
        </ul>
      </li>
      <li>
      <a href="#" class="listarClient"
        ><i class='bx bxs-user icon'></i> Clientes
      </a>
    </li>
      <li>
      <a href="#" class="listaPedidos"
        ><i class='bx bxs-shopping-bag-alt icon'></i> Pedidos
      </a>
    </li>
      <li>
      <a href="#"
        ><i class='bx bx-dollar icon'></i> Pagos
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="listaPagos">Listado</a></li>
        <li><a href="#" class="metodoPago">Metodos de pago</a></li>
      </ul>
    </li>
    <li>
      <a href="#" class="listaEmpleados"
        ><i class='bx bx-male-female icon'></i> Empleados
      </a>
    </li>
    <li>
      <a href="#" class="listaOfincinas"
        ><i class='bx bx-store-alt icon'></i> Oficinas
      </a>
    </li>
    <li>
      <a href="#">
      <i class='bx bxs-down-arrow-alt icon'></i> Más opciones
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="ciudad">Ciudad</a></li>
        <li><a href="#" class="status">Estado de un pedido</a></li>
      </ul>
    </li>

  </ul>
  </section>
  <section id="content">
    <!-- NAVBAR -->
    <nav>
      <i class="bx bx-menu toggle-sidebar"></i>
      <form action="#"></form>

      <span class="divider"></span>
      <div class="profile">
        <img
          src=""
          alt=""
        />
        <ul class="profile-link">
          <li>
            <a href="#"><i class="bx bxs-user-circle icon"></i> Profile</a>
          </li>
          <li>
            <a href="#"><i class="bx bxs-cog"></i> Settings</a>
          </li>
          <li>
            <a href="#"><i class="bx bxs-log-out-circle"></i> Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <!-- NAVBAR -->

    <!-- MAIN -->
    <main class="main">
      <h2 class="paginaInicial">Bienvenido a <span class="nombreEmpresa">Vendo</span>, los mejores productos del mercado <span class="tripleColor">colombiano</span></h2>
      <p class="contenidoPaginaInicial">Selecciona una de las opciones de nuestro menú lateral</p>
      <div class="img"><img class="imagen" src="../storage/images/logo-removebg-preview.png" alt="Logo"></div>
      
    </main>
    <!-- MAIN -->
  </section>
        `;

    const padre = document.querySelector(".side-menu");
    const main = document.querySelector(".main");
    // mainHtml(main);
    padre.addEventListener("click", (e) => {
      const option = e.target.classList[0];
      console.log(option);
      if (option === "gama") {
        main.innerHTML = `<gama-component></gama-component>`;
      } else if (option === "status") {
        main.innerHTML = `<status-component></status-component>`;
      } else if (option === "metodoPago") {
        main.innerHTML = `<payment-method-component></payment-method-component>`;
      } else if (option === "ciudad") {
        main.innerHTML = `<city-component></city-component>`;
      } else if (option === "listaOfincinas") {
        main.innerHTML = `<office-component></office-component>`;
      } else if (option === "listaEmpleados") {
        main.innerHTML = `<employee-component></employee-component>`;
      } else if (option === "listarClient") {
        main.innerHTML = `<customer-component></customer-component>`;
      } else if (option === "listaPagos") {
        main.innerHTML = `<payment-component></payment-component>`;
      } else if (option === "listaProductos") {
        main.innerHTML = `<product-component></product-component>`;
      } else if (option === "listaPedidos") {
        main.innerHTML = `<order-component></order-component>`;
      }
    });
  }
}

customElements.define("menu-component", MenuComponent);
