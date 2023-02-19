// Variables
const formulario = document.querySelector('#formulario');
const listaTareas = document.querySelector('#lista-tareas');
let tareas;
const contenido = document.querySelector('#contenido');









// Event Listeners
eventListeners();


function eventListeners(){

    // Al cargar la página, la variable 'tareas' obtendrá el valor del item 'tareas' del localStorage, ese item es un array. Si el item tareas todavía no existe en el localStorage, la variable tareas será un array vacío. Luego, ejecuta la función crearHTML.
    document.addEventListener('DOMContentLoaded', () => {
        tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        crearHTML();
    }); 
 
    // Cuando el usuario da click en el botón de Agregar:
    formulario.addEventListener('submit', agregarTarea);
}










// Funciones

function agregarTarea(e){
// Registra lo que el usuario haya escrito en el textArea.
// Se ejecuta en el Listener de formulario (cuando el usuario da click en el botón de Agregar).

    // Previene la función por defecto del botón Submit.
    e.preventDefault();

    // Registrar lo que el usuario escribe en el textArea:
    const tarea = document.querySelector('#tarea').value.trim();

    // Si no hay nada escrito en el textArea, ejecuta la función mostrarError:
    if(!tarea){
        mostrarError('Una tarea no puede ir vacía');
        return;
    }

    // Si sí hay algo escrito en el textArea...
    // 1ro, si existe un aviso de Error, lo elimina:
    if(contenido.lastChild.textContent == 'Una tarea no puede ir vacía'){
        contenido.lastChild.remove(); 
    }
    // 2do, añade el texto escrito (con un id específico para diferenciarlo del resto de los textos) al array de tareas:
    const tareaObjeto = {
        id: Date.now(),
        tarea
    }
    tareas = [...tareas, tareaObjeto];
    // 3ro, ejecuta la función crearHTML:
    crearHTML();
    // 4to, elimina el contenido del textArea con el método reset():
    formulario.reset();
}




function mostrarError(texto) {
// Crea un aviso de Error si no existe otro aviso de Error previo.
// Se ejecuta si no se cumple la condición de la función agregarTarea.

    if(contenido.lastChild.textContent !== 'Una tarea no puede ir vacía'){
        const avisoError = document.createElement('div');
        avisoError.textContent = texto;
        avisoError.classList.add('error');

        contenido.appendChild(avisoError);
        setTimeout(() => {
            avisoError.remove(); 
        }, 3000);
    }
}




function crearHTML() {
// Crea e inserta en el HTML un listado de las tareas si el Array 'tareas' contiene algún elemento.
// Se ejecuta cada vez que se cargue la página (DOMContentLoaded) y en la función agregarTarea.

    limpiarHTML();

    if(tareas.length){
        // Cada elemento del Array 'tareas' es un tareaObjeto.
        tareas.forEach(elemento => {

            // Crear HTML:
            const li = document.createElement('li');         

            // Añadir el texto:
            li.innerText = elemento.tarea;   

            // Insertarlo en el HTML:
            listaTareas.appendChild(li);

            // Crear un botón de eliminar:
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tarea');
            btnEliminar.textContent = 'X';

            // Añadirle al btnEliminar la función de eliminar:
            btnEliminar.onclick = () => borrarTarea(elemento.id);

            // Insertar el botón en el HTML:
            li.appendChild(btnEliminar);
        });
    }

    // Por último, ejecuta la siguiente función para Actualiza el Array 'tareas' en el localStorage:
    sincronizarStorage();
}




function limpiarHTML() {
// Limpia el HTML para que no se repitan las tareas.
// Se ejecuta al inicio de la función crearHTML.

    while(listaTareas.firstChild){
        listaTareas.firstChild.remove();
    }
}




function borrarTarea(id) {
// El Array 'tareas' estará compuesto por los elementos que NO coincidan con el id del elemento que queremos 'eliminar' (tocando el botón de eliminar).
// Se ejecuta al hacer click en el botón de Eliminar (arrow function creada en crearHTML).

    tareas = tareas.filter(elemento => elemento.id !== id);

    // Ejecuta crearHTML porque debemos limpiar la lista y volverla a crear con el nuevo Array 'tareas' filtrado:
    crearHTML();
}





function sincronizarStorage() {
// Actualiza el Array 'tareas' en el localStorage.
// Se ejecuta al final de la función crearHTML.

    localStorage.setItem('tareas', JSON.stringify(tareas));
}