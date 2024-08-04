export class MenuComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `
    <style rel="stylesheet">
        @import "/webComponent/menu/style.css";
    </style>
    <section id="sidebar">
    <a href="#" class="brand"><i class='bx bxs-dashboard icon'></i>E-commerce</a>
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
          <li><a href="#" class="eliminar">Bajo Stock</a></li>
          <li><a href="#" class="editar">Filtrar por gama</a></li>
        </ul>
      </li>
      <li>
      <a href="#"
        ><i class='bx bxs-user icon'></i> Clientes
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="listarClient">Listado</a></li>
        <li><a href="#" class="asignacion asignar">Por ciudad</a></li>
        <li><a href="#" class="asignacion retornar">Pedidos pendientes</a></li>
      </ul>
    </li>
      <li>
      <a href="#"
        ><i class='bx bxs-shopping-bag-alt icon'></i> Pedidos
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="persona agregar">Listado</a></li>
        <li><a href="#" class="persona editar">Por estado</a></li>
        <li><a href="#" class="persona eliminar">Por Rango de Fechas</a></li>
      </ul>
    </li>
      <li>
      <a href="#"
        ><i class='bx bx-dollar icon'></i> Pagos
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="listaPagos">Listado</a></li>
        <li><a href="#" class="metodoPago">Metodos de pago</a></li>
        <li><a href="#" class="estado editar">Filtro por cliente</a></li>
        <li><a href="#" class="estado eliminar">Filtro por método</a></li>
      </ul>
    </li>
    <li>
      <a href="#"
        ><i class='bx bx-male-female icon'></i> Empleados
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="listaEmpleados">Listado</a></li>
        <li><a href="#" class="marca editar">Por oficina</a></li>
        <li><a href="#" class="marca eliminar">Pedidos asignados</a></li>
      </ul>
    </li>
    <li>
      <a href="#"
        ><i class='bx bx-store-alt icon'></i> Oficinas
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="listaOfincinas">Listado</a></li>
        <li><a href="#" class="ubicacion editar">Editar</a></li>
        <li><a href="#" class="ubicacion eliminar">Eliminar</a></li>
      </ul>
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
      <h2 class="paginaInicial">Bienvenido al gestor de activos de CampusLands</h2>
      <p class="contenidoPaginaInicial">A continuación selecciona una de las opciones de nuestro menú</p>
    </main>
    <!-- MAIN -->
  </section>
        `;

    const padre = document.querySelector(".side-menu");
    const main = document.querySelector(".main");
    padre.addEventListener("click",  (e) => {
      const option = e.target.classList[0];
      console.log(option)
      if(option === 'gama'){
        main.innerHTML = `<gama-component></gama-component>`
      }else if(option === 'status'){
        main.innerHTML = `<status-component></status-component>`
      }else if(option === 'metodoPago'){
        main.innerHTML = `<payment-method-component></payment-method-component>`
      }else if(option === 'ciudad'){
        main.innerHTML = `<city-component></city-component>`
      }else if(option === 'listaOfincinas'){
        main.innerHTML = `<office-component></office-component>`
      }else if(option === 'listaEmpleados'){
        main.innerHTML = `<employee-component></employee-component>`
      }else if(option === 'listarClient'){
        main.innerHTML = `<customer-component></customer-component>`
      }else if(option === 'listaPagos'){
        main.innerHTML = `<payment-component></payment-component>`
      }else if(option === 'listaProductos'){
        main.innerHTML = `<product-component></product-component>`
      }
    })
  }
}

customElements.define("menu-component", MenuComponent);
