document.addEventListener('DOMContentLoaded', () => {
    conectarMercado();

    const btnLimpiar = document.getElementById('btnLimpiar');
    if(btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            localStorage.removeItem('yura_pedido_simulado');
            location.reload();
        });
    }
});

async function conectarMercado() {
    try {
        await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        
        // Precio ajustado a 6.036
        const valorMercadoCacao = 6036.00; 
        document.getElementById('precioApi').innerText = `$${valorMercadoCacao.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`;
        ejecutarCalculos(valorMercadoCacao);
        
    } catch (err) {
        console.warn("Error de red exterior, ejecutando datos de respaldo local.", err);
        const valorRespaldo = 6036.00;
        document.getElementById('precioApi').innerText = `$${valorRespaldo.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`;
        ejecutarCalculos(valorRespaldo);
    }
}

function ejecutarCalculos(precioMercado) {
    const jsonLocales = localStorage.getItem('yura_pedido_simulado');
    if (!jsonLocales) return;

    const datos = JSON.parse(jsonLocales);
    
    document.getElementById('datosLocalesContainer').innerHTML = `
        <div><span style="color: var(--color-texto-mutado); font-size: 0.8rem;">EMPRESA:</span><p style="font-weight: bold;">${datos.compania}</p></div>
        <div><span style="color: var(--color-texto-mutado); font-size: 0.8rem;">DESTINO:</span><p style="font-weight: bold; text-transform: uppercase;">${datos.pais}</p></div>
        <div><span style="color: var(--color-texto-mutado); font-size: 0.8rem;">VARIEDAD:</span><p style="font-weight: bold; color: var(--color-principal);">${datos.tipoCacao}</p></div>
        <div><span style="color: var(--color-texto-mutado); font-size: 0.8rem;">CANTIDAD:</span><p style="font-weight: bold;">${datos.toneladas} TM</p></div>
    `;

    document.getElementById('panelCalculos').style.display = 'block';

    const subtotalFruto = datos.toneladas * precioMercado;
    
    // Lógica para las 4 variedades
    let primaVariedad = 0;
    if (datos.tipoCacao === 'Nacional') {
        primaVariedad = subtotalFruto * 0.12; 
    } else if (datos.tipoCacao === 'Criollo') {
        primaVariedad = subtotalFruto * 0.25; 
    } else if (datos.tipoCacao === 'Trinitario') {
        primaVariedad = subtotalFruto * 0.08; 
    }
    
    let factorLogistico = 0.05; 
    if (datos.pais === 'deu') factorLogistico = 0.08; 
    if (datos.pais === 'jpn') factorLogistico = 0.12; 
    const fleteAduana = subtotalFruto * factorLogistico;

    const totalInversion = subtotalFruto + primaVariedad + fleteAduana;

    document.getElementById('calcBase').innerText = `$${subtotalFruto.toLocaleString('en-US')} USD`;
    document.getElementById('calcPrima').innerText = `$${primaVariedad.toLocaleString('en-US')} USD`;
    document.getElementById('calcLogistica').innerText = `$${fleteAduana.toLocaleString('en-US')} USD`;
    document.getElementById('calcTotal').innerText = `$${totalInversion.toLocaleString('en-US', {minimumFractionDigits: 2})} USD`;

    // Hacer visible el botón al final de los cálculos
    const botonEliminar = document.getElementById('btnLimpiar');
    if (botonEliminar) {
        botonEliminar.style.display = 'block';
    }
}