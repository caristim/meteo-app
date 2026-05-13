let grafica;

function guardarDatos() {

  const temperatura = parseFloat(document.getElementById("temperatura").value);
  const humedad = parseFloat(document.getElementById("humedad").value);
  const viento = parseFloat(document.getElementById("viento").value);
  const presion = parseFloat(document.getElementById("presion").value);
  const lluvia = parseFloat(document.getElementById("lluvia").value);

  if (
    isNaN(temperatura) ||
    isNaN(humedad) ||
    isNaN(viento) ||
    isNaN(presion) ||
    isNaN(lluvia)
  ) {
    alert("Complete todos los campos");
    return;
  }

  const nuevaMedicion = {
    fecha: new Date().toLocaleString(),
    timestamp: Date.now(),
    temperatura,
    humedad,
    viento,
    presion,
    lluvia
  };

  let historial = JSON.parse(
    localStorage.getItem("historialMeteorologico")
  ) || [];

  historial.push(nuevaMedicion);

  localStorage.setItem(
    "historialMeteorologico",
    JSON.stringify(historial)
  );

  mostrarDatos();
  generarGrafica();
  mostrarHistorial();

  limpiarCampos();
}

function limpiarCampos() {

  document.getElementById("temperatura").value = "";
  document.getElementById("humedad").value = "";
  document.getElementById("viento").value = "";
  document.getElementById("presion").value = "";
  document.getElementById("lluvia").value = "";
}

function mostrarDatos() {

  const historial = JSON.parse(
    localStorage.getItem("historialMeteorologico")
  ) || [];

  if (historial.length === 0) {
    return;
  }

  const datos = historial[historial.length - 1];

  document.getElementById("datosActuales").innerHTML = `
    <strong>Fecha:</strong> ${datos.fecha}<br>
    <strong>Temperatura:</strong> ${datos.temperatura} °C<br>
    <strong>Humedad:</strong> ${datos.humedad}%<br>
    <strong>Viento:</strong> ${datos.viento} km/h<br>
    <strong>Presión:</strong> ${datos.presion} hPa<br>
    <strong>Lluvia:</strong> ${datos.lluvia} mm
  `;

  generarPronostico(historial);
}

function generarPronostico(historial) {

  const datos = historial[historial.length - 1];

  let mensaje = "";
  let icono = "⛅";

  let tendenciaPresion = "estable";
  let tendenciaTemperatura = "estable";
  let tendenciaHumedad = "estable";
  let tendenciaViento = "estable";

  if (historial.length >= 3) {

    const anterior = historial[historial.length - 2];
    const anterior2 = historial[historial.length - 3];

    const cambioPresion =
      datos.presion - anterior2.presion;

    const cambioTemp =
      datos.temperatura - anterior2.temperatura;

    const cambioHumedad =
      datos.humedad - anterior2.humedad;

    const cambioViento =
      datos.viento - anterior2.viento;

    if (cambioPresion <= -4) {
      tendenciaPresion = "bajando fuerte";
    }
    else if (cambioPresion < 0) {
      tendenciaPresion = "bajando";
    }
    else if (cambioPresion >= 4) {
      tendenciaPresion = "subiendo fuerte";
    }
    else if (cambioPresion > 0) {
      tendenciaPresion = "subiendo";
    }

    if (cambioTemp < -3) {
      tendenciaTemperatura = "descendiendo";
    }
    else if (cambioTemp > 3) {
      tendenciaTemperatura = "subiendo";
    }

    if (cambioHumedad > 10) {
      tendenciaHumedad = "aumentando";
    }
    else if (cambioHumedad < -10) {
      tendenciaHumedad = "disminuyendo";
    }

    if (cambioViento > 10) {
      tendenciaViento = "intensificándose";
    }

  }

  if (
    datos.presion < 1005 &&
    datos.humedad > 85 &&
    tendenciaPresion.includes("bajando")
  ) {

    icono = "🌧";

    mensaje = `
      Alta probabilidad de lluvias o tormentas en las próximas 12 horas.<br><br>

      La presión atmosférica está descendiendo y la humedad es elevada.<br><br>

      Se detecta inestabilidad atmosférica.
    `;
  }

  else if (
    datos.viento > 40 &&
    tendenciaViento === "intensificándose"
  ) {

    icono = "💨";

    mensaje = `
      Probables vientos fuertes durante las próximas horas.<br><br>

      El viento muestra una tendencia de intensificación.
    `;
  }

  else if (
    tendenciaPresion === "subiendo fuerte" &&
    datos.humedad < 70
  ) {

    icono = "☀️";

    mensaje = `
      Mejoría de las condiciones meteorológicas.<br><br>

      La presión atmosférica está aumentando y el aire es más seco.<br><br>

      Tiempo más estable esperado.
    `;
  }

  else if (
    tendenciaTemperatura === "descendiendo" &&
    datos.viento > 20
  ) {

    icono = "🌬";

    mensaje = `
      Posible ingreso de frente frío.<br><br>

      Se observa descenso térmico acompañado por viento moderado.
    `;
  }

  else if (
    datos.humedad > 92 &&
    datos.viento < 10
  ) {

    icono = "🌫";

    mensaje = `
      Posibilidad de niebla, lloviznas o baja visibilidad.<br><br>

      La humedad es extremadamente alta y el viento es débil.
    `;
  }

  else if (
    datos.temperatura > 30 &&
    datos.humedad < 60
  ) {

    icono = "☀️";

    mensaje = `
      Tiempo cálido y relativamente seco.<br><br>

      No se observan señales importantes de inestabilidad.
    `;
  }

  else {

    icono = "⛅";

    mensaje = `
      Condiciones relativamente estables para las próximas 12 horas.<br><br>

      No se detectan cambios atmosféricos significativos.
    `;
  }

  document.getElementById("prediccion").innerHTML = `
    <h3>${icono} Pronóstico meteorológico</h3>

    <p>${mensaje}</p>

    <hr>

    <strong>Tendencias detectadas:</strong><br><br>

    🌡 Temperatura: ${tendenciaTemperatura}<br>
    💧 Humedad: ${tendenciaHumedad}<br>
    🌪 Viento: ${tendenciaViento}<br>
    📉 Presión: ${tendenciaPresion}
  `;
}

function generarGrafica() {

  const historial = JSON.parse(
    localStorage.getItem("historialMeteorologico")
  ) || [];

  const etiquetas = historial.map(item => item.fecha);

  const temperaturas = historial.map(item => item.temperatura);
  const humedades = historial.map(item => item.humedad);
  const vientos = historial.map(item => item.viento);
  const presiones = historial.map(item => item.presion);
  const lluvias = historial.map(item => item.lluvia);

  const ctx = document
    .getElementById("grafica")
    .getContext("2d");

  if (grafica) {
    grafica.destroy();
  }

  grafica = new Chart(ctx, {

    type: 'line',

    data: {

      labels: etiquetas,

      datasets: [

        {
          label: 'Temperatura °C',
          data: temperaturas,
          borderWidth: 2
        },

        {
          label: 'Humedad %',
          data: humedades,
          borderWidth: 2
        },

        {
          label: 'Viento km/h',
          data: vientos,
          borderWidth: 2
        },

        {
          label: 'Presión hPa',
          data: presiones,
          borderWidth: 2
        },

        {
          label: 'Lluvia mm',
          data: lluvias,
          borderWidth: 2
        }

      ]
    },

    options: {

      responsive: true,

      interaction: {
        mode: 'index',
        intersect: false
      },

      plugins: {

        legend: {
          position: 'top'
        }
      },

      scales: {

        y: {
          beginAtZero: false
        }
      }
    }
  });
}

function mostrarHistorial() {

  const historial = JSON.parse(
    localStorage.getItem("historialMeteorologico")
  ) || [];

  let html = "";

  historial
    .slice()
    .reverse()
    .forEach(item => {

      html += `
        <div class="registro">

          <strong>${item.fecha}</strong><br>

          🌡 Temp: ${item.temperatura} °C |
          💧 Humedad: ${item.humedad}% |
          💨 Viento: ${item.viento} km/h |
          📉 Presión: ${item.presion} hPa |
          🌧 Lluvia: ${item.lluvia} mm

        </div>
      `;
    });

  document.getElementById("historial").innerHTML = html;
}

function exportarCSV() {

  const historial = JSON.parse(
    localStorage.getItem("historialMeteorologico")
  ) || [];

  if (historial.length === 0) {

    alert("No hay datos para exportar");

    return;
  }

  let csv =
    'Fecha,Temperatura,Humedad,Viento,Presion,Lluvia\n';

  historial.forEach(item => {

    csv +=
      `${item.fecha},${item.temperatura},${item.humedad},${item.viento},${item.presion},${item.lluvia}\n`;
  });

  const blob = new Blob(
    [csv],
    { type: 'text/csv' }
  );

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.setAttribute('href', url);

  a.setAttribute(
    'download',
    'datos_meteorologicos.csv'
  );

  a.click();
}

mostrarDatos();
generarGrafica();
mostrarHistorial();
