const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');




window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    // Validamos Formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === ''){
        mostrarAlerta('Todos los campos son obligatorios', 'error');
    
        return;
    }

    // Consultamos la API
    consultarAPI(ciudad, pais);

    
}

function mostrarAlerta(mensaje, alerta) {
    const muestraMensaje = document.querySelector('.font-medium');

    if(!muestraMensaje) {
        const muestraMensaje = document.createElement('div');
        muestraMensaje.classList.add( 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'font-medium')
        
        if(alerta === 'error') {
                muestraMensaje.classList.add('bg-red-200', 'bg-red-100', 'border-red-800', 'text-red-700')

        } else {
                muestraMensaje.classList.add('bg-green-200', 'bg-green-100', 'border-green-800', 'text-green-700')
        }

        muestraMensaje.textContent = mensaje;
        container.appendChild(muestraMensaje);
        

        // Quitar el alert despues de 5 segundos
        setTimeout( () => {
            muestraMensaje.remove();
        }, 5000);
    }
}

function consultarAPI(ciudad, pais) {

    const appKey = '940bd0447c06bbbe66e9b93c6c47c3f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appKey}&lang=es`
    
    // Mostramos el Spinner en la espera
    Spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();  // Limpiamos el HTML
            if(datos.cod === "404") {
                mostrarAlerta('Ciudad NO encontrada', 'error');
                return;
            }

            // Mostrar datos en HTML
            mostrarClima(datos);
               
        })
}

function mostrarClima(datos) {

    const { name,  main: { temp, temp_max, temp_min, humidity }, weather : { 0: {icon, description} }} = datos;
    
    const centrigrados = KelvinCentigrados(temp);
    const max = KelvinCentigrados(temp_max);
    const min = KelvinCentigrados(temp_min);
    console.log(datos);
    
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = name;
    nombreCiudad.classList.add('font-bold', 'text-2xl', 'text-sky-900');
    
    const actual = document.createElement('div');
    actual.classList.add('flex', 'items-center', 'content-center', 'justify-center');
    const imagen = document.createElement('p');
    imagen.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@4x.png"></img>`;
    
    const temperatura = document.createElement('div');
    temperatura.innerHTML = `${centrigrados} &#8451`;
    temperatura.classList.add('flex-auto', 'font-bold', 'text-5xl', 'text-sky-900');
    
    const descripcion = document.createElement('p');
    descripcion.textContent = description.toUpperCase();
    descripcion.classList.add('font-bold', 'text-lg', 'text-center', 'text-sky-700');
    
    const tempMaxima = document.createElement('div');
    tempMaxima.innerHTML = `<b class='text-sky-700 border-y m-2 border-sky-600'>- ${min} &#8451  </b> <b class='text-red-700 border-y m-2 border-red-600'>+ ${max}&#8451</b> `;
    tempMaxima.classList.add('text-sm', 'm-1', 'text-center');
    
    const hum = document.createElement('p');
    hum.innerHTML = `Hum: &#128167; ${humidity} %`;
    hum.classList.add('text-sm', 'm-1', 'text-sky-900');

    
    // Mostramos en HTML
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');

    
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    actual.appendChild(imagen);
    actual.appendChild(temperatura);
    temperatura.appendChild(descripcion);
    temperatura.appendChild(tempMaxima);
    temperatura.appendChild(hum);
    

    resultado.appendChild(resultadoDiv);

    
}


const KelvinCentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(divSpinner);


}
