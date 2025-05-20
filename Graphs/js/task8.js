class Task8 {
    static graph = null;
    static startVertex = null;
    static paths = null;

    static execute() {
        try {
            const input = document.getElementById("graphInput").value.trim();
            if (!input) {
                notyf.error("Введите данные графа");
                return;
            }
            const type = document.getElementById("inputType").value.replace('Weighted', '');
            this.startVertex = parseInt(document.getElementById("startVertex").value);
            this.graph = GraphParser.parseWeightedGraph(input, type);

            WeightedGraphDrawer.draw(this.graph, "originalCanvas");

            const { distances, paths } = GraphAnalyzer.dijkstra(this.graph, this.startVertex);
            this.paths = paths;
            this.drawShortestPaths();
            this.displayResults(distances);
        } catch (e) {
            notyf.error(`Ошибка: ${e.message}`);
        }
    }

    static drawShortestPaths() {
        const pathGraph = {
            adjacency: {},
            weightedEdges: {},
            vertices: new Set(this.graph.vertices)
        };

        const addedEdges = new Set();

        Object.values(this.paths).forEach(path => {
            for (let i = 1; i < path.length; i++) {
                const from = path[i - 1];
                const to = path[i];
                const edgeKey = `${from}-${to}`;

                if (!addedEdges.has(edgeKey)) {
                    const originalEdge = this.graph.weightedEdges[from]?.find(e => e.to === to);

                    if (originalEdge) {
                        pathGraph.adjacency[from] = pathGraph.adjacency[from] || [];
                        pathGraph.weightedEdges[from] = pathGraph.weightedEdges[from] || [];

                        pathGraph.adjacency[from].push(to);
                        pathGraph.weightedEdges[from].push({
                            ...originalEdge,
                            color: "#2ecc71"
                        });
                        addedEdges.add(edgeKey);
                    }
                }
            }
        });

        const canvas = document.getElementById("resultCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        WeightedGraphDrawer.draw({
            ...pathGraph,
            vertices: new Set([...pathGraph.vertices].map(Number)),
            adjacency: pathGraph.adjacency,
            weightedEdges: pathGraph.weightedEdges
        }, "resultCanvas");
    }

    static displayResults(distances) {
        const container = document.getElementById("pathsResults");
        this.clearContainer(container);

        const heading = document.createElement("h3");
        heading.textContent = `Кратчайшие пути из вершины ${this.startVertex}:`;
        container.appendChild(heading);

        const list = document.createElement("ul");
        list.className = "path-list";

        this.graph.vertices.forEach(v => {
            const listItem = document.createElement("li");
            const distanceText = distances[v] === Infinity ? "недостижима" : distances[v];
            const pathText = this.paths[v].length ? ` (путь: ${this.paths[v].join(" → ")})` : "";

            listItem.textContent = `Вершина ${v}: ${distanceText}${pathText}`;
            list.appendChild(listItem);
        });

        container.appendChild(list);
    }

    static clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}