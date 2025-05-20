const placeholderMap = {
  'adjacencyList': `Пример списка смежности:
1: 2,3,4,5
2: 1,3,4,5
3: 1,2,4,5
4: 1,2,3,5
5: 1,2,3,4`,
  'adjacencyMatrix': `Пример матрицы смежности:
0 1 1 1 1
1 0 1 1 1
1 1 0 1 1
1 1 1 0 1
1 1 1 1 0`,
  'adjacencyWeightedList': `Пример списка смежности:
1: 2(1),3(2),4(3),5(4)
2: 1(5),3(6),4(7),5(8)
3: 1(9),2(10),4(11),5(12)
4: 1(13),2(14),3(15),5(16)
5: 1(17),2(18),3(19),4(20)`,
  'adjacencyWeightedMatrix': `Пример матрицы смежности:
0 1 2 3 4
5 0 6 7 8
9 10 0 11 12
13 14 15 0 16
17 18 19 20 0`,
  'incidenceMatrix': `Пример матрицы инцидентности:
1 1 1 1 0 0 0 0 0 0
1 0 0 0 1 1 1 0 0 0
0 1 0 0 1 0 0 1 1 0
0 0 1 0 0 1 0 1 0 1
0 0 0 1 0 0 1 0 1 1`,
  'pruferDecode': `Пример кода Прюфера
2, 2, 1, 3, 3`
};

document.addEventListener('change', function (event) {
  const target = event.target;
  if (target.tagName === 'SELECT' && target.id === 'inputType') {
    const selectedValue = target.value;
    const textarea = document.getElementById('graphInput');
    if (textarea && placeholderMap[selectedValue]) {
      textarea.setAttribute('placeholder', placeholderMap[selectedValue]);
      textarea.value = '';
    }
  }
});

document.addEventListener('input', function (event) {
  const target = event.target;
  if (target.tagName === 'TEXTAREA' && target.id === 'graphInput') {
    target.value = target.value.replace(/[а-яА-Я]/g, '');
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Tab') {
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'TEXTAREA' && activeElement.id === 'graphInput') {
      const placeholderText = activeElement.getAttribute('placeholder')?.trim().replace(/[а-яА-Я]/g, '').slice(4);
      if (placeholderText && activeElement.value === '') {
        activeElement.value = placeholderText;
        event.preventDefault();
      }
    }
  }
});

class GraphParser {
  static parse(input, type) {
    const graph = { adjacency: {}, vertices: new Set() };
    const lines = input.split("\n").filter((line) => line.trim());

    switch (type) {
      case "adjacencyList":
        this.parseAdjacencyList(lines, graph);
        break;
      case "adjacencyMatrix":
        this.parseAdjacencyMatrix(lines, graph);
        break;
      case "incidenceMatrix":
        this.parseIncidenceMatrix(lines, graph);
        break;
      default:
        throw new Error("Неизвестный формат");
    }
    return graph;
  }

  static parseAdjacencyList(lines, graph) {
    const regex = /^\s*(\d+)\s*:\s*((?:\d+(?:\(\d+\))?[\s,]*)*)/;
    for (let i = 0; i < lines.length; i++) { // Замена forEach на for
      const match = lines[i].match(regex);
      if (!match) throw new Error(`Ошибка формата в строке ${i + 1}`);

      const vertex = +match[1]; // Быстрое преобразование в число
      const neighbors = match[2] ?
        match[2].split(/[\s,]+/g)
          .map(n => +n.replace(/\(\d+\)/g, ''))
          .sort((a, b) => a - b)
        : [];

      graph.vertices.add(vertex);
      graph.adjacency[vertex] = neighbors;
    }
  }


  static parseAdjacencyMatrix(lines, graph) {
    const matrix = lines.map(line =>
      line.trim()
        .split(/[\s,]+/)
        .filter(x => x)
        .map(x => x.replace(/\(\d+\)/g, '')) // Удаляем веса в скобках
        .map(Number)
    );

    const size = matrix.length;
    graph.vertices = new Set([...Array(size).keys()].map(i => i + 1));

    matrix.forEach((row, i) => {
      const vertex = i + 1;
      graph.adjacency[vertex] = [];
      row.forEach((val, j) => {
        if (val > 0) {
          graph.adjacency[vertex].push(j + 1);
        }
      });
    });
  }

