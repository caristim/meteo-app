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

    vientoKMH: parseFloat(vientoKMH),

    direccionViento,

    presion,

    lluvia,

    timestamp: Date.now()
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

function calcularTendencias(historial) {

  if (historial.length < 3) {

    return {
      tendenciaPresion: "estable",
      tendenciaTemp: "estable",
      tendenciaHumedad: "estable"
    };
  }

  const actual =
    historial[historial.length - 1];

  const anterior =
    historial[historial.length - 3];

  const deltaPresion =
    actual.presion - anterior.presion;

  const deltaTemp =
    actual.temperatura - anterior.temperatura;

  const deltaHumedad =
    actual.humedad - anterior.humedad;

  let tendenciaPresion = "estable";

  let tendenciaTemp = "estable";

  let tendenciaHumedad = "estable";

  if (deltaPresion <= -4)
    tendenciaPresion = "bajando fuerte";

  else if (deltaPresion < 0)
    tendenciaPresion = "bajando";

  else if (deltaPresion >= 4)
    tendenciaPresion = "subiendo fuerte";

  else if (deltaPresion > 0)
    tendenciaPresion = "subiendo";

  if (deltaTemp > 2)
    tendenciaTemp = "subiendo";

  else if (deltaTemp < -2)
    tendenciaTemp = "bajando";

  if (deltaHumedad > 10)
    tendenciaHumedad = "subiendo";

  else if (deltaHumedad < -10)
    tendenciaHumedad = "bajando";

  return {
    tendenciaPresion,
    tendenciaTemp,
    tendenciaHumedad
  };
}

function generarAlertas(datos, tendencias) {

  let alertas = [];

  if (
    datos.presion < 1005 &&
    datos.humedad > 85 &&
    tendencias.tendenciaPresion.includes("bajando")
  ) {

    alertas.push(
      "🔴 Alerta de lluvia o tormenta"
    );
  }

  if (
    datos.vientoKMH > 50
  ) {

    alertas.push(
      "💨 Alerta de viento fuerte"
    );
  }

  if (
    datos.temperatura > 34
  ) {

    alertas.push(
      "🌡 Alerta por calor intenso"
    );
  }

  if (
    datos.temperatura < 5
  ) {

    alertas.push(
      "❄ Riesgo de frío intenso"
    );
  }

  return alertas;
}

function clasificarTiempo(datos, tendencias) {

  if (
    datos.presion > 1015 &&
    datos.humedad < 70
  ) {

    return "☀️ Estable y seco";
  }

  if (
    datos.presion < 1005 &&
    datos.humedad > 85
  ) {

    return "🌧 Inestable y húmedo";
  }

  if (
    datos.direccionViento === "S" &&
    tendencias.tendenciaTemp === "bajando"
  ) {

    return "🌬 Frente frío probable";
  }

  if (
    datos.direccionViento === "NE" &&
    datos.humedad > 80
  ) {

    return "🌦 Aire húmedo e inestable";
  }

  if (
    datos.humedad > 92 &&
    datos.vientoKMH < 10
  ) {

    return "🌫 Posible niebla";
  }

  return "⛅ Tiempo relativamente estable";
}

function generarPronostico(historial) {

  const datos =
    historial[historial.length - 1];

  const tendencias =
    calcularTendencias(historial);

  const clasificacion =
    clasificarTiempo(
      datos,
      tendencias
    );

  const alertas =
    generarAlertas(
      datos,
      tendencias
    );

  let pronostico12h =
    "Sin cambios importantes.";

  let pronostico24h =
    "Condiciones relativamente estables.";

  if (
    tendencias.tendenciaPresion.includes("bajando")
  ) {

    pronostico12h =
      "Aumento de inestabilidad.";

    pronostico24h =
      "Probabilidad creciente de precipitaciones.";
  }

  if (
    tendencias.tendenciaPresion.includes("subiendo")
  ) {

    pronostico12h =
      "Mejoría gradual del tiempo.";

    pronostico24h =
      "Condiciones más estables y secas.";
  }

  if (
    datos.direccionViento === "S"
  ) {

    pronostico12h +=
      " Ingreso de aire más frío.";

    pronostico24h +=
      " Descenso térmico probable.";
  }

  if (
    datos.direccionViento === "NE"
  ) {

    pronostico12h +=
      " Ambiente húmedo.";

    pronostico24h +=
      " Posibles lluvias aisladas.";
  }

  let htmlAlertas = "";

  if (alertas.length > 0) {

    htmlAlertas =
      `
      <div class="alertas">

        <h3>⚠ Alertas meteorológicas</h3>

        ${alertas.map(
          a => `<p>${a}</p>`
        ).join("")}

      </div>
      `;
  }

  document.getElementById(
    "prediccion"
  ).innerHTML = `

    ${htmlAlertas}

    <h3>
      🤖 Asistente meteorológico local
    </h3>

    <p>

      <strong>
        Clasificación automática:
      </strong><br>

      ${clasificacion}

    </p>

    <hr>

    <strong>
      Pronóstico 12 horas
    </strong>

    <p>
      ${pronostico12h}
    </p>

    <strong>
      Pronóstico 24 horas
    </strong>

    <p>
      ${pronostico24h}
    </p>

    <hr>

    <strong>
      Tendencias atmosféricas
    </strong><br><br>

    📉 Presión:
    ${tendencias.tendenciaPresion}<br>

    🌡 Temperatura:
    ${tendencias.tendenciaTemp}<br>

    💧 Humedad:
    ${tendencias.tendenciaHumedad}<br><br>

    🌙 ${datos.faseLunar}<br>

    💨 ${datos.vientoKMH} km/h<br>

    🧭 ${datos.direccionViento}
  `;
}

function mostrarDatos() {

  const historial =
    JSON.parse(
      localStorage.getItem(
        "historialMeteorologico"
      )
    ) || [];

  if (historial.length === 0)
    return;

  const datos =
    historial[historial.length - 1];

  document.getElementById(
    "datosActuales"
  ).innerHTML = `

    📅 ${datos.fecha}<br>

    🕒 ${datos.hora}<br>

    🌙 ${datos.faseLunar}<br><br>

    🌡 ${datos.temperatura} °C<br>

    💧 ${datos.humedad}%<br>

    💨 ${datos.vientoKMH} km/h<br>

    🧭 ${datos.direccionViento}<br>

    📉 ${datos.presion} hPa<br>

    🌧 ${datos.lluvia} mm
  `;

  generarPronostico(historial);
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

  const ctx =
    document
      .getElementById("grafica")
      .getContext("2d");

  if (grafica)
    grafica.destroy();

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

          📅 ${item.fecha}

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
