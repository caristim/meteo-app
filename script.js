import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyDgePXZtE_U0tVkmlMBS7X3qMTpqSnHg94",

  authDomain: "meteo-app-c36b3.firebaseapp.com",

  projectId: "meteo-app-c36b3",

  storageBucket: "meteo-app-c36b3.firebasestorage.app",

  messagingSenderId: "96352586704",

  appId: "1:96352586704:web:cb8b3b4439c1a4230287d5"
};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

let grafica;

async function migrarDatosLocales() {

  const datosLocales =
    JSON.parse(
      localStorage.getItem(
        "historialMeteorologico"
      )
    ) || [];

  if (datosLocales.length === 0)
    return;

  const existentes =
    await getDocs(
      collection(db, "meteorologia")
    );

  if (!existentes.empty)
    return;

  for (const dato of datosLocales) {

    await addDoc(
      collection(db, "meteorologia"),
      dato
    );
  }

  alert(
    "✅ Datos locales migrados a Firebase correctamente"
  );
}

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

window.guardarDatos =
async function guardarDatos() {

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
    parseFloat(
      (vientoMS * 3.6).toFixed(1)
    );

  const ahora =
    new Date();

  const nuevaMedicion = {

    fecha:
      ahora.toLocaleDateString(),

    hora:
      ahora.toLocaleTimeString(),

    faseLunar:
      obtenerFaseLunar(),

    temperatura,

    humedad,

    vientoKMH,

    direccionViento,

    presion,

    lluvia,

    timestamp:
      Date.now()
  };

  await addDoc(
    collection(db, "meteorologia"),
    nuevaMedicion
  );

  limpiarCampos();

  cargarDatos();
};

function limpiarCampos() {

  document.getElementById("temperatura").value = "";

  document.getElementById("humedad").value = "";

  document.getElementById("viento").value = "";

  document.getElementById("presion").value = "";

  document.getElementById("lluvia").value = "";
}

async function cargarDatos() {

  const q =
    query(
      collection(db, "meteorologia"),
      orderBy("timestamp")
    );

  const querySnapshot =
    await getDocs(q);

  const historial = [];

  querySnapshot.forEach(doc => {

    historial.push(doc.data());
  });

  if (historial.length === 0)
    return;

  mostrarDatos(historial);

  generarGrafica(historial);

  mostrarHistorial(historial);

  generarPronostico(historial);
}

function generarPronostico(historial) {

  const datos =
    historial[historial.length - 1];

  let mensaje =
    "⛅ Tiempo relativamente estable.";

  if (
    datos.presion < 1005 &&
    datos.humedad > 85
  ) {

    mensaje =
      "🌧 Probabilidad alta de lluvias.";
  }

  if (
    datos.vientoKMH > 45
  ) {

    mensaje +=
      " 💨 Vientos fuertes.";
  }

  document.getElementById(
    "prediccion"
  ).innerHTML = `

    🌡 ${datos.temperatura} °C<br>

    💧 ${datos.humedad}%<br>

    💨 ${datos.vientoKMH} km/h<br>

    🧭 ${datos.direccionViento}<br>

    📉 ${datos.presion} hPa<br>

    🌧 ${datos.lluvia} mm<br><br>

    <strong>
      Pronóstico:
    </strong><br>

    ${mensaje}
  `;
}

function mostrarDatos(historial) {

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
}

function generarGrafica(historial) {

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
      }
    });
}

function mostrarHistorial(historial) {

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

await migrarDatosLocales();

cargarDatos();
