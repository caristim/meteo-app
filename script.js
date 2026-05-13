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

  const historial = JSON.parse(localStorage.getItem("historialMeteorologico")) || [];
mostrarHistorial();
