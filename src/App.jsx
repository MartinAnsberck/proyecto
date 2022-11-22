import './index.html';
import './App.css';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase.js";
              
              // Your web app's Firebase configuration
              const firebaseConfig = {
                apiKey: "AIzaSyBtchnIA656usy1d0vIDXsOdUEj0qnmIHo",
                authDomain: "proyecto-469a7.firebaseapp.com",
                projectId: "proyecto-469a7",
                storageBucket: "proyecto-469a7.appspot.com",
                messagingSenderId: "541390131828",
                appId: "1:541390131828:web:f8e212a275c4b873823721"
              };
            
              // Initialize Firebase
              const app = initializeApp(firebaseConfig);
              const db = firebase.database();
              coleccionProductos = db.ref().child('productos');
              bodyProductos = $('#bodyProductos').val();
            
              $('form').submit(function(e){
                e.preventDefault();
                let id = $('#id').val();
                let codigo = $('#codigo').val();
                let descripcion = $('#descripcion').val();
                let cantidad = $('#cantidad').val();

                let idFirebase = id;
                if (idFirebase == ''){
                    idFirebase =  coleccionProductos.push().key;
                };

                data = {codigo:codigo, descripcion: descripcion, cantidad: cantidad};

                actualizacionData = {};

                actualizacionData = [`/${idFirebase}`] = data;

                coleccionProductos.update(actualizacionData);
                id = ''; 
                $('form').trigger('reset');
                $('modalAltaEdicion').modal('hide');
              });

              const iconoEditar = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>'
              const iconoBorrar = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>'

              function mostrarProductos({codigo, descripcion, cantidad}){
                return `
                <td>${codigo}</td>
                <td>${description}</td>
                <td>${cantidad}</td>
                <td><button class="btnEditar btn btn-secondary" data-toggle="tooltip" title="Editar">${iconoEditar}</button><button class="btnBorrar btn btn-danger" data-toggle="tooltip" title="Borrar">${iconoBorrar}</button></td>
                `
              }

              //CHILD_ADDED
              coleccionProductos.on('child_added', data =>{
                let tr = document.createElement('tr')
                tr.id = data.key
                tr.innerHTML = mostrarProductos(data.val())
                document.getElementById('bodyProductos').appendChild(tr)
              });
              //CHILD_CHANGED
              coleccionProductos.on('child_changed', data =>{
                let nodoEditado = document.getElementById(data.key)
                nodoEditado.innerHTML = mostrarProductos(data.val())
              });
              //CHILD_REMOVED
              coleccionProductos.on('child_removed', data =>{
                let nodoEditado = document.getElementById(data.key)
                document.getElementById('bodyProductos').removeChild(nodoEditado)
              });

              //Programacion de botones
              $('#btnNuevo').click(function(){
                $('#id').val('');
                $('#codigo').val('');
                $('#descripcion').val('');
                $('#cantidad').val('');
                $('modalAltaEdicion').modal('show');
              });

              $('#tablaProductos').on('click', 'btnEditar', function(){
                let id = $(this).closest('tr').attr('id');
                let codigo = $(this).closest('tr').find('td:eq(0)').text();
                let descripcion = $(this).closest('tr').find('td:eq(1)').text();
                let cantidad = $(this).closest('tr').find('td:eq(2)').text();
                $('#id').val(id);
                $('#codigo').val(codigo);
                $('#descripcion').val(descripcion);
                $('#cantidad').val(cantidad);
                $('modalAltaEdicion').modal('show');
              });

              $('#tablaProductos').on('click', '.btnBorrar', function(){
                Swal.fire({
                    title: '¿Seguro que quiere borrar el producto?',
                    text: "Esta operacion no se puede cambiar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Borrar'
                }).then((result) => {
                    if (result.value) {
                        let id = $(this).closest('tr').attr('id'); //agarramos el atributo ID de la fila
                        db.ref(`productos/${id}`).remove() //eliminamos el prod de firebase
                        Swal.fire('Eliminado!', 'El producto se elimino.','success')
                    }
                })
              });
