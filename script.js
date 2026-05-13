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
    temperatura,
    humedad,
    viento,
    presion,
    lluvia
  };

  let historial = JSON.parse(localStorage.getItem("historialMeteorologico")) || [];

  historial.push(nuevaMedicion);

  localStorage.setItem(
    "historialMeteorologico",
    JSON.stringify(historial)
  );

  mostrarDatos();
  generarGrafica();
}

function mostrarDatos() {

  const historial = JSON.parse(localStorage.getItem("historialMeteorologico")) || [];

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

  generarPronostico(datos);
}

function generarPronostico(datos) {

  let estado = "Estable";
  let icono = "⛅";

  if (datos.presion < 1005 && datos.humedad > 80) {
generarGrafica();
