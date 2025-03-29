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
      dismissible: true,
    },
  ],
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") == null)
    localStorage.setItem("theme", "light");

  const themeSwitcher = document.querySelectorAll("#theme");

  themeSwitcher.forEach((element) => {
    element.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );
    });
  });
  if (localStorage.getItem("theme") == "dark") {
    document.body.classList.add("dark");
  }
});

function VectorFunction(
  zeroResidual,
  oneResidual,
  argumentIndex,
  number_of_variables
) {
  let resultVector = [];
  if (argumentIndex === 1) {
    resultVector = zeroResidual.concat(oneResidual);
    return resultVector;
  } else if (argumentIndex === number_of_variables) {
    for (let i = 0; i < zeroResidual.length; i++) {
      resultVector.push(zeroResidual[i]);
      resultVector.push(oneResidual[i]);
    }
    // console.log(resultVector);
    return resultVector;
  } else {
    const blocksCount = 2 ** (argumentIndex - 1);
    const step = zeroResidual.length / blocksCount;
    for (let i = 0; i < blocksCount; i++) {
      const zeroBlock = zeroResidual.slice(i * step, (i + 1) * step);
      const oneBlock = oneResidual.slice(i * step, (i + 1) * step);
      resultVector.push(...zeroBlock, ...oneBlock);
    }
    return resultVector;
  }
}

const zeroResidualInput = document.getElementById("nullvector");
zeroResidualInput.addEventListener("change", (event) => {
  const input = event.target.value;
  if (!isBinary(input)) {
    // Фильтруем только '0' и '1'
    const filtered = input
      .split("")
      .filter((char) => char === "0" || char === "1")
      .join("");
    // Обновляем значение в поле ввода
    event.target.value = filtered;
    // Показываем предупреждение только если были удалены символы
    if (filtered !== input) {
      notyf.error("Неверный ввод. Разрешены только 0 и 1");
    }
  }
});
const oneResidualInput = document.getElementById("edvector");
oneResidualInput.addEventListener("change", (event) => {
  const input = event.target.value;
  if (!isBinary(input)) {
    // Фильтруем только '0' и '1'
    const filtered = input
      .split("")
      .filter((char) => char === "0" || char === "1")
      .join("");
    // Обновляем значение в поле ввода
    event.target.value = filtered;
    // Показываем предупреждение только если были удалены символы
    if (filtered !== input) {
      notyf.error("Неверный ввод. Разрешены только 0 и 1");
    }
  }
});
function isBinary(input) {
  const binaryPattern = /^[01]+$/; // Регулярное выражение для проверки на 0 и 1
  return binaryPattern.test(input);
}

function outputText() {
  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = "";

  // Считываем данные
  const zeroResidualInput = document.getElementById("nullvector").value.trim();
  const oneResidualInput = document.getElementById("edvector").value.trim();
  const argumentIndex = parseInt(document.getElementById("argument").value, 10);

  // Проверка на пустые остаточные
  if (!zeroResidualInput) {
    notyf.error("Остаточная (0) не может быть пустой!");
    return;
  }
  if (!oneResidualInput) {
    notyf.error("Остаточная (1) не может быть пустой!");
    return;
  }

  // Проверка аргумента
  if (isNaN(argumentIndex) || argumentIndex <= 0) {
    notyf.error("Введите корректный номер аргумента!");
    return;
  }

  // Проверка бинарного формата
  if (!isBinary(zeroResidualInput) || !isBinary(oneResidualInput)) {
    notyf.error("Разрешены только 0 и 1");
    return;
  }

  // Проверка длины остаточных
  if (zeroResidualInput.length !== oneResidualInput.length) {
    notyf.error("Длины векторов должны совпадать");
    return;
  }

  // Проверка степени двойки
  const totalLength = zeroResidualInput.length * 2;
  if (!Number.isInteger(Math.log2(totalLength)) || totalLength < 2) {
    notyf.error(
      "Длина остаточных должна быть степенью двойки (2, 4, 8, 16...)"
    );
    return;
  }

  // Конвертация в массив чисел
  const zeroResidual = Array.from(zeroResidualInput, Number);
  const oneResidual = Array.from(oneResidualInput, Number);

  // Проверка номера аргумента
  const number_of_variables = Math.log2(totalLength);
  if (argumentIndex > number_of_variables) {
    notyf.error("Номер аргумента превышает количество переменных");
    return;
  }

  // Получение результата
  const vector = VectorFunction(
    zeroResidual,
    oneResidual,
    argumentIndex,
    number_of_variables
  );

  // Вывод результата
  const output = document.createElement("p");
  output.classList.add("output0");
  output.textContent = `Вектор функции: ${vector.join("")}`;
  outputContainer.appendChild(output);
}
