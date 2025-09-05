

class Compra {
  constructor(producto, precio, fecha = new Date()) {
    this.producto = String(producto).trim();
    this.precio = Number(precio);
    this.fecha = new Date(fecha).toISOString();
  }
}

const KEY_COMPRAS = "ef_compras";

function guardarCompras(arr) {
  localStorage.setItem(KEY_COMPRAS, JSON.stringify(arr));
}
function cargarCompras() {
  try { return JSON.parse(localStorage.getItem(KEY_COMPRAS)) || []; }
  catch (e) { return []; }
}

const historialCompras = cargarCompras();

const $ = (s) => document.querySelector(s);
function numeroAR(n) {
  return Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

// ===== Compras (DOM + storage) =====
function renderCompras() {
  const ul = document.getElementById("lista-compras");
  const totalEl = document.getElementById("total-compras");
  ul.innerHTML = "";

  let total = 0;
  historialCompras.forEach((c, idx) => {
    total += c.precio;

    const li = document.createElement("li");
    const izquierda = document.createElement("div");
    const derecha = document.createElement("div");

    const fecha = new Date(c.fecha || Date.now()).toLocaleDateString("es-AR");
    izquierda.innerHTML = `
      <strong>${c.producto}</strong> — ${numeroAR(c.precio)}
      <div class="meta" style="font-size:12px;opacity:.8">${fecha}</div>
    `;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "Eliminar";
    del.addEventListener("click", () => {
      historialCompras.splice(idx, 1);
      guardarCompras(historialCompras);
      renderCompras();
    });

    derecha.appendChild(del);
    li.appendChild(izquierda);
    li.appendChild(derecha);
    ul.appendChild(li);
  });

  totalEl.textContent = numeroAR(total);
}

// ===== Horas de vida =====
function onCalcularHoras(e) {
  e.preventDefault();

  const sueldo = parseFloat(document.getElementById("h-sueldo").value);
  const horasDia = parseFloat(document.getElementById("h-horasDia").value);
  const dias = parseInt(document.getElementById("h-dias").value);
  const precio = parseFloat(document.getElementById("h-precio").value);

  if ([sueldo, horasDia, dias, precio].some(v => isNaN(v) || v <= 0) || dias > 7) {
    document.getElementById("resultado-horas").innerHTML =
      "<p>Completá todos los campos correctamente.</p>";
    return;
  }

  const horasMensuales = horasDia * dias * 4;
  const valorHora = sueldo / horasMensuales;
  const horasNecesarias = precio / valorHora;

  const res = document.getElementById("resultado-horas");
  res.innerHTML = `
    <p>Trabajás aprox <strong>${horasMensuales}</strong> horas/mes.</p>
    <p>Necesitás <strong>${horasNecesarias.toFixed(2)}</strong> horas para comprarlo.</p>
  `;

  res.classList.remove("estado-ok", "estado-mid", "estado-bad");
  if (horasNecesarias > 40) {
    res.classList.add("estado-bad");
  } else if (horasNecesarias > 20) {
    res.classList.add("estado-mid");
  } else {
    res.classList.add("estado-ok");
  }
}

class GastoFijo {
  constructor(nombre, valor) {
    this.nombre = String(nombre).trim();
    this.valor = Number(valor);
  }
}

const KEY_GASTOS = "ef_gastos";

function guardarGastos(arr) {
  localStorage.setItem(KEY_GASTOS, JSON.stringify(arr));
}
function cargarGastos() {
  try { return JSON.parse(localStorage.getItem(KEY_GASTOS)) || []; }
  catch (e) { return []; }
}

let estadoGastos = cargarGastos();

function renderGastos() {
  const ul = document.getElementById("lista-gastos");
  if (!ul) return;
  ul.innerHTML = "";

  estadoGastos.forEach((g, idx) => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    const right = document.createElement("div");

    left.textContent = `${g.nombre}: ${numeroAR(g.valor)}`;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "Eliminar";
    del.addEventListener("click", () => {
      estadoGastos.splice(idx, 1);
      guardarGastos(estadoGastos);
      renderGastos();
    });

    right.appendChild(del);
    li.appendChild(left);
    li.appendChild(right);
    ul.appendChild(li);
  });
}

function onAgregarGasto() {
  const nombre = document.getElementById("g-nombre").value.trim();
  const valor = parseFloat(document.getElementById("g-valor").value);

  if (!nombre || isNaN(valor) || valor < 0) return;

  if (estadoGastos.some(g => g.nombre.toLowerCase() === nombre.toLowerCase())) {
    return;
  }

  estadoGastos.push(new GastoFijo(nombre, valor));
  guardarGastos(estadoGastos);

  document.getElementById("g-nombre").value = "";
  document.getElementById("g-valor").value = "";

  renderGastos();
}

function onLimpiarGastos() {
  if (!estadoGastos.length) return;
  if (confirm("¿Eliminar todos los gastos fijos?")) {
    estadoGastos = [];
    guardarGastos(estadoGastos);
    renderGastos();
  }
}

function onCalcularIndependencia() {
  const ingresos = parseFloat(document.getElementById("i-ingresos").value);
  const alquiler = parseFloat(document.getElementById("i-alquiler").value);

  const res = document.getElementById("resultado-independencia");
  if ([ingresos, alquiler].some(v => isNaN(v) || v < 0)) {
    res.innerHTML = "<p>Completá ingresos y alquiler correctamente.</p>";
    return;
  }

  const totalGastos = estadoGastos.reduce((acc, g) => acc + g.valor, 0) + alquiler;
  const dif = ingresos - totalGastos;

  let msg = "", clase = "estado-mid";
  if (ingresos > 0 && totalGastos === 0) {
    msg = "¿Vivís en el bosque? No declaraste gastos.";
    clase = "estado-mid";
  } else if (dif < 0) {
    msg = "No podés vivir sola/o: te faltan ingresos.";
    clase = "estado-bad";
  } else if (dif < 15000) {
    msg = "Podés vivir sola/o, pero MUY ajustada/o.";
    clase = "estado-mid";
  } else {
    msg = "Podés vivir sola/o con dignidad (y algún delivery).";
    clase = "estado-ok";
  }

  res.innerHTML = `
    <p><strong>Ingresos:</strong> ${numeroAR(ingresos)}</p>
    <p><strong>Total de gastos:</strong> ${numeroAR(totalGastos)}</p>
    <hr/>
    <p>${msg}</p>
  `;

  res.classList.remove("estado-ok", "estado-mid", "estado-bad");
  res.classList.add(clase);
}


function onAgregarCompra(e) {
  e.preventDefault();
  const prod = document.getElementById("compra-producto").value.trim();
  const prec = parseFloat(document.getElementById("compra-precio").value);

  if (!prod || isNaN(prec) || prec <= 0) return;

  historialCompras.push(new Compra(prod, prec));
  guardarCompras(historialCompras);

  e.target.reset();
  renderCompras();
}

function onVaciarCompras() {
  if (!historialCompras.length) return;
  if (confirm("¿Vaciar todas las compras?")) {
    historialCompras.length = 0;
    guardarCompras(historialCompras);
    renderCompras();
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const res = document.getElementById("resultado");
  document.getElementById("ansiedadBtn").addEventListener("click", simuladorAnsiedad);
  document.getElementById("horasBtn").addEventListener("click", simuladorHoras);
  document.getElementById("independenciaBtn").addEventListener("click", simuladorIndependencia);
  document.getElementById("historialBtn").addEventListener("click", verHistorial);
  document.getElementById("form-horas").addEventListener("submit", onCalcularHoras);

  renderCompras();
  document.getElementById("form-compra").addEventListener("submit", onAgregarCompra);
  document.getElementById("vaciar-compras").addEventListener("click", onVaciarCompras);


  renderGastos();
  const btnAgregarGasto = document.getElementById("agregar-gasto");
  if (btnAgregarGasto) btnAgregarGasto.addEventListener("click", onAgregarGasto);
  const btnLimpiarGastos = document.getElementById("limpiar-gastos");
  if (btnLimpiarGastos) btnLimpiarGastos.addEventListener("click", onLimpiarGastos);
  const btnCalcularInd = document.getElementById("calcular-independencia");
  if (btnCalcularInd) btnCalcularInd.addEventListener("click", onCalcularIndependencia);
});

// FUNCION 1
function simuladorAnsiedad() {
  const compras = [];
  let totalGastado = 0;

  while (true) {
    let producto = prompt("¿Qué tan graves fueron hoy tus gastos hormiga? (Escribí 'fin' para terminar)");
    if (!producto) break;
    producto = producto.trim();
    if (producto.toLowerCase() === "fin") break;
    if (!producto) continue;

    if (compras.includes(producto)) {
      continue;
    }

    let precio = parseFloat(prompt(`¿Cuánto te costó "${producto}"?`));
    if (isNaN(precio) || precio <= 0) {
      continue;
    }

    compras.push(producto);
    totalGastado += precio;

    historialCompras.push(new Compra(producto, precio));
  }

  guardarCompras(historialCompras);

  let nivel;
  switch (true) {
    case totalGastado <= 5000: nivel = "Moderado"; break;
    case totalGastado <= 15000: nivel = "Preocupante"; break;
    default: nivel = "Grave";
  }

  const mensaje = `Gastaste ${numeroAR(totalGastado)} en compras por ansiedad.<br> Nivel: <strong>${nivel}</strong>.`;
  const resumen = compras.length > 0 ? `Productos: ${compras.join(", ")}` : "No se ingresaron productos.";

  document.getElementById("resultado").innerHTML = `${mensaje}<br>${resumen}`;
}


