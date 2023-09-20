import {
  campoRequerido,
  validarNumeros,
  validarURL,
  validarGeneral,
} from './validaciones.js';

import { Producto } from './productoClass.js';

//traigo los elementos que necesito del html
let campoCodigo = document.getElementById('codigo');
//console.log(campoCodigo);
let campoProducto = document.getElementById('producto');
let campoDescripcion = document.getElementById('descripcion');
let campoCantidad = document.getElementById('cantidad');
let campoURL = document.getElementById('URL');

let formProductos = document.querySelector('#formProductos');

let productoExistente = false; //variable bandera: si productoExistente es false quiero crear,
//si es true quiero modificar el producto existente

let listaProductos = [];

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

function crearProducto() {
  //crear un objeto producto
  let productoNuevo = new Producto(
    campoCodigo.value,
    campoProducto.value,
    campoDescripcion.value,
    campoCantidad.value,
    campoURL.value
  );

  console.log(productoNuevo);
  //guardar cada objeto (producto) en una array de productos
  listaProductos.push(productoNuevo);
  console.log(listaProductos);
  //limpiar formulario
  limpiarFormulario();
  //Guadar el array de productos dentro de localStorage
  guardarLocalStorage()
  //cargar el producto a la tabla
  crearFila(productoNuevo)
}

function limpiarFormulario() {
  //limpiamos los value del formulario
  formProductos.reset();
  //resetear las clases de los input
  campoCodigo.className = 'form-control';
  campoProducto.className = 'form-control';
  campoDescripcion.className = 'form-control';
  campoCantidad.className = 'form-control';
  campoURL.className = 'form-control';
  //resetar la variable bandera o booleana para el caso de modificarProducto
  productoExistente = false;
}

function guardarLocalStorage() {
  localStorage.setItem('arrayProductosKey', JSON.stringify(listaProductos));
}


function crearFila(producto){
  let tablaProductos = document.querySelector('#tablaProductos');
  //usando el operador de asignación de adición vamos concatenar al contenido del tbody una fila

  tablaProductos.innerHTML += `<tr>
  <td scope="col">${producto.codigo}</td>
  <td scope="col">${producto.producto}</td>
  <td scope="col">${producto.descripcion}</td>
  <td scope="col">${producto.cantidad}</td>
  <td scope="col">${producto.url}</td>
  <td><button class="btn btn-warning" onclick="prepararEdicionProducto()">Editar</button>
  <button class='btn btn-danger' onclick="borrarProducto()">Eliminar</button>
  </td>
</tr>`
}
