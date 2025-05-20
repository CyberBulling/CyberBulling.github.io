class PruferProcessor {
    static execute() {
        try {
            const type = document.getElementById("inputType").value.replace('Weighted', '');
            const input = document.getElementById("graphInput").value.trim();
            if (!input) {
                notyf.error("Введите данные графа");
                return;
            }
            let graph = [];
            const resultContainer = document.getElementById("codeResults");
            this.clearContainer(resultContainer);

            if (!input) notyf.error("Ввод не может быть пустым");

            if (type === "pruferDecode") {
                graph = this.decodePrufer(input);
                GraphDrawer.draw(graph, "graphCanvas");
                this.displayMessage("Дерево построено из кода Прюфера", resultContainer);
            } else {
                graph = GraphParser.parse(input, type);

                if (!graph.adjacency || !graph.vertices) {
                    notyf.error("Некорректная структура графа");
                }

                GraphDrawer.draw(graph, "graphCanvas");
                const { code, sequence } = this.encodePrufer(graph);
                this.displayResults(code, sequence, resultContainer);
            }
        } catch (e) {
            notyf.error(`Ошибка: ${e.message}`);
        }
    }

    static displayResults(code, sequence, container) {
        if (code.length === 0) {
            this.displayMessage("Граф не является деревом!", container);
            return;
        }

        const codeElement = document.createElement("div");
        codeElement.className = "result-text";
        codeElement.textContent = `Код Прюфера: ${code.join(", ")}`;

        const sequenceElement = document.createElement("div");
        sequenceElement.className = "result-text";
        sequenceElement.textContent = `Последовательность удаления: ${sequence}`;

        container.appendChild(codeElement);
        container.appendChild(sequenceElement);
    }

    static displayMessage(message, container) {
        const messageElement = document.createElement("div");
        messageElement.className = "result-text";
        messageElement.textContent = message;
        container.appendChild(messageElement);
    }

    static clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    static encodePrufer(graph) {
        const undirectedGraph = GraphAnalyzer._convertToUndirected(graph);
        if (!GraphAnalyzer.isTree(undirectedGraph))
            notyf.error("Граф не является деревом");
        const tree = new Map();
        const degree = new Map();
        const leaves = new Set();
        const removedVertices = [];
        undirectedGraph.vertices.forEach(v => {
            tree.set(v, [...(undirectedGraph.adjacency[v] || [])]);
            degree.set(v, tree.get(v).length);
        });
        degree.forEach((d, v) => {
            if (d === 1) leaves.add(v);
        });
        const code = [];
        const n = undirectedGraph.vertices.size;
        for (let i = 0; i < n - 2; i++) {
            if (leaves.size === 0) break;
            const leaf = Math.min(...leaves);
            leaves.delete(leaf);
            removedVertices.push(leaf);
            const neighbor = tree.get(leaf).find(n => degree.get(n) > 0);
            if (!neighbor) continue;
            code.push(neighbor);
            degree.set(neighbor, degree.get(neighbor) - 1);
            degree.delete(leaf);
            tree.get(neighbor).splice(tree.get(neighbor).indexOf(leaf), 1);
            if (degree.get(neighbor) === 1) {
                leaves.add(neighbor);
            }
        }
        const sequence = removedVertices.join(", ")
        return { code, sequence };
    }

    static decodePrufer(input) {
        const code = input.split(/[,\s]+/).map(Number);
        if (code.some(isNaN)) {
            notyf.error("Некорректный код Прюфера: все элементы должны быть числами");
        }
        const n = code.length + 2;
        if (n < 2) {
            notyf.error("Некорректный код Прюфера: минимальное количество вершин - 2");
        }
        for (const num of code) {
            if (num < 1 || num > n) {
                notyf.error(`Некорректное значение ${num}. Допустимый диапазон: 1-${n}`);
            }
        }
        const vertices = new Set();
        const nodes = [...code];
        const edges = [];
        for (let i = 0; i < code.length + 2; i++) vertices.add(i + 1);
        while (nodes.length > 0) {
            const available = Array.from(vertices).filter(v =>
                !nodes.includes(v) && vertices.has(v)
            );
            if (available.length === 0) break;
            const leaf = Math.min(...available);
            const node = nodes.shift();
            edges.push([node, leaf]);
            vertices.delete(leaf);
        }
        const last = Array.from(vertices).sort((a, b) => a - b);
        if (last.length === 2) edges.push([last[0], last[1]]);
        const adjacency = edges.reduce((acc, [u, v]) => {
            const from = Number(u);
            const to = Number(v);
            acc[from] = acc[from] || [];
            acc[to] = acc[to] || [];
            if (!acc[from].includes(to)) acc[from].push(to);
            if (!acc[to].includes(from)) acc[to].push(from);
            return acc;
        }, {});
        return {
            adjacency,
            vertices: new Set([...Array(code.length + 2)].map((_, i) => i + 1)),
            weightedEdges: {}
        };
    }
}