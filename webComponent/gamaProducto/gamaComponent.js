// root/webComponent/menu/menuComponent.js

class MyElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      console.log('MyElement añadido al DOM');
    }
  
    disconnectedCallback() {
      console.log('MyElement eliminado del DOM');
    }
  
    render() {
      const container = document.createElement('div');
      const styleLink = document.createElement('link');
      const bootstrapScript = document.createElement('script');
  
      // Configura la etiqueta <link> para importar Bootstrap CSS
      styleLink.rel = 'stylesheet';
      styleLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';
  
      // Configura la etiqueta <script> para importar Bootstrap JavaScript
      bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js';
      bootstrapScript.defer = true;
  
      // Contenido del componente
      container.innerHTML = `
        <div class="container">
          <p class="text-primary">¡Hola, mundo!</p>
          <button type="button" class="btn btn-primary">Botón de Bootstrap</button>
        </div>
      `;
  
      // Asegúrate de limpiar el contenido del Shadow DOM antes de agregar nuevo contenido
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.append(styleLink, container, bootstrapScript);
    }
  }
  
  customElements.define('my-element', MyElement);
  