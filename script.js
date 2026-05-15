let grafica;

function obtenerFaseLunar() {

  const hoy = new Date();

  const lp = 2551443;

  const nuevaLuna =
    new Date(1970, 0, 7, 20, 35, 0);

  const fase =
    ((hoy.getTime() - nuevaLuna.getTime()) / 1000) % lp;

  const dias =
    Math.floor(fase / (24 * 3600));

  if (dias < 2) return "🌑 Luna Nueva";

  if (dias < 7) return "🌒 Luna Creciente";

  if (dias < 10) return "🌓 Cuarto Creciente";

  if (dias < 15) return "🌔 Gibosa Creciente";

  if (dias < 18) return "🌕 Luna Llena";

  if (dias < 22) return "🌖 Gibosa Menguante";

  if (dias < 25) return "🌗 Cuarto Menguante";

  return "🌘 Luna Menguante";
}

function guardarDatos() {

  const temperatura =
    parseFloat(
      document.getElementById("temperatura").value
    );

  const humedad =
    parseFloat(
      document.getElementById("humedad").value
    );

  const vientoMS =
    parseFloat(
      document.getElementById("viento").value
    );

  const direccionViento =
    document.getElementById("direccionViento").value;

  const presion =
    parseFloat(
      document.getElementById("presion").value
    );

  const lluvia =
    parseFloat(
      document.getElementById("lluvia").value
    );

  if (
    isNaN(temperatura) ||
    isNaN(humedad) ||
    isNaN(vientoMS) ||
    isNaN(presion) ||
    isNaN(lluvia)
  ) {

    alert("Complete todos los campos");

    return;
  }

  const vientoKMH =
    (vientoMS * 3.6).toFixed(1);

  const ahora = new Date();

  const fecha =
    ahora.toLocaleDateString();

  const hora =
    ahora.toLocaleTimeString();

  const faseLunar =
    obtenerFaseLunar();

  const nuevaMedicion = {

    fecha,

    hora,

    faseLunar,

    temperatura,

    humedad,

    vientoMS,

    vientoKMH,

    direccionViento,

    presion,

    lluvia
  };

  let historial =
    JSON.parse(
      localStorage.getItem(
        "historialMeteorologico"
      )
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

  const historial =
    JSON.parse(
      localStorage.getItem(
        "historialMeteorologico"
      )
    ) || [];

  if (historial.length === 0) {

    return;
  }

  const datos =
    historial[historial.length - 1];

  document.getElementById(
    "datosActuales"
  ).innerHTML = `

    📅 <strong>Fecha:</strong>
    ${datos.fecha}<br>

    🕒 <strong>Hora:</strong>
    ${datos.hora}<br>

    🌙 <strong>Fase lunar:</strong>
    ${datos.faseLunar}<br><br>

    🌡 <strong>Temperatura:</strong>
    ${datos.temperatura} °C<br>

    💧 <strong>Humedad:</strong>
    ${datos.humedad}%<br>

    💨 <strong>Viento:</strong>
    ${datos.vientoKMH} km/h<br>

    🧭 <strong>Dirección:</strong>
    ${datos.direccionViento}<br>

    📉 <strong>Presión:</strong>
    ${datos.presion} hPa<br>

    🌧 <strong>Lluvia:</strong>
    ${datos.lluvia} mm
  `;

  generarPronostico(historial);
}

function generarPronostico(historial) {

  const datos =
    historial[historial.length - 1];

  let icono = "⛅";

  let mensaje =
    "Tiempo relativamente estable.";

  let detalle = "";

  if (
    datos.presion < 1005 &&
    datos.humedad > 85
  ) {

    icono = "🌧";

    mensaje =
      "Alta probabilidad de lluvias.";

    detalle =
      "La presión atmosférica es baja y la humedad elevada.";
  }

  if (
    datos.direccionViento === "S" &&
    datos.temperatura < 15
  ) {

    icono = "🌬";

    mensaje =
      "Ingreso probable de aire frío.";

    detalle =
      "Posible frente frío desde el sur.";
  }

  if (
    datos.direccionViento === "NE" &&
    datos.humedad > 80
  ) {

    icono = "🌦";

    mensaje =
      "Ingreso de aire húmedo.";

    detalle =
      "Probables lluvias aisladas.";
  }

  if (
    datos.direccionViento === "E" &&
    datos.humedad > 85
  ) {

    icono = "🌫";

    mensaje =
      "Ambiente muy húmedo.";

    detalle =
      "Posible niebla o llovizna.";
  }

  if (
    datos.presion > 1015 &&
    datos.humedad < 70
  ) {

    icono = "☀️";

    mensaje =
      "Condiciones estables.";

    detalle =
      "Buen tiempo esperado.";
  }

  if (
    datos.vientoKMH > 40
  ) {

    icono = "💨";

    mensaje =
      "Vientos fuertes.";

    detalle =
      "Posible cambio de masa de aire.";
  }

  document.getElementById(
    "prediccion"
  ).innerHTML = `

    <h3>
      ${icono}
      Pronóstico meteorológico
    </h3>

    <p>
      ${mensaje}
    </p>

    <p>
      ${detalle}
    </p>

    <hr>

    📅 ${datos.fecha}<br>

    🕒 ${datos.hora}<br>

    🌙 ${datos.faseLunar}<br><br>

    🌡 ${datos.temperatura} °C<br>

    💨 ${datos.vientoKMH} km/h<br>

    🧭 ${datos.direccionViento}<br>

    💧 ${datos.humedad}%<br>

    📉 ${datos.presion} hPa
  `;
}

function generarGrafica() {

  const historial =
    JSON.parse(
      localStorage.getItem(
        "historialMeteorologico"
      )
    ) || [];

  const etiquetas =
    historial.map(
      item => item.hora
    );

  const temperaturas =
    historial.map(
      item => item.temperatura
    );

  const humedades =
    historial.map(
      item => item.humedad
    );

  const vientos =
    historial.map(
      item => item.vientoKMH
    );

  const presiones =
    historial.map(
      item => item.presion
    );

  const lluvias =
    historial.map(
      item => item.lluvia
    );

  const ctx =
    document
      .getElementById("grafica")
      .getContext("2d");

  if (grafica) {

    grafica.destroy();
  }

  grafica =
    new Chart(ctx, {

      type: "line",

      data: {

        labels: etiquetas,

        datasets: [

          {
            label: "Temperatura °C",
            data: temperaturas,
            borderWidth: 2
          },

          {
            label: "Humedad %",
            data: humedades,
            borderWidth: 2
          },

          {
            label: "Viento km/h",
            data: vientos,
            borderWidth: 2
          },

          {
            label: "Presión hPa",
            data: presiones,
            borderWidth: 2
          },

          {
            label: "Lluvia mm",
            data: lluvias,
            borderWidth: 2
          }
        ]
      },

      options: {

        responsive: true,

        interaction: {

          mode: "index",

          intersect: false
        },

        plugins: {

          legend: {

            position: "top"
          }
        }
      }
    });
}

function mostrarHistorial() {

  const historial =
    JSON.parse(
      localStorage.getItem(
        "historialMeteorologico"
      )
    ) || [];

  let html = "";

  historial
    .slice()
    .reverse()
    .forEach(item => {

      html += `

        <div class="registro">

          📅 ${item.fecha} |

          🕒 ${item.hora}<br>

          🌙 ${item.faseLunar}<br><br>

          🌡 ${item.temperatura} °C |

          💧 ${item.humedad}% |

          💨 ${item.vientoKMH} km/h |

          🧭 ${item.direccionViento} |

          📉 ${item.presion} hPa |

          🌧 ${item.lluvia} mm

        </div>
      `;
    });

  document.getElementById(
    "historial"
  ).innerHTML = html;
}

function exportarCSV() {

  const historial =
    JSON.parse(
      localStorage.getItem(
        "historialMeteorologico"
      )
    ) || [];

  if (historial.length === 0) {

    alert(
      "No hay datos para exportar"
    );

    return;
  }

  let csv =
    "Fecha,Hora,FaseLunar,Temperatura,Humedad,VientoKMH,Direccion,Presion,Lluvia\n";

  historial.forEach(item => {

    csv +=
      `${item.fecha},${item.hora},${item.faseLunar},${item.temperatura},${item.humedad},${item.vientoKMH},${item.direccionViento},${item.presion},${item.lluvia}\n`;
  });

  const blob =
    new Blob(
      [csv],
      { type: "text/csv" }
    );

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.setAttribute("href", url);

  a.setAttribute(
    "download",
    "datos_meteorologicos.csv"
  );

  a.click();
}

mostrarDatos();

generarGrafica();

mostrarHistorial();
