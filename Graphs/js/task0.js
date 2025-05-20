class Task0 {
  static graph = null;

  static execute() {
    try {
      const input = document.getElementById("graphInput").value.trim();
      const type = document.getElementById("inputType").value.replace('Weighted', '');
      this.graph = GraphParser.parse(input, type);

      const degrees = this.getDegrees();
      const components = GraphAnalyzer.findConnectedComponents(this.graph);
      const eulerian = this.checkEulerian(degrees);
      const bipartite = GraphAnalyzer.checkBipartite(this.graph);
      const isCompleteBipartite = bipartite.isBipartite ?
        this.checkCompleteBipartite(bipartite.parts) : false;

      const resultsContainer = document.getElementById("results");
      resultsContainer.replaceChildren();

      const heading = document.createElement("h3");
      heading.textContent = "Результаты анализа:";
      resultsContainer.appendChild(heading);

      this.createResultItem(resultsContainer, `Степени вершин: ${this.formatDegrees(degrees)}`);
      this.createResultItem(resultsContainer, `Компоненты связности: ${components}`);
      this.createResultItem(resultsContainer, `Эйлеров граф: ${eulerian.eulerian ? "Да" : "Нет"}`);
      this.createResultItem(resultsContainer, `Полуэйлеров граф: ${eulerian.semi ? "Да" : "Нет"}`);
      this.createResultItem(resultsContainer, `Двудольный граф: ${bipartite.isBipartite ? "Да" : "Нет"}`);
      this.createResultItem(resultsContainer, `Полный двудольный: ${isCompleteBipartite ? "Да" : "Нет"}`);

      GraphDrawer.draw(this.graph);
    } catch (error) {
      notyf.error(`Ошибка: ${error.message}`);
    }
  }

  static createResultItem(container, text) {
    const item = document.createElement("div");
    item.className = "result-item";

    const icon = document.createElement("span");
    icon.textContent = "▸ ";

    const textNode = document.createElement("span");
    textNode.textContent = text;

    item.appendChild(icon);
    item.appendChild(textNode);
    container.appendChild(item);
  }

  static formatDegrees(degrees) {
    return Object.entries(degrees)
      .map(([v, d]) => `${v}: ${d}`)
      .join(", ");
  }

  static getDegrees() {
    const degrees = {};
    this.graph.vertices.forEach((v) => {
      degrees[v] = this.graph.adjacency[v]?.length || 0;
    });
    return degrees;
  }

  static checkEulerian(degrees) {
    if (GraphAnalyzer.findConnectedComponents(this.graph) !== 1) {
      return { eulerian: false, semi: false };
    }

    let oddCount = 0;
    this.graph.vertices.forEach((v) => {
      if (degrees[v] % 2 !== 0) oddCount++;
    });

    return {
      eulerian: oddCount === 0,
      semi: oddCount === 2
    };
  }

  static checkCompleteBipartite(parts) {
    if (!parts || parts.length !== 2) return false;
    const [partA, partB] = parts;

    // Проверка полного соединения между долями
    for (const a of partA) {
      const neighbors = new Set(this.graph.adjacency[a]);
      if (![...partB].every(b => neighbors.has(b))) return false;
    }

    for (const b of partB) {
      const neighbors = new Set(this.graph.adjacency[b]);
      if (![...partA].every(a => neighbors.has(a))) return false;
    }

    return true;
  }
}