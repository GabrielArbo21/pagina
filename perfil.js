document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA DEL BOTÓN CERRAR SESIÓN (Siempre al inicio para evitar bloqueos)
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            localStorage.removeItem('yura_usuario_perfil');
            localStorage.removeItem('yura_pedido_simulado'); 
            location.reload();
        });
    }

    // 2. LÓGICA DE VISUALIZACIÓN DE PERFIL
    const perfilGuardado = localStorage.getItem('yura_usuario_perfil');
    const seccionCrear = document.getElementById('seccionCrearPerfil');
    const seccionVer = document.getElementById('seccionVerPerfil');

    if (perfilGuardado) {
        // Ocultar formulario, mostrar panel de usuario
        if (seccionCrear) seccionCrear.style.display = 'none';
        if (seccionVer) seccionVer.style.display = 'block';

        try {
            const datosPerfil = JSON.parse(perfilGuardado);
            document.getElementById('displayNombre').innerText = datosPerfil.nombre || 'Usuario';
            document.getElementById('displayCorreo').innerText = datosPerfil.correo || 'Sin correo';
            document.getElementById('displayId').innerText = datosPerfil.identificacion || 'Sin ID';
            document.getElementById('displayTipo').innerText = datosPerfil.tipoUsuario === 'empresa' ? 'Empresa / Comercializadora' : 'Cliente Ordinario';
        } catch(error) {
            console.error("Error al leer los datos del perfil", error);
        }

        // LÓGICA DE PEDIDOS (Protegida contra errores)
        const pedidoGuardado = localStorage.getItem('yura_pedido_simulado');
        const contenedorPedidos = document.getElementById('contenedorPedidos');
        
        if (pedidoGuardado) {
            try {
                const datosPedido = JSON.parse(pedidoGuardado);
                contenedorPedidos.innerHTML = `
                    <div style="background-color: #f5f5f4; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e7e5e4; border-left: 4px solid var(--color-secundario);">
                        <p style="margin-bottom: 0.5rem;"><strong>Estado:</strong> <span style="color: #d97706; font-weight: bold;">Pendiente de Cotización en Vivo</span></p>
                        <p style="margin-bottom: 0.25rem;"><strong>Variedad:</strong> ${datosPedido.tipoCacao}</p>
                        <p style="margin-bottom: 0.25rem;"><strong>Volumen:</strong> ${datosPedido.toneladas} TM</p>
                        <p><strong>Destino:</strong> ${datosPedido.pais.toUpperCase()}</p>
                    </div>
                `;
            } catch(error) {
                contenedorPedidos.innerHTML = '<p style="color: var(--color-texto-mutado); font-style: italic;">No tienes simulaciones de exportación pendientes.</p>';
            }
        } else {
            contenedorPedidos.innerHTML = '<p style="color: var(--color-texto-mutado); font-style: italic;">No tienes simulaciones de exportación pendientes.</p>';
        }

    } else {
        // Mostrar formulario, ocultar panel
        if (seccionCrear) seccionCrear.style.display = 'block';
        if (seccionVer) seccionVer.style.display = 'none';
    }

    // 3. LÓGICA DEL FORMULARIO DE REGISTRO
    const formPerfil = document.getElementById('formPerfil');
    const radiosUsuario = document.querySelectorAll('input[name="tipoUsuario"]');
    const lblNombre = document.getElementById('lblNombre');
    const nombreInput = document.getElementById('nombreInput');
    const lblIdentificacion = document.getElementById('lblIdentificacion');
    const identificacionInput = document.getElementById('identificacionInput');

    if(radiosUsuario) {
        radiosUsuario.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'empresa') {
                    lblNombre.innerText = 'Razón Social / Compañía';
                    nombreInput.placeholder = 'Ej. Chocolates del Pacífico S.A.';
                    lblIdentificacion.innerText = 'RUC / ID Comercial';
                    identificacionInput.placeholder = 'Ej. 13917XXXXX001';
                } else {
                    lblNombre.innerText = 'Nombre Completo';
                    nombreInput.placeholder = 'Ej. Juan Pérez';
                    lblIdentificacion.innerText = 'Cédula o Pasaporte';
                    identificacionInput.placeholder = 'Ej. 131XXXXXXX';
                }
            });
        });
    }

    if (formPerfil) {
        formPerfil.addEventListener('submit', function(e) {
            e.preventDefault();
            const perfilDatos = {
                tipoUsuario: document.querySelector('input[name="tipoUsuario"]:checked').value,
                nombre: nombreInput.value,
                identificacion: identificacionInput.value,
                correo: document.getElementById('correoPerfil').value
            };
            localStorage.setItem('yura_usuario_perfil', JSON.stringify(perfilDatos));
            location.reload();
        });
    }
});