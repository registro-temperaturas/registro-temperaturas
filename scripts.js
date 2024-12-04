// Función para actualizar el reloj
function actualizarReloj() {
    const ahora = new Date();
    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const formatoFecha = ahora.toLocaleDateString('es-ES', opciones);
    document.getElementById('reloj').innerText = formatoFecha;
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

document.getElementById('descargarExcel').addEventListener('click', function() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const año = String(ahora.getFullYear());
    const hora = String(ahora.getHours()).padStart(2, '0');
    const minuto = String(ahora.getMinutes()).padStart(2, '0');
    const segundo = String(ahora.getSeconds()).padStart(2, '0');

    const fechaKey = `${dia}-${mes}-${año}`;
    const horaRegistro = `${hora}:${minuto}:${segundo}`;

    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Agregar fila de encabezados según el formato deseado
    ws_data.push(['', 'Hora', 'Parte A', 'Parte B', 'Parte C', 'Parte D']);

    for (let i = 1; i <= 4; i++) {
        const motorKey = `Motor ${i}`;
        const registro = {
            Motor: motorKey,
            Hora: horaRegistro,
            'Parte A': '',
            'Parte B': '',
            'Parte C': '',
            'Parte D': ''
        };

        for (let j = 1; j <= 4; j++) {
            const inputId = `motor${i}_parte${j}`;
            const temperatura = document.getElementById(inputId).value.trim();
            if (temperatura !== '') {
                const parteKey = `Parte ${String.fromCharCode(64 + j)}`;
                registro[parteKey] = parseFloat(temperatura);
            }
        }

        // Verificar si al menos una parte tiene temperatura
        const partesTemperatura = ['Parte A', 'Parte B', 'Parte C', 'Parte D'];
        const tieneTemperatura = partesTemperatura.some(parte => registro[parte] !== '');

        if (tieneTemperatura) {
            ws_data.push([
                registro.Motor,
                registro.Hora,
                registro['Parte A'] || '',
                registro['Parte B'] || '',
                registro['Parte C'] || '',
                registro['Parte D'] || ''
            ]);
        }
    }

    if (ws_data.length === 1) {
        alert('No se han ingresado temperaturas.');
        return;
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, fechaKey);

    // Generar el archivo Excel como un Blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Usar FileSaver.js para descargar el archivo
    saveAs(blob, `Registro_Temperaturas_${fechaKey}.xlsx`);

    // Opcional: Limpiar el formulario después de descargar
    //document.getElementById('formularioTemperaturas').reset();
});

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(function(error) {
                console.log('Error al registrar el Service Worker:', error);
            });
    });
}