// ✅ Datos del usuario
const nombre = prompt("¡Hola! ¿Cómo te llamás?");
let edad = parseInt(prompt("¿Cuántos años tenés?"));
const esMayor = edad >= 18;

console.log(`Bienvenida/o ${nombre}, edad: ${edad}`);
console.log(`¿Es mayor de edad? → ${esMayor}`);

// ✅ Datos del carrito (simulados)
const producto1 = "Remera";
const precio1 = 4500;
const producto2 = "Gorra";
const precio2 = 2800;
const producto3 = "Zapatillas";
const precio3 = 15000;

let cantidad1 = parseInt(prompt(`¿Cuántas ${producto1}s querés comprar? (Precio: $${precio1})`));
let cantidad2 = parseInt(prompt(`¿Cuántas ${producto2}s querés comprar? (Precio: $${precio2})`));
let cantidad3 = parseInt(prompt(`¿Cuántas ${producto3} querés comprar? (Precio: $${precio3})`));

// ✅ Cálculos matemáticos
let subtotal1 = precio1 * cantidad1;
let subtotal2 = precio2 * cantidad2;
let subtotal3 = precio3 * cantidad3;

let total = subtotal1 + subtotal2 + subtotal3;

// ✅ Mostrar resumen con template literals
let resumen = `
🛒 RESUMEN DE COMPRA

${producto1} x${cantidad1}: $${subtotal1}
${producto2} x${cantidad2}: $${subtotal2}
${producto3} x${cantidad3}: $${subtotal3}

🧾 Total a pagar: $${total}
`;

alert("¡Gracias por tu compra, " + nombre + "!");
console.log(resumen);

// ✅ Operador módulo
let cuotas = parseInt(prompt("¿En cuántas cuotas querés pagar?"));
let resto = total % cuotas;

console.log(`Total: $${total} dividido en ${cuotas} cuotas.`);
console.log(`Sobra al dividir: $${resto}`);

// ✅ Comparaciones y booleanos
console.log("¿El total supera los $20.000?", total > 20000);
console.log("¿El total es igual a $0?", total === 0);
console.log("¿El total es múltiplo exacto de las cuotas?", resto === 0);
