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
mostrarHistorial();