// FUNCION 2
function simuladorHoras() {
  let sueldo, horasPorDia, diasPorSemana, precioDeseado;

  do {
    sueldo = parseFloat(prompt("¿Cuál es tu sueldo mensual?") ?? 0);
  } while (isNaN(sueldo) || sueldo <= 0);

  do {
    horasPorDia = parseFloat(prompt("¿Cuántas horas trabajás por día?") ?? 0);
  } while (isNaN(horasPorDia) || horasPorDia <= 0);

  do {
    diasPorSemana = parseInt(prompt("¿Cuántos días a la semana trabajás?") ?? 0);
  } while (isNaN(diasPorSemana) || diasPorSemana <= 0 || diasPorSemana > 7);

  do {
    precioDeseado = parseFloat(prompt("¿Cuánto cuesta lo que querés comprar?") ?? 0);
  } while (isNaN(precioDeseado) || precioDeseado <= 0);


  const horasMensuales = horasPorDia * diasPorSemana * 4;

  const calcularHoras = (precio, sueldo, horas) => {
    const valorHora = sueldo / horas;
    return precio / valorHora;
  };

  const horasNecesarias = calcularHoras(precioDeseado, sueldo, horasMensuales);

  const mensaje = horasNecesarias > 40
    ? "Eso te va a costar un buen pedazo de vida laboral."
    : horasNecesarias > 20
      ? "Es caro, pero posible si lo deseás mucho."
      : "Tranquilo, podés darte ese gusto sin culpa.";

  const textoFinal = `
    Trabajás aprox ${horasMensuales} horas al mes.<br>
    Necesitás trabajar aproximadamente <strong>${horasNecesarias.toFixed(2)} horas</strong> para comprar eso.<br>
    ${mensaje}
  `;

  document.getElementById("resultado").innerHTML = textoFinal;
  alert(mensaje);
  console.log("Horas mensuales:", horasMensuales, "Horas necesarias:", horasNecesarias);
}

// FUNCION 3
function simuladorIndependencia() {
  const gastosFijos = [];

  const pedirDato = function (texto) {
    let valor;
    do {
      valor = parseFloat(prompt(texto));
    } while (isNaN(valor) || valor < 0);
    return valor;
  };

  const sueldo = pedirDato("¿Cuánto ganás por mes?");
  const alquiler = pedirDato("¿Cuánto pagás de alquiler?");
  gastosFijos.push({ nombre: "alquiler", valor: alquiler });

  for (let i = 0; i < 3; i++) {
    let nombre = prompt("Ingresá un gasto fijo (ej: comida, servicios): (o escribí 'fin')");
    if (!nombre || nombre.toLowerCase() === "fin") break;

    if (gastosFijos.find(g => g.nombre === nombre)) {
      alert("Ese gasto ya fue ingresado. Evitá duplicarlo.");
      continue;
    }

    let valor = pedirDato(`¿Cuánto gastás en ${nombre}?`);
    gastosFijos.push({ nombre, valor });
  }

  const totalGastos = gastosFijos.reduce((acc, g) => acc + g.valor, 0);
  const diferencia = sueldo - totalGastos;

  let situacion = "";
  if (sueldo > 0 && totalGastos === 0) {
    situacion = "¿Vivís en el bosque? No declaraste gastos.";
  } else if (diferencia < 0) {
    situacion = "No podés vivir solo/a. Vas a terminar comiendo arroz todos los días.";
  } else if (diferencia >= 0 && diferencia < 15000) {
    situacion = "Podés vivir solo/a, pero vas a estar ajustado/a. Muy ajustado/a.";
  } else {
    situacion = "Estás en condiciones de vivir solo/a con dignidad y delivery ocasional.";
  }

  gastosFijos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  const detalles = gastosFijos.map(g => `${g.nombre}: $${g.valor}`).join("<br>");

  const resultadoHTML = `
      <p><strong>Ingresos:</strong> $${sueldo}</p>
      <p><strong>Total de gastos:</strong> $${totalGastos}</p>
      <p>${situacion}</p>
      <hr>
      <p><strong>Detalle de gastos:</strong><br>${detalles}</p>
    `;

  document.getElementById("resultado").innerHTML = resultadoHTML;
  alert(situacion);
  console.log("Independencia Económica:", { sueldo, gastosFijos, diferencia });
}

function verHistorial() {
  const res = document.getElementById("resultado");

  if (!historialCompras.length) {
    res.innerHTML = `<p>No hay compras registradas todavía.</p>`;
    return;
  }

  let total = 0;
  let html = `<h2>Historial de compras</h2><ul class="historial">`;

  historialCompras.forEach((item, idx) => {
    const fecha = new Date(item.fecha || Date.now()).toLocaleDateString("es-AR");
    html += `<li>${idx + 1}. <strong>${item.producto}</strong> — ${numeroAR(item.precio)} <small>(${fecha})</small></li>`;
    total += item.precio;
  });

  html += `</ul><p><strong>Total acumulado:</strong> ${numeroAR(total)}</p>`;
  res.innerHTML = html;
}

