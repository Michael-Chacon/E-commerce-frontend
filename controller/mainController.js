import "/webComponent/menu/MenuComponent.js";
import "/webComponent/gamaProducto/GamaComponent.js";
import "/webComponent/status/StatusComponent.js";
import "/webComponent/paymentMethod/PaymentMethodComponent.js";
import "/webComponent/city/CityComponent.js";
import "/webComponent/office/OfficeComponent.js";
import "/webComponent/employee/EmployeeComponent.js";
import "/webComponent/customer/CustomerComponent.js";
import "/webComponent/payment/PaymentComponent.js";
import "/webComponent/product/ProductComponent.js";
import "/webComponent/order/OrderComponent.js";
import "/webComponent/orderDetail/OrderDetailComponent.js";

import { login, getData } from "../../repository/api.js";

const formulario = document.querySelector("#formulario");
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const formData = new FormData(formulario);
  const objeto = Object.fromEntries(formData);
  const respuesta = await login(objeto);
  console.log(respuesta);
  if (respuesta.status === 200) {
    localStorage.removeItem("tokenJwt");
    localStorage.setItem("tokenJwt", respuesta.data.token);
    window.location.href = "main.html";
  } else {
    document.querySelector("#credencialesErroneas").textContent =
      respuesta.error.message;
      formulario.reset();
    setTimeout(() => {
      document.querySelector("#credencialesErroneas").textContent = "";
    }, 3000);

  }
});
