window.addEventListener('DOMContentLoaded', (event) => {
  
  hourHeight = 25;
  tablar(hourHeight);

  bar(hourHeight);  
  setInterval(() => {
      bar(hourHeight)
  }, 1000*60);

  /*
  let cambiarBtn = document.getElementById("submit");
  let ajusteInput = document.getElementById("ajuste");
  cambiarBtn.addEventListener('click', (event) => {
    recalcHoras(ajusteInput.value);
  });
  let resetBtn = document.getElementById("reset");
  resetBtn.addEventListener('click', (event) => {
    recalcHoras("09:00");
  });*/
  
  
});

function tablar(hourHeight) {
  
  var table = document.getElementById("tabla");
  for (var i = 0, row; row = table.rows[i]; i++) {
    
    // Ignoro th
    if (i == 0)
      continue;
      
    // Itero y discrimino tipo de fila
    let rowtype = row.getAttribute("class") || "bloque";
    
    // las "fijo" tienen colspan
    let indiceDura = (rowtype =="fijo") ? 3 : 4; 
    
    for (var j = 0, col; col = row.cells[j]; j++) {
      if (j == indiceDura) {
        let factor = parseFloat(col.innerText);
        let height = hourHeight * factor + "px";
        row.style.height = height;
      }
    }  
    
  }
}

function bar (hourHeight) {
  
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
  
  //console.log(hourHeight * horasDif);
  let barra = document.getElementById("timebar");
  let heightTot = (hourHeight * horasDif) + "px";
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