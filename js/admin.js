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

//si hay productos en localStorage quiero guardarlos en listaProductos, si no listaProductos sea un array vacio
let listaProductos =
  JSON.parse(localStorage.getItem('arrayProductosKey')) || [];

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

//Llamo a la función cargaInicial(): si tengo productos en el localStorage, los muestre en la tabla
cargaInicial();

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
  //invocar una función codigoUnico() ---> retornar un código único
  //const codUnico = codigoUnico()
  //el input código tienen q ser de solo lectura ---> agragar disable
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
  guardarLocalStorage();
  //mostrar cartel al usuario
  Swal.fire(
    'Producto creado!',
    'Su producto fue creado correctamente!',
    'success'
  );
  //cargar el producto a la tabla
  crearFila(productoNuevo);
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

function crearFila(producto) {
  let tablaProductos = document.querySelector('#tablaProductos');
  //usando el operador de asignación de adición vamos concatenar al contenido del tbody una fila

  tablaProductos.innerHTML += `<tr>
  <td scope="col">${producto.codigo}</td>
  <td scope="col">${producto.producto}</td>
  <td scope="col">${producto.descripcion}</td>
  <td scope="col">${producto.cantidad}</td>
  <td scope="col">${producto.url}</td>
  <td><button class="btn btn-warning mb-3" onclick="prepararEdicionProducto('${producto.codigo}')">Editar</button>
  <button class='btn btn-danger mb-3' onclick='borrarProducto("${producto.codigo}")'>Eliminar</button>
  </td>
</tr>`;
}

function cargaInicial() {
  if (listaProductos.length > 0) {
    //crear las filas
    //listaProductos.forEach((itemProducto)=> crearFila(itemProducto))
    listaProductos.map((itemProducto) => crearFila(itemProducto));
  }
}

/* 
como quiero invocar a la función desde html,  no puedo acceder a ella => la agrego como método de
el objeto global window, así este accesible a todos los documentos

function prepararEdicionProducto(){
  console.log('desde editar');
}
 */

window.prepararEdicionProducto = function (codigo) {
  console.log('desde editar');
  console.log(codigo);
  //buscar el procuto en el array de productos
  let productoBuscado = listaProductos.find(
    (itemProducto) => itemProducto.codigo === codigo
  );
  console.log(productoBuscado);

  //mostrar el producto en el formulario. No se debe de poder editar el código
  campoCodigo.value = productoBuscado.codigo;
  campoProducto.value = productoBuscado.producto;
  campoDescripcion.value = productoBuscado.descripcion;
  campoCantidad.value = productoBuscado.cantidad;
  campoURL.value = productoBuscado.url;

  //modificar la variable bandera productoExistente
  productoExistente = true;
};

function modificarProducto() {
  Swal.fire({
    title: 'Seguro que desea editar este producto?',
    text: 'Puede volver a editar este producto si lo desea!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('desde modificar');
      //encontrar la posiición del elemento que quiero modificar dentro de mi array de productos
      let indiceProducto = listaProductos.findIndex(
        (itemProducto) => itemProducto.codigo === campoCodigo.value
      );
      console.log(indiceProducto);
      //modificar los valores del elemento del array
      listaProductos[indiceProducto].producto = campoProducto.value;
      listaProductos[indiceProducto].descripcion = campoDescripcion.value;
      listaProductos[indiceProducto].cantidad = campoCantidad.value;
      listaProductos[indiceProducto].url = campoURL.value;

      //actualizar el localStorage
      guardarLocalStorage();
      //actualizar la tabla
      borrarTabla();
      cargaInicial();

      //mostrar cartel al usuario
      Swal.fire(
        'Producto modificado!',
        'Su producto fue modificado correctamente!',
        'success'
      );

      //limpiar el formulario y reseatear la variable bandera
      limpiarFormulario();
    }
  });
}

function borrarTabla() {
  let tablaProductos = document.querySelector('#tablaProductos');
  tablaProductos.innerHTML = '';
}

window.borrarProducto = function (codigo) {
  Swal.fire({
    title: 'Seguro que desea eliminar este producto?',
    text: 'La acción no podrá revertirse!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      //opcion 1: encontrar la posición o indice del elemento en el array y borrarlo
      //1ero: encontrar el indice con findIndex y usar splice(indiceEncontrado, 1)
      //opcion 2: usando filter
      let nuevaListaProductos = listaProductos.filter(
        (itemProducto) => itemProducto.codigo !== codigo
      );
      console.log(nuevaListaProductos);
      //actualizar el array original y localStorage
      listaProductos = nuevaListaProductos;
      guardarLocalStorage();

      //actualizar la tabla
      borrarTabla();
      cargaInicial();

      //mostrar cartel al usuario
      Swal.fire(
        'Producto eliminado!',
        'Su producto fue eliminado correctamente!',
        'success'
      );
    }
  });
};
