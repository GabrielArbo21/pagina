document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Revisamos si existe el perfil en el almacenamiento local
    const perfilGuardado = localStorage.getItem('yura_usuario_perfil');
    
    const seccionFormulario = document.getElementById('seccionFormulario');
    const seccionBloqueada = document.getElementById('seccionBloqueada');
    const inputCompania = document.getElementById('compania');

    if (!perfilGuardado) {
        // Si NO hay perfil: Ocultamos el formulario y mostramos el candado
        if (seccionFormulario) seccionFormulario.style.display = 'none';
        if (seccionBloqueada) seccionBloqueada.style.display = 'block';
    } else {
        // Si SÍ hay perfil: Mostramos el formulario y jalamos los datos
        if (seccionFormulario) seccionFormulario.style.display = 'block';
        if (seccionBloqueada) seccionBloqueada.style.display = 'none';

        try {
            // Convertimos el texto guardado a un objeto JavaScript
            const datosPerfil = JSON.parse(perfilGuardado);
            
            // Autocompletamos el campo de la empresa/nombre y lo bloqueamos
            if (inputCompania) {
                inputCompania.value = datosPerfil.nombre;
                inputCompania.readOnly = true; 
                inputCompania.style.backgroundColor = '#e7e5e4'; 
                inputCompania.style.color = '#78716c';
                inputCompania.style.cursor = 'not-allowed';
            }
        } catch(error) {
            // Si la sesión guardada tiene errores invisibles, la borra y recarga
            localStorage.removeItem('yura_usuario_perfil');
            location.reload();
        }
    }

    // 2. Lógica para guardar la cotización
    const formCotizacion = document.getElementById('formCotizacion');
    if (formCotizacion) {
        formCotizacion.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const datos = {
                compania: document.getElementById('compania').value,
                pais: document.getElementById('pais').value,
                tipoCacao: document.querySelector('input[name="tipoCacao"]:checked').value,
                toneladas: parseFloat(document.getElementById('toneladas').value)
            };
            
            localStorage.setItem('yura_pedido_simulado', JSON.stringify(datos));
            
            const alerta = document.getElementById('alertaExito');
            if(alerta) {
                alerta.classList.remove('hidden');
                setTimeout(() => alerta.classList.add('hidden'), 4000);
            }
        });
    }
});
