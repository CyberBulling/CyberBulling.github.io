const notyf = new Notyf({
  duration: 3000,
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      type: 'warning',
      background: 'orange',
      dismissible: true
    },
    {
      type: "error",
      background: "red",
      dismissible: true
    }
  ]
});

function outputText() {
  const vector = document.getElementById("vector").value.split("");
  const argument = parseInt(document.getElementById("argument").value);
  let error = null;
  let value;
  try {
    value = document.querySelector('input[name="value"]:checked').value;
  } catch (e) {
    error = e;
    notyf.error("Вектор не может быть пустым");
  }
  if (!error) {
    if (Math.log2(vector.length) % 1 != 0) {
      notyf.error("Вектор должен быть степенью 2");
      return;
    } else {
      if (value != 0 && value != 1) {
        notyf.open({
          type: 'warning',
          message: 'Необходимо выбрать тип остаточной функции'
        });
        // notyf.warning("Необходимо выбрать тип остаточной функции");
        return;
      } else {
        if (!argument) {
          notyf.open({
            type: 'warning',
            message: 'Необходимо ввести номер аргумента'
          });
          // notyf.warning("Необходимо ввести номер аргумента");
          return;
        } else {
          if (argument > Math.log2(vector.length)) {
            notyf.error(
              `Номер аргумента не должен превышать количество аргументов текущего вектора - ${Math.log2(
                vector.length
              )}`
            );
            return;
          }
        }
      }
    }
    document.querySelector(".output3").id = "output0";
    document.getElementById("output0").classList.remove("output3");
    const output = getResidual(vector, value, argument - 1);
    document.getElementById("output0").textContent = `${
      value == 0 ? "Нулевая" : "Еденичная"
    } остаточная по ${argument} аргументу - ${output.join("")}`;
  }
}

// Функция для вычисления остаточной функции
function getResidual(vector, value, argument) {
  const numVariables = Math.log2(vector.length);
  const newVector = [];
  for (let i = 0; i < vector.length; i++) {
    // Преобразуем индекс в двоичное представление
    const binaryString = i.toString(2).padStart(numVariables, "0");
    // Проверяем, соответствует ли значение аргумента типу остаточной функции
    if (parseInt(binaryString[argument]) == value) {
      newVector.push(vector[i]);
    }
  }
  return newVector;
}