  static parseIncidenceMatrix(lines, graph) {
    const matrix = lines.map((line) => line.trim().split(/[\s,]+/).map(Number));
    const vertices = matrix.length;
    const edges = matrix[0]?.length || 0;

    graph.vertices = new Set([...Array(vertices).keys()].map((i) => i + 1));
    for (let col = 0; col < edges; col++) {
      let from, to;
      for (let row = 0; row < vertices; row++) {
        if (matrix[row][col] === 1) from = row + 1;
        if (matrix[row][col] === -1) to = row + 1;
      }
      if (from && to) {
        graph.adjacency[from] = graph.adjacency[from] || [];
        graph.adjacency[from].push(to);
      }
    }
  }

  static parseWeightedGraph(input, type) {
    const graph = {
      adjacency: {},
      weightedEdges: {},
      vertices: new Set()
    };
    const lines = input.split("\n").filter(line => line.trim());

    switch (type) {
      case "adjacencyList":
        this.parseWeightedAdjacencyList(lines, graph);
        break;
      case "adjacencyMatrix":
        this.parseWeightedAdjacencyMatrix(lines, graph); // Новый метод
        break;
      default:
        throw new Error("Неизвестный формат");
    }
    return graph;
  }

  static parseWeightedAdjacencyMatrix(lines, graph) {
    const matrix = lines.map(line =>
      line.trim()
        .split(/[\s,]+/)
        .filter(x => x)
        .map(Number)
    );

    const size = matrix.length;
    graph.vertices = new Set([...Array(size).keys()].map(i => i + 1));

    matrix.forEach((row, i) => {
      const from = i + 1;
      graph.adjacency[from] = [];
      graph.weightedEdges[from] = [];

      row.forEach((weight, j) => {
        const to = j + 1;
        if (weight > 0) {
          graph.adjacency[from].push(to);
          graph.weightedEdges[from].push({ to, weight });
        }
      });
    });
  }

  static parseWeightedAdjacencyList(lines, graph) {
    const regex = /(\d+)\s*:\s*((?:\d+\(\d+\)[\s,]*)*)/;

    lines.forEach((line, idx) => {
      const match = line.match(regex);
      if (!match) throw new Error(`Ошибка формата в строке ${idx + 1}`);

      const vertex = parseInt(match[1]);
      graph.vertices.add(vertex);
      graph.adjacency[vertex] = [];
      graph.weightedEdges[vertex] = [];

      // Обработка соседей
      const neighborsStr = match[2].trim();
      if (neighborsStr) {
        neighborsStr.split(/[\s,]+/)
          .filter(x => x)
          .forEach(n => {
            const [to, weight] = n.match(/\d+/g).map(Number);
            graph.adjacency[vertex].push(to);
            graph.weightedEdges[vertex].push({ to, weight });
          });
      }
    });
  }
}

class GraphAnalyzer {
  static findConnectedComponents(graph) {
    const undirectedGraph = this._convertToUndirected(graph);
    const visited = new Set();
    let components = 0;

    // Преобразуем вершины в числа
    const vertices = Array.from(undirectedGraph.vertices).map(Number);

    vertices.forEach(node => {
      if (!visited.has(node)) {
        components++;
        this.bfs(node, undirectedGraph, visited);
      }
    });

    return components;
  }

  // Преобразуем ориентированный граф в неориентированный
  static _convertToUndirected(graph) {
    const undirected = {
      adjacency: {},
      vertices: new Set(graph.vertices)
    };

    // Добавляем рёбра в обоих направлениях
    Object.entries(graph.adjacency).forEach(([from, neighbors]) => {
      const fromNum = Number(from);
      undirected.adjacency[fromNum] = undirected.adjacency[fromNum] || [];

      neighbors.forEach(to => {
        const toNum = Number(to);
        // Добавляем прямое ребро
        if (!undirected.adjacency[fromNum].includes(toNum)) {
          undirected.adjacency[fromNum].push(toNum);
        }
        // Добавляем обратное ребро
        undirected.adjacency[toNum] = undirected.adjacency[toNum] || [];
        if (!undirected.adjacency[toNum].includes(fromNum)) {
          undirected.adjacency[toNum].push(fromNum);
        }
      });
    });

    return undirected;
  }

  static checkBipartite(graph) {
    const colors = new Map();
    let isBipartite = true;

    graph.vertices.forEach((v) => {
      if (!colors.has(v) && isBipartite) {
        const queue = [v];
        colors.set(v, 0);

        while (queue.length > 0 && isBipartite) {
          const node = queue.shift();
          (graph.adjacency[node] || []).forEach((neighbor) => {
            if (!colors.has(neighbor)) {
              colors.set(neighbor, 1 - colors.get(node));
              queue.push(neighbor);
            } else if (colors.get(neighbor) === colors.get(node)) {
              isBipartite = false;
            }
          });
        }
      }
    });

    return { isBipartite };
  }

  static isTree(graph) {
    // Проверка для неориентированного дерева
    const edgeCount = this.getEdgeCount(graph);
    const vertexCount = graph.vertices.size;

    // 1. Проверка условия: рёбер = вершин - 1
    if (edgeCount !== vertexCount - 1) return false;

    // 2. Проверка связности через BFS
    const visited = new Set();
    const start = Array.from(graph.vertices)[0];
    this.bfs(start, graph, visited);

    // 3. Все вершины должны быть достижимы
    return visited.size === vertexCount;
  }

  static getEdgeCount(graph) {
    let count = 0;
    Object.values(graph.adjacency).forEach(neighbors => {
      count += neighbors.length;
    });
    return count / 2; // Каждое ребро учтено дважды
  }

  static bfs(start, graph, visited) {
    const queue = [start];
    visited.add(start);
    let idx = 0; // Замена shift() на индекс

    while (idx < queue.length) {
      const current = queue[idx++];
      const neighbors = graph.adjacency[current] || [];

      for (const neighbor of neighbors) { // for вместо forEach
        const numNeighbor = +neighbor;
        if (!visited.has(numNeighbor)) {
          visited.add(numNeighbor);
          queue.push(numNeighbor);
        }
      }
    }
  }

  static reconstructPath(predecessors, target) {
    const path = [];
    let current = target;

    while (current !== null) {
      path.unshift(current);
      current = predecessors[current];
    }

    return path.length > 1 ? path : [];
  }

  static dijkstra(graph, startVertex) { // Добавляем параметр startVertex
    const distances = {};
    const predecessors = {};
    const pq = new PriorityQueue();

    graph.vertices.forEach(v => {
      distances[v] = Infinity;
      predecessors[v] = null;
    });
    distances[startVertex] = 0; // Используем переданный параметр
    pq.enqueue(startVertex, 0);

    while (!pq.isEmpty()) {
      const { element: current, priority: dist } = pq.dequeue();

      // Добавляем проверку на существование ребер
      const edges = graph.weightedEdges[current] || [];
      edges.forEach(({ to, weight }) => {
        if (!graph.vertices.has(to)) return; // Проверка существования вершины
        const newDist = dist + weight;
        if (newDist < distances[to]) {
          distances[to] = newDist;
          predecessors[to] = current;
          pq.enqueue(to, newDist);
        }
      });
    }

    const paths = {};
    graph.vertices.forEach(v => {
      paths[v] = this.reconstructPath(predecessors, v);
    });

    return { distances, paths };
  }

  static kruskalMST(graph) {
    const dsu = new DSU();
    const edges = [];

    Object.entries(graph.weightedEdges).forEach(([from, edgesList]) => {
      edgesList.forEach(({ to, weight }) => {
        edges.push({
          from: parseInt(from),
          to,
          weight
        });
      });
    });

    edges.sort((a, b) => a.weight - b.weight);
    graph.vertices.forEach(v => dsu.makeSet(v));

    const mst = [];
    for (const edge of edges) {
      if (dsu.union(edge.from, edge.to)) {
        mst.push(edge);
        if (mst.length === graph.vertices.size - 1) break;
      }
    }
    return mst;
  }
}

class DSU {
  constructor() {
    this.parent = {};
    this.rank = {};
  }

  makeSet(node) {
    this.parent[node] = node;
    this.rank[node] = 0;
  }

  find(node) {
    if (this.parent[node] !== node) {
      this.parent[node] = this.find(this.parent[node]);
    }
    return this.parent[node];
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA === rootB) return false;

    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else {
      this.parent[rootB] = rootA;
      if (this.rank[rootA] === this.rank[rootB]) this.rank[rootA]++;
    }
    return true;
  }
}

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift();
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}