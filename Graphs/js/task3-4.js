class Task34 {
  static graph = null;

  static execute() {
    try {
      const input = document.getElementById("graphInput").value.trim();
      if (!input) {
        notyf.error("Введите данные графа");
        return;
      }
      const type = document.getElementById("inputType").value.replace('Weighted','');
      this.graph = GraphParser.parse(input, type);

      const order = this.bfs();
      this.displayBFSResult(order);
      GraphDrawer.draw(this.graph);
    } catch (e) {
      notyf.error(e.message);
    }
  }

  static validate() {
    try {
      if (!this.graph) notyf.error("Сначала выполните обход");

      const userInput = document.getElementById("userBFS").value.trim();
      const userOrder = userInput.split(/[\s,]+/).map(Number);
      const correctOrder = this.bfs();

      this.displayValidationResult(userOrder, correctOrder);
    } catch (e) {
      notyf.error(e.message);
    }
  }

  static displayBFSResult(order) {
    const container = document.getElementById("bfsOrder");
    this.clearContainer(container);

    const resultText = document.createElement("div");
    resultText.className = "result-text";
    resultText.textContent = order.join(" → ");

    container.appendChild(resultText);
  }

  static displayValidationResult(userOrder, correctOrder) {
    const container = document.getElementById("validationResult");
    this.clearContainer(container);

    const resultSpan = document.createElement("span");
    const isValid = this.compareOrders(userOrder, correctOrder);

    resultSpan.className = isValid ? "correct" : "error";
    resultSpan.appendChild(document.createTextNode(
      isValid ? "✓ Верно!" : `✗ Неверно! Правильный порядок: ${correctOrder.join(" → ")}`
    ));

    container.appendChild(resultSpan);
  }

  static compareOrders(userOrder, correctOrder) {
    return userOrder.length === correctOrder.length &&
      userOrder.every((val, idx) => val === correctOrder[idx]);
  }

  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  static bfs() {
    const visited = new Set();
    const order = [];
    const queue = [];

    this.graph.vertices.forEach((v) => {
      if (!visited.has(v)) {
        queue.push(v);
        visited.add(v);

        while (queue.length > 0) {
          const current = queue.shift();
          order.push(current);
          (this.graph.adjacency[current] || []).forEach((neighbor) => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          });
        }
      }
    });
    return order;
  }
}