class Task12 {
  static graph = null;

  static execute() {
    try {
      const input = document.getElementById("graphInput").value.trim();
      const type = document.getElementById("inputType").value.replace('Weighted','');
      this.graph = GraphParser.parse(input, type);

      const order = this.dfs();
      this.displayDFSResult(order);
      GraphDrawer.draw(this.graph);
    } catch (e) {
      this.showError(e.message, 'dfsResult');
    }
  }

  static validate() {
    try {
      if (!this.graph) throw new Error("Сначала выполните обход");

      const userInput = document.getElementById("userInput").value.trim();
      const userOrder = userInput.split(/[\s,]+/).map(Number);
      const correctOrder = this.dfs();

      this.displayValidationResult(userOrder, correctOrder);
    } catch (e) {
      this.showError(e.message, 'validationResult');
    }
  }

  static displayDFSResult(order) {
    const container = document.getElementById("dfsResult");
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

  static showError(message, targetId) {
    const container = document.getElementById(targetId);
    this.clearContainer(container);

    const error = document.createElement("div");
    error.className = "error";
    error.textContent = message;

    container.appendChild(error);
  }

  static dfs() {
    const visited = new Set();
    const order = [];

    this.graph.vertices.forEach((v) => {
      if (!visited.has(v)) this.dfsVisit(v, visited, order);
    });
    return order;
  }

  static dfsVisit(node, visited, order) {
    visited.add(node);
    order.push(node);
    (this.graph.adjacency[node] || []).forEach((neighbor) => {
      if (!visited.has(neighbor)) this.dfsVisit(neighbor, visited, order);
    });
  }
}