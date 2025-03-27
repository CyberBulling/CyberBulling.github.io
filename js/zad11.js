const notyf = new Notyf({
  duration: 3000,
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      type: "error",
      background: "red",
      dismissible: true
    },
    {
      type: "success",
      background: "green",
      dismissible: true
    }
  ]
});

const generateVectorButton = document.getElementById("generate-vector");
const outputContainer = document.getElementById("output1");
const checkResultButton = document.getElementById("check-result");
const classButtons = document.querySelectorAll(".class-button");
const full = document.getElementById("full");

class Vector {
  constructor(vectorLength) {
    this.vector = generateVector(vectorLength);
    this.M = isMonotone(this.vector);
    this.L = isLinear(this.vector);
    this.T0 = this.vector.join("")[0] == "0" ? true : false;
    this.T1 =
      this.vector.join("")[this.vector.length - 1] == "1" ? true : false;
    this.S = true;
    for (let i = 0; i < this.vector.length / 2; i++) {
      if (this.vector[i] == this.vector[this.vector.length - 1 - i]) {
        this.S = false;
        break;
      }
    }
  }
  getVector() {
    return this.vector;
  }
  toString() {
    return this.vector.join("");
  }
  isCanceled() {
    const notCanceled = [];
    if (!this.M) notCanceled.push("M");
    if (!this.L) notCanceled.push("L");
    if (!this.T0) notCanceled.push("T0");
    if (!this.T1) notCanceled.push("T1");
    if (!this.S) notCanceled.push("S");
    return notCanceled;
  }
}

let selectedClasses = [];
let vectors = [];
let zhegalkinLength; //для рекурсии
let classes = [];
let mistakes = false;
let isFull = 0;

classButtons.forEach((button) => {
  //проверка выбран ли класс
  button.addEventListener("click", () => {
    if (button.classList.contains("selected")) {
      button.classList.remove("selected");
      selectedClasses = selectedClasses.filter((cls) => cls !== button.id);
    } else {
      button.classList.add("selected");
      selectedClasses.push(button.id);
    }
  });
});

//---------------------------------------------------------------------------------------------------------------------------------

generateVectorButton.addEventListener("click", () => {
  document.querySelectorAll(".class-button").forEach((button) => {
    button.style.display = "block";
  });
  isFull = 0;
  document
    .querySelectorAll(".class-button")
    .forEach((btn) => (btn.style.pointerEvents = "all"));
  checkResultButton.disabled = false;
  vectors = [];
  classes = [];
  const vectorCount = Math.floor(Math.random() * 4) + 1;

  for (let i = 0; i < vectorCount; i++) {
    const power = Math.floor(Math.random() * 2) + 2;
    const vectorLength = Math.pow(2, power);
    const vector = new Vector(vectorLength);
    if (vectors.indexOf(vector) === -1) {
      vectors.push(vector);
    } else {
      i--;
    }
  }

  outputContainer.innerText = `Набор векторов: {${vectors.join(", ")}}`;

  // Очистить все дополнительные классы и выделения
  classButtons.forEach((button) => {
    button.classList.remove(
      "selected",
      "right",
      "wrong",
      "wrong-unselected",
      "right-unselected"
    );
  });
  selectedClasses = [];
});

//---------------------------------------------------------------------------------------------------------------------------------

full.addEventListener("click", () => {
  if (!full.classList.contains("selected")) {
    full.classList.remove("selected");
    document.querySelectorAll(".class-button").forEach((button) => {
      if (button.id !== "full") {
        button.style.display = "block";
        button.classList.remove("selected");
      }
    });
  } else {
    full.classList.add("selected");
    document.querySelectorAll(".class-button").forEach((button) => {
      if (button.id !== "full") {
        button.style.display = "none";
      }
    });
    const classes = [];
    const allClasses = ["M", "L", "T0", "T1", "S"];
    vectors.forEach((vector) => {
      const canceled = vector.isCanceled(); //классы которым не принадлежит вектор
      allClasses.forEach((cls) => {
        if (canceled.includes(cls) && !classes.includes(cls)) {
          classes.push(cls);
        }
      });
    });
    classes.length === 5 ? (isFull = 1) : (isFull = -1);
    console.log(isFull, classes);
  }
});

//---------------------------------------------------------------------------------------------------------------------------------

checkResultButton.addEventListener("click", () => {
  checkResultButton.disabled = true; //классы в которых не содержится набор
  if (isFull === 1) {
    full.classList.add("right");
    notyf.success("Все правильно");
    full.style.pointerEvents = "none";
  } else if (isFull === 0) {
    //---------------------------------------------------------------------------------------------------------------------------------
    const allClasses = ["M", "L", "T0", "T1", "S"];
    mistakes = false;
    console.log(vectors);
    vectors.forEach((vector) => {
      const canceled = vector.isCanceled(); //классы которым не принадлежит вектор
      allClasses.forEach((cls) => {
        if (canceled.includes(cls) && !classes.includes(cls)) {
          classes.push(cls);
        }
      });
    });

    if (classes.length === 5) {
      mistakes = true;
      full.classList.add("wrong");
      selectedClasses.forEach((clas) => {
        document.querySelector(`div #${clas}`).classList.add("wrong");
      });
    } else {
      selectedClasses.forEach((clas) => {
        if (classes.includes(clas)) {
          mistakes = true;
          document
            .querySelector(`div #${clas}`)
            .classList.remove("selected", "right");
          document.querySelector(`div #${clas}`).classList.add("wrong");
        } else {
          document
            .querySelector(`div #${clas}`)
            .classList.remove("selected", "wrong");
          document.querySelector(`div #${clas}`).classList.add("right");
        }
      });

      classButtons.forEach((button) => {
        if (
          selectedClasses.includes(button.id) &&
          classes.includes(button.id)
        ) {
          mistakes = true;
          button.classList.remove("wrong", "right", "selected");
          button.classList.add("wrong-unselected");
        } else if (
          !selectedClasses.includes(button.id) &&
          classes.includes(button.id)
        ) {
          button.classList.remove("wrong", "right", "selected");
          button.classList.add("right-unselected");
        }
      });
    }

    mistakes ? notyf.error("Ошибка") : notyf.success("Все правильно");

    document
      .querySelectorAll(".class-button")
      .forEach((btn) => (btn.style.pointerEvents = "none"));

    console.log(classes, selectedClasses);
    //---------------------------------------------------------------------------------------------------------------------------------
  } else {
    full.classList.add("wrong");
    notyf.error("Ошибка");
    full.style.pointerEvents = "none";
  }
});

function generateVector(length) {
  const vector = [];
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1);
  }
  return vector;
}

function getBinaryRepresentation(vector) {
  const binaryVector = [];
  for (let i = 0; i < vector.length; i++) {
    const binaryRepresentation = i
      .toString(2)
      .padStart(Math.log2(vector.length), "0");
    binaryVector[i] = binaryRepresentation;
  }
  return binaryVector;
}

function isMonotone(vector) {
  const binaryVector = getBinaryRepresentation(vector);

  for (let i = 0; i < vector.length; i++) {
    for (let j = i + 1; j < vector.length; j++) {
      const binaryRepresentationI = binaryVector[i];
      const binaryRepresentationJ = binaryVector[j];
      const countOnesI = binaryRepresentationI.split("1").length - 1;
      const countOnesJ = binaryRepresentationJ.split("1").length - 1;

      if (countOnesI < countOnesJ && vector[j] === 0 && vector[i] === 1) {
        return false;
      }
    }
  }

  return true;
}

function isLinear(vector) {
  let linear = true;
  zhegalkinLength = vector.length;
  const zhegalkinPolynom = createZhegalkin(vector, [], vector);
  const binaryZhegalkin = getBinaryRepresentation(zhegalkinPolynom);
  for (let i = 0; i < binaryZhegalkin.length; i++) {
    if (binaryZhegalkin[i].split(1).length > 1 && zhegalkinPolynom[i] === 1) {
      linear = false;
      break;
    }
  }
  return linear;
}

function createZhegalkin(vector, polynom) {
  if (polynom.length < zhegalkinLength - 1) {
    let polynomialRepresentation = [];
    for (let i = 1; i < vector.length; i++) {
      polynomialRepresentation.push(vector[i] ^ vector[i - 1]);
    }
    polynom.push(polynomialRepresentation[0]);
    vector = polynomialRepresentation;
    createZhegalkin(vector, polynom);
  } else {
    polynom.push(vector[0]);
  }
  return polynom;
}
