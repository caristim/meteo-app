let grafica;

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

  const nuevaMedicion = {

    fecha:
      new Date().toLocaleString(),

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

    <strong>Fecha:</strong>
    ${datos.fecha}<br>

    🌡 Temperatura:
    ${datos.temperatura} °C<br>

    💧 Humedad:
    ${datos.humedad}%<br>

    💨 Viento:
    ${datos.vientoMS} m/s
    (${datos.vientoKMH} km/h)<br>

    🧭 Dirección:
    ${datos.direccionViento}<br>

    📉 Presión:
    ${datos.presion} hPa<br>

    🌧 Lluvia:
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

  let frente = "";

  if (
    datos.presion < 1005 &&
    datos.humedad > 85
  ) {

    icono = "🌧";

    mensaje =
      "Alta probabilidad de lluvias o tormentas.";

    frente =
      "Se detecta inestabilidad atmosférica.";
  }

  if (
    datos.direccionViento === "S" &&
    datos.temperatura < 15
  ) {

    icono = "🌬";

    mensaje =
      "Ingreso probable de aire frío.";

    frente =
      "Posible frente frío desde el sur.";
  }

  if (
    datos.direccionViento === "NE" &&
    datos.humedad > 80
  ) {

    icono = "🌦";

    mensaje =
      "Ingreso de aire húmedo e inestable.";

    frente =
      "Probables lluvias aisladas.";
  }

  if (
    datos.direccionViento === "E" &&
    datos.humedad > 85
  ) {

    icono = "🌫";

    mensaje =
      "Ambiente muy húmedo.";

    frente =
      "Posible niebla o llovizna.";
  }

  if (
    datos.presion > 1015 &&
    datos.humedad < 70
  ) {

    icono = "☀️";

    mensaje =
      "Condiciones estables y secas.";

    frente =
      "Buen tiempo esperado.";
  }

  if (
    datos.vientoKMH > 40
  ) {

    icono = "💨";

    mensaje =
      "Vientos fuertes en aumento.";

    frente =
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
      ${frente}
    </p>

    <hr>

    <strong>
      Próximas 12 horas:
    </strong><br><br>

    🌡 Temperatura:
    ${datos.temperatura} °C<br>

    💨 Viento:
    ${datos.vientoKMH} km/h<br>

    🧭 Dirección:
    ${datos.direccionViento}<br>

    💧 Humedad:
    ${datos.humedad}%<br>

    📉 Presión:
    ${datos.presion} hPa
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
    historial.map(item => item.fecha);

  const temperaturas =
    historial.map(item => item.temperatura);

  const humedades =
    historial.map(item => item.humedad);

  const vientos =
    historial.map(item => item.vientoKMH);

  const presiones =
    historial.map(item => item.presion);

  const lluvias =
    historial.map(item => item.lluvia);

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

          <strong>
            ${item.fecha}
          </strong><br>

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
    "Fecha,Temperatura,Humedad,VientoKMH,Direccion,Presion,Lluvia\n";

  historial.forEach(item => {

    csv +=
      `${item.fecha},${item.temperatura},${item.humedad},${item.vientoKMH},${item.direccionViento},${item.presion},${item.lluvia}\n`;
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
