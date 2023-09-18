import {
  campoRequerido,
  validarNumeros,
  validarURL,
  validarGeneral,
} from './validaciones.js';

//traigo los elementos que necesito del html
let campoCodigo = document.getElementById('codigo');
console.log(campoCodigo);
let campoProducto = document.getElementById('producto');
let campoDescripcion = document.getElementById('descripcion');
let campoCantidad = document.getElementById('cantidad');
let campoURL = document.getElementById('URL');

let formProductos = document.querySelector('#formProductos');

let productoExistente = false; //variable bandera: si productoExistente es false quiero crear,
//si es true quiero modificar el producto existente

//Asociar un evento a cada elemento obtenido

campoCodigo.addEventListener('blur', () => {
  console.log('desde codigo');
  campoRequerido(campoCodigo);
});

campoProducto.addEventListener('blur', () => {
  console.log('desde producto');
  campoRequerido(campoProducto);
});

campoDescripcion.addEventListener('blur', () => {
  console.log('desde descripcion');
  campoRequerido(campoDescripcion);
});

campoCantidad.addEventListener('blur', () => {
  console.log('desde cantidad');
  validarNumeros(campoCantidad);
});

campoURL.addEventListener('blur', () => {
  console.log('desde url');
  validarURL(campoURL);
});

formProductos.addEventListener('submit', guardarProducto);

//empiza la lógica del CRUD

function guardarProducto(e) {
  //para prevenir la actualización de la página
  e.preventDefault();

  //verificar que todos los datos sean validos
  if (
    validarGeneral(
      campoCodigo,
      campoProducto,
      campoDescripcion,
      campoCantidad,
      campoURL
    )
  ) {
    //console.log('los datos son correctos listo para enviar');
    if (!productoExistente) {
      //crear producto
      crearProducto();
    } else {
      //modicar producto
      modificarProducto();
    }
  }
}
