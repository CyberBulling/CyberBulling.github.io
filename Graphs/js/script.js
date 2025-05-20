document.addEventListener("DOMContentLoaded", () => {
  const taskLinks = document.querySelectorAll(".task-number");

  // Восстановление активной задачи из localStorage
  const savedTask = localStorage.getItem("activeTask");
  if (savedTask) {
    taskLinks.forEach((link) => {
      if (link.dataset.taskNumber === savedTask) {
        link.classList.add("active-task");
      }
    });
  }

  // Обработка кликов
  taskLinks.forEach((link) => {
    link.addEventListener("click", function (e) {

      taskLinks.forEach((t) => t.classList.remove("active-task"));
      this.classList.add("active-task");

      // Сохраняем номер задачи в localStorage
      localStorage.setItem("activeTask", this.dataset.taskNumber);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const imageBlocks = document.querySelectorAll(".block");
  let i = 1;
  const them = localStorage.getItem("theme") === "dark" ? "_dark" : "";
  imageBlocks.forEach((block) => {
    block.style.backgroundImage = `url(images/zad${i}${them}.png)`;
    i++;
  });
  const themeSwitch = document.getElementById("theme-checkbox");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Проверяем сохраненную тему или системные настройки
  const currentTheme =
    localStorage.getItem("theme") ||
    (prefersDarkScheme.matches ? "dark" : "light");

  // Устанавливаем начальное состояние
  if (currentTheme === "dark") {
    document.body.classList.add("dark");
    themeSwitch.checked = true;
  }

  // Обработчик переключения темы
  themeSwitch.addEventListener("change", function () {
    const newTheme = this.checked ? "dark" : "light";
    document.body.classList.toggle("dark", this.checked);
    localStorage.setItem("theme", newTheme);

    const imageBlocks = document.querySelectorAll(".block");
    let i = 1;
    const them = localStorage.getItem("theme") === "dark" ? "_dark" : "";
    imageBlocks.forEach((block) => {
      block.style.backgroundImage = `url(images/zad${i}${them}.png)`;
      i++;
    });
    // Обновляем цвет иконок
    updateIconColors(newTheme);
  });

  // Функция для обновления цветов иконок
  function updateIconColors(theme) {
    const icons = document.querySelectorAll(
      ".theme-switch__icon, .theme-switch__icon-sun, .theme-switch__icon-moon"
    );
    icons.forEach((icon) => {
      icon.style.color = theme === "dark" ? "#ffffff" : "#333333";
    });
  }

  // Инициализация цветов
  updateIconColors(currentTheme);
});
