
document.addEventListener("DOMContentLoaded", () => {

  const res = document.getElementById("resultado");


  document.getElementById("ansiedadBtn").addEventListener("click", simuladorAnsiedad);
  document.getElementById("horasBtn").addEventListener("click", simuladorHoras);
  document.getElementById("independenciaBtn").addEventListener("click", simuladorIndependencia);


  const historialCompras = [];
});
  // FUNCION 1
  function simuladorAnsiedad() {
    const compras = []; 
    let totalGastado = 0;

    while (true) {
      let producto = prompt("¿Qué tan graves fueron hoy tus gastos hormiga? (Escribí 'fin' para terminar)").trim();

      if (!producto || producto.toLowerCase() === "fin") {
        break; 
      }

      if (producto === "") {
        alert("Ingresá un producto válido.");
        continue; 
      }

      if (compras.includes(producto)) {
        alert("Ya agregaste este producto!");
        continue;
      }

      let precio = parseFloat(prompt(`¿Cuánto te costó "${producto}"?`));

      if (isNaN(precio) || precio <= 0) {
        alert("Eso no parece un precio válido.");
        continue;
      }

      compras.push(producto);
      totalGastado += precio;
      historialCompras.push({ producto, precio }); // guardamos en historial global
    }

    let nivel;
    switch (true) {
      case totalGastado <= 5000:
        nivel = "Moderado";
        break;
      case totalGastado <= 15000:
        nivel = "Preocupante";
        break;
      default:
        nivel = "Grave";
    }

    const mensaje = `Gastaste $${totalGastado.toFixed(2)} en compras por ansiedad.\nNivel: ${nivel}.`;
    const resumen = compras.length > 0 ? `Productos: ${compras.join(", ")}` : "No se ingresaron productos.";


    document.getElementById("resultado").innerHTML = `${mensaje}<br>${resumen}`;
    alert(`${mensaje}\n${resumen}`);
    console.log("🛒 Compras:", historialCompras);
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
    ? "🫣 Es caro, pero posible si lo deseás mucho."
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
