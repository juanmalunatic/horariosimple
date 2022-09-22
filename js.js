window.addEventListener('DOMContentLoaded', (event) => {
  
  // # Ajustar la altura de la tabla con base en la columna "Duración"

  // La altura por cada hora de duración. Un evento de duración 1.5 h tiene 1.5 x este valor
  pixelHeightOneHour  = 25;
  // El índice de la columna que almacena la duración del bloque. Inicia en 0.
  columnIndexDuration = 1;
  setRowHeightAccToDuration(pixelHeightOneHour, columnIndexDuration);

  // # Iniciar la barra naranja que muestra la posición actual del reloj

  drawCurrentTimeBar(pixelHeightOneHour);

  setInterval(() => {
      drawCurrentTimeBar(pixelHeightOneHour)
  }, 1000*60);

  // # Highlight la columna del día actual
  highlightCurrentDay();

  /*
  let cambiarBtn = document.getElementById("submit");
  let ajusteInput = document.getElementByIºd("ajuste");
  cambiarBtn.addEventListener('click', (event) => {
    recalcHoras(ajusteInput.value);
  });
  let resetBtn = document.getElementById("reset");
  resetBtn.addEventListener('click', (event) => {
    recalcHoras("09:00");
  });*/
  
  
});

function setRowHeightAccToDuration(pixelHeightOneHour, columnIndexDuration) {
  
  var table = document.getElementById("tabla");
  for (var i = 0, row; row = table.rows[i]; i++) {
    
    // Ignoro th
    if (i == 0)
      continue;
      
    // Puedo iterar y discriminar el tipo de fila
    // - Las evento-colspan son un solo larguero
    // - Las evento-normal  son bloquesitos sueltos
    // let rowtype = row.getAttribute("class");
    // Esto ya no se usa pero para qué lo borro si puede que luego.

    let idxDuration = columnIndexDuration; 

    // Se iteran las columnas para obtener las duraciones
    for (var j = 0, col; col = row.cells[j]; j++) {
      if (j == idxDuration) {
        let factor = parseFloat(col.innerText);
        let height = pixelHeightOneHour * factor + "px";
        row.style.height = height;
      }
    }  
    
  }
}

function drawCurrentTimeBar (pixelHeightOneHour) {
  
  // De 09:00 a 00:30 hay 15.5h
  let horasTot = 15.5;
  // En minutos: 930m
  let current = new Date();
  
  let actHora = current.getHours();
  let actMins = current.getMinutes();
  let horaAct = actHora * 60 + actMins;

  // Debug: ver si la linea está bien cuadrada (depende de alturas de td)
  // horaAct = 19*60;  
                     
  // Las 9:00 am en minutos son las 
  let horaMin = (9) * 60;
  
  //console.log("horaAct ini " + horaAct);
  //console.log("horaMin " + horaMin);
  // Si la hora es <9, trasnocho
  if (horaAct < horaMin) {
    horaAct = horaAct + 24 * 60;
  }
  //console.log("horaAct mod " + horaAct);
  
  let horasDif = (horaAct - horaMin)/60;
  //console.log("horasDif " + horasDif);
  
  //console.log(pixelHeightOneHour * horasDif);
  let barra = document.getElementById("timebar");
  let heightTot = (pixelHeightOneHour * horasDif) + "px";
  barra.style.top = heightTot;

  // Esto es el pct que puede ser útil para otras vainas
  // let horaMax = (9 + horasTot) * 60;
  // let pct = 0.01 * (horaAct - horaMin) / horasTot;
  // let pctHrs = pct * horasTot;
  // console.log("pct " + pct);
  // console.log("pctHrs " + pctHrs);
 
}


function hourMinStrToMinutes(hourMinStr) {
  let temparr = hourMinStr.split(":");
  let hours   = parseInt(temparr[0]);
  let minutes = parseInt(temparr[1]);
  
  return (hours*60) + minutes;
}

function minsToHourMinStr(minutes) {
  const hours = Math.floor(minutes/60);
  const mins  = minutes % 60;
  const hoursStr = ("" + hours).padStart(2, '0');
  const minsStr  = ("" + mins ).padStart(2, '0');
  return hoursStr + ":" + minsStr;
  
  // Buggy for hours 23+
  // Also the bar doesn't move properly
}

function recalcHoras(hourMinStrStart) {
  // Get time cells
  const timecells = document.getElementsByClassName("time");
  
  // Get the harcoded starting time
  const startMins = parseInt(
      hourMinStrToMinutes(timecells[0].innerText)
  );
  
  // Parse the new starting time
  const desirMins = hourMinStrToMinutes(hourMinStrStart);
  
  // Get the distance b/w desired and start
  const delayMins = desirMins - startMins;
  
  // Loop para cada elemento de la tabla
  for (timecell of timecells) {
    const oriHourMin = timecell.innerText;
    
    // Convert text to minutes 
    const oriMins = parseInt(
      hourMinStrToMinutes(oriHourMin)
    );
    
    // Add minutes to delay
    const newMins = oriMins + delayMins;
    
    // Convert back to text
    const newHourMin = minsToHourMinStr(newMins);
    
    timecell.innerText = newHourMin;
  }
  
}

function highlightCurrentDay()
{

  const dia = getCurrentWeekDay();
  // #Método uno
  //highlightCurrentDayOnCells(dia);

  // #Método dos
  highlightCurrentDayWithRect(dia);
}

function getCurrentWeekDay()
{
  // Días de 0 a 6 (0: domi, 1:lunes)
  const d = new Date();
  let day = d.getDay()

  // Días de 1 a 7, ahora 1:lunes, 7:domingo
  let dia = (day - 1) == -1 ? 7 : day;

  // Si estamos entre las 00:00 y las 03:00 cuenta como el día anterior
  let hora = d.getHours();
  if (hora >= 0 && hora <= 3) {
    dia--
  }

  return dia;
}

// #Método uno: outline en celdas
function highlightCurrentDayOnCells(currentDay)
{

  // Iterar la tabla agregando el estilo a todas las filas
  const colMatch = currentDay + 2; //offset manual :p

  const table = document.getElementById("tabla");
  for (let r = 0, row; row = table.rows[r]; r++) {
    for (let c = 0, col; col = row.cells[c]; c++) {
        if (c == colMatch)
          col.classList.add("col-current-day");
    }  
  }
}

function highlightCurrentDayWithRect(currentDay)
{
  // Get the table
  const table = document.getElementById("tabla");
  tableRect = table.getBoundingClientRect();

  // Add a manual offset :)
  const colMatch = currentDay + 2;

  // Get the column's header and its dimensions
  currDayColumn = table.rows[0].cells[colMatch];
  var headerRect = currDayColumn.getBoundingClientRect();

  // Create a rectangle with proper positioning (covering the corresponding column)
  let rectangle = document.createElement("div");
  rectangle.setAttribute("id", "overlay-current-day");
  Object.assign(
    rectangle.style,
    {
      top   : headerRect.top   + window.scrollY + "px",
      left  : headerRect.left  + "px",
      width : headerRect.width + "px",
      height: tableRect.height + "px"
    }
  );

  document.querySelector("body").appendChild(rectangle);

  // Debug
  //Object.assign(rectangle.style, {backgroundColor:"#f90000"})
  //rectangle.innerHTML = "Hola";

}

