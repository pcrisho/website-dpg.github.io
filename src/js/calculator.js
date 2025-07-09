document.getElementById("escsel").addEventListener("change", function () {
    if (this.value === "1") {
        document.getElementsByName("ntmin")[0].value = "0.0"
        document.getElementsByName("ntmax")[0].value = "20.0"
        document.getElementsByName("ntapr")[0].value = "13.0"
        this.dataset.riesgoMin = "10.0";
        this.dataset.riesgoMax = "11.0";
        document.getElementsByName("txtes")[0].value = "• 🎉 Aprobado (>11)\n" +
            "• ⚠️ En riesgo (10-11)\n" +
            "• ❌ Desaprobado (<10)";
    } else if (this.value === "2") {
        document.getElementsByName("ntmin")[0].value = "0.0"
        document.getElementsByName("ntmax")[0].value = "10.0"
        document.getElementsByName("ntapr")[0].value = "6.0"
        this.dataset.riesgoMin = "5.0";
        this.dataset.riesgoMax = "6.0";
        document.getElementsByName("txtes")[0].value = "• 🎉 Aprobado (>6)\n" +
            "• ⚠️ En riesgo (5-6)\n" +
            "• ❌ Desaprobado (<5)";
    }
});


// BOTONES DE AGREGAR FILA, QUITAR FILA Y CALCULAR

let notaCount = 2;  // Ya hay 2 notas iniciales

document.getElementById("add-btn").addEventListener("click", function () {
    notaCount++;
    const container = document.getElementById("notas-container");
    const fila = document.createElement("div");
    fila.className = "fila-nota";
    fila.style.display = "flex";
    fila.style.alignItems = "center";
    fila.style.marginBottom = "0.5rem";
    fila.innerHTML = `
        <span style="width: 60px;">Nota #${notaCount}</span>
        <input type="number" placeholder="Ingrese un número" id="txtnu" class="nota-in">
        <input type="number" value="25" id="txtne" class="porc-in"> %
    `;
    container.appendChild(fila);
});

document.getElementById("remove-btn").addEventListener("click", function () {
    const container = document.getElementById("notas-container");
    const filas = container.getElementsByClassName("fila-nota");
    if (filas.length > 0) {
        container.removeChild(filas[filas.length - 1]);
        notaCount--;
    }
});

document.getElementById("calc-btn").addEventListener("click", function() {
    let total = 0;
    const notas = document.querySelectorAll(".nota-in");
    const porcentajes = document.querySelectorAll(".porc-in");

    notas.forEach((notaInput, index) => {
        const nota = parseFloat(notaInput.value) || 0;
        const porc = parseFloat(porcentajes[index].value) || 0;
        total += nota * (porc / 100);
    });

    // Mostrar el promedio en promfin
    document.getElementsByName("promfin")[0].value = `Tu promedio final es: ${total.toFixed(2)}`;

    // Obtener los valores de aprobación y riesgo
    const ntapr = parseFloat(document.getElementsByName("ntapr")[0].value);
    const escsel = document.getElementById("escsel");
    const riesgoMin = parseFloat(escsel.dataset.riesgoMin);
    const riesgoMax = parseFloat(escsel.dataset.riesgoMax);

    // Determinar el resultado
    let resultado = "";
    if (total >= ntapr) {
        resultado = `✅ Aprobado 🎉`;
    } else if (total >= riesgoMin && total <= riesgoMax) {
        resultado = `⚠️ En riesgo`;
    } else {
        resultado = `❌ Desaprobado`;
    }

    // Mostrar resultado en txtes
    document.getElementsByName("txtes")[0].value = resultado;
});