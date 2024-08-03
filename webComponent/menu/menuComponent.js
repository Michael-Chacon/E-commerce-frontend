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
          <li><a href="#" class="agregar">Listado</a></li>
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
        <li><a href="#" class="asignacion crear">Listado</a></li>
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
        <li><a href="#" class="persona buscar">Buscar</a></li>
      </ul>
    </li>
      <li>
      <a href="#"
        ><i class='bx bx-dollar icon'></i> Pagos
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="estado agregar">Listado</a></li>
        <li><a href="#" class="estado buscar">Metodos de pago</a></li>
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
        <li><a href="#" class="marca agregar">Listado</a></li>
        <li><a href="#" class="marca editar">Por oficina</a></li>
        <li><a href="#" class="marca eliminar">Pedidos asignados</a></li>
        <li><a href="#" class="marca buscar">Buscar</a></li>
      </ul>
    </li>
    <li>
      <a href="#"
        ><i class='bx bx-store-alt icon'></i> Oficinas
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="ubicacion agregar">Listado</a></li>
        <li><a href="#" class="ubicacion editar">Editar</a></li>
        <li><a href="#" class="ubicacion eliminar">Eliminar</a></li>
        <li><a href="#" class="ubicacion buscar">Buscar</a></li>
      </ul>
    </li>
    <li>
      <a href="#">
      <i class='bx bxs-down-arrow-alt icon'></i> Más opciones
        <i class="bx bx-chevron-right icon-right"></i
      ></a>
      <ul class="side-dropdown">
        <li><a href="#" class="ubicacion agregar">Ciudad</a></li>
        <li><a href="#" class="ubicacion editar">Estado de un pedido</a></li>
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
          src="storage/imgs/logoCampus.png"
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
      }
    })
  }
}

customElements.define("menu-component", MenuComponent);
