let mines = [];
let minesPosicio = [];
let rows = 0;
let cols = 0;
let numMines = 5;
let minesMarcades = 0;
let temps = 0;
let tempsInterval = null;
let puntuacio = 0;
let puntuacions = [];

let puntuacionsAlmacenades = localStorage.getItem('puntuacions');

if(puntuacionsAlmacenades) {
  puntuacions = JSON.parse(puntuacionsAlmacenades);

  puntuacions.forEach(registre => {
    afegirPuntuacio(registre.nom, registre.puntuacio);
  });
}

function inicialitzaJoc() {
  document.getElementById('Taula').innerHTML = '';
  document.getElementById('Taula').style.pointerEvents = "all";
  document.getElementById('inicialitzar').disabled  = true;
  document.getElementById('missatgeFi').style.display = 'none';

  puntuacio = 0;

  // Obtenir les dimensions de l'àrea de joc dels inputs
  rows = document.getElementById('inputRows').value;
  cols = document.getElementById('inputCols').value;

  // Crear la taula
  let taula = document.createElement('table');

  // Crear les files i les cel·les i afegir-les a la taula
  for (let i = 0; i < rows; i++) {
    let fila = document.createElement('tr');
    for (let j = 0; j < cols; j++) {
      let celda = document.createElement('td');
      celda.setAttribute('id', 'cell-' + i + '-' + j);
      celda.addEventListener('click', obtindreCoordenades);
      celda.addEventListener('click', comprobarVeins);
      celda.addEventListener('contextmenu', marcarMina);
      fila.appendChild(celda);
    }
    taula.appendChild(fila);
  }

  // Afegir la taula a la pàgina web
  document.getElementById('Taula').appendChild(taula);
  mines = inicialitzaMines(numMines, rows, cols);

  //contador de temps
  tempsInterval = setInterval(contadorTemps, 1000)
}

function matriuBinaria(matrix) {
  var matrix2 = [];

  for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] == 1) {
          // Afegir un 1 a la matriu binària
          matrix2.push(1);
      } else {
          // Afegir un 0 a la matriu binària
          matrix2.push(0);
      }
      }
  }

  return matrix2;
}


function inicialitzaMines(nMines, midaX, midaY) {
  // Creem una matriu de midaX per midaY plena de zeros
  var matriu = new Array(midaX);
  for (var i = 0; i < midaX; i++) {
    matriu[i] = new Array(midaY);
    minesPosicio[i] = new Array(midaY);
    for (var j = 0; j < midaY; j++) {
      matriu[i][j] = 0;
      minesPosicio[i][j] = 0;
    }
  }

  // Posen les mines de manera aleatòria
  while (nMines > 0) {
    var x = Math.floor(Math.random() * midaX);
    var y = Math.floor(Math.random() * midaY);
    if (matriu[x][y] === 0) {
      matriu[x][y] = 1;

      for(let k = x-1; k <= x+1; k++) {
        if(k >= 0 && k < rows) {
          for(let m = y-1; m <= y+1; m++) {
            if(m >= 0 && m < cols) {
              minesPosicio[k][m] = minesPosicio[k][m] + 1;
            }
          }
        }
      }

      const celdes = document.getElementById('Taula').getElementsByTagName('td');
      celdes[(x*midaX) + y].addEventListener('click', esMina);
      celdes[(x*midaX) + y].removeEventListener('click', comprobarVeins);

      //Comprobació de que la assignació de mines es fa correctament
      //celdes[(x*midaX) + y].style.backgroundColor = 'yellow';
      
      nMines--;
    }
  }

  return matriu;
}

function obtindreCoordenades(event) {
  const elementId = event.target.id;
  const coordenades = elementId.split('-');
  console.log("La cel·la premuda té les coordenades (" + coordenades[1] + ", " + coordenades[2] + ")");
}

function comprobarVeins(event) {
  const elementId = event.target.id;
  const coordenades = elementId.split('-');
  const celdes = document.getElementById('Taula').getElementsByTagName('td');

  event.target.style.backgroundColor = '#ccc';
  event.target.style.pointerEvents = 'none';

  for(let k = coordenades[1]-1; k <= parseInt(coordenades[1]) + 1; k++) {
    if(k >= 0 && k < rows) {
      for(let m = coordenades[2]-1; m <= parseInt(coordenades[2])+1; m++) {
        if((m >= 0 && m < cols) && !(k == coordenades[1] && m == coordenades[2])) {
          celdes[(k*rows) + m].textContent = minesPosicio[k][m];
          if(mines[k][m] != 1) {
            celdes[(k*rows) + m].style.backgroundColor = '#ccc';
          } else {
            celdes[(k*rows) + m].style.backgroundColor = 'orange';
          }

          celdes[(k*rows) + m].style.pointerEvents = 'none';
        }
      }
    }
  }

  puntuacio++;

  comprobarFinalitzacio();
}

function esMina(event) {
  console.log("La cel·la premuda és una mina");
  event.target.style.backgroundColor = 'red';
  fiJoc('Has Perdut!');
}

function marcarMina(event) {
  event.preventDefault();

  if(event.target.style.backgroundColor == 'orange') {
    event.target.style.backgroundColor = '';
    minesMarcades--;
  } else if(minesMarcades <= numMines) {
    event.target.style.backgroundColor = 'orange';
    minesMarcades++;
  }

  comprobarFinalitzacio();
}

function comprobarFinalitzacio() {
  let finatlizat = true;
  const celdes = document.getElementById('Taula').getElementsByTagName('td');

  for(let celda of celdes) {
    if(celda.style.backgroundColor == '') {
      finatlizat = false;
    }
  }

  if(finatlizat) {
    puntuacio += numMines;
    puntuacio += parseInt(100 / temps, 10);
    fiJoc('Has Guanyat!')
  }
}

function fiJoc(missatge) {
  document.getElementById('Taula').style.pointerEvents = "none";
  clearInterval(tempsInterval);

  document.getElementById('missatgeFi').style.display = 'block';
  document.getElementById('missatgeFi').textContent = missatge;

  document.getElementById('afegirPuntuacio').style.display = 'block';
}

function finatlitzarJoc() {
  nom = document.getElementById('nom').value;
  afegirPuntuacio(nom, puntuacio);
  puntuacions.push({'nom': nom, 'puntuacio': puntuacio});
  localStorage.setItem('puntuacions', JSON.stringify(puntuacions));

  document.getElementById('inicialitzar').disabled  = false;
  document.getElementById('afegirPuntuacio').style.display = 'none';
}

function afegirPuntuacio(nom, puntuacioFinal) {
  const puntuacionsLlistat = document.getElementById('puntuacions');

  let fila = document.createElement('tr');

  let celdaNom = document.createElement('td');
  celdaNom.textContent = nom;

  let celdaPuntuacio = document.createElement('td');
  celdaPuntuacio.textContent = puntuacioFinal;

  fila.appendChild(celdaNom);
  fila.appendChild(celdaPuntuacio);

  puntuacionsLlistat.appendChild(fila);
}

function contadorTemps() {
  const contador = document.getElementById('temps');

  temps++;

  let minuts = (parseInt(temps / 60, 10) +  '').padStart(2, '0');
  let segons = (parseInt(temps % 60) +  '').padStart(2, '0');

  contador.textContent = minuts + ':' + segons;
}
