document.addEventListener('DOMContentLoaded', () => {
    const formCotizacion = document.getElementById('formCotizacion');
    
    if(formCotizacion) {
        formCotizacion.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const datos = {
                compania: document.getElementById('compania').value,
                pais: document.getElementById('pais').value,
                tipoCacao: document.querySelector('input[name="tipoCacao"]:checked').value,
                toneladas: parseFloat(document.getElementById('toneladas').value)
            };
            
            // Guardar el objeto en localStorage
            localStorage.setItem('yura_pedido_simulado', JSON.stringify(datos));
            
            // Mostrar alerta de éxito
            const alerta = document.getElementById('alertaExito');
            alerta.classList.remove('hidden');
            setTimeout(() => alerta.classList.add('hidden'), 4000);
        });
    }
});