class Task9 {
    static graph = null;

    static execute() {
        try {
            const input = document.getElementById("graphInput").value.trim();
            const type = document.getElementById("inputType").value.replace('Weighted','');

            this.graph = GraphParser.parseWeightedGraph(input, type);
            WeightedGraphDrawer.draw(this.graph, "graphCanvas");
            this.displayShortestPathsMatrix();
        } catch (e) {
            this.showError(`Ошибка: ${e.message}`, 'matrixContainer');
        }
    }

    static displayShortestPathsMatrix() {
        const container = document.getElementById("matrixContainer");
        this.clearContainer(container);

        const vertices = Array.from(this.graph.vertices).sort((a, b) => a - b);
        const matrix = vertices.map(start =>
            GraphAnalyzer.dijkstra(this.graph, start).distances
        );

        const table = document.createElement("table");
        const thead = this.createTableHeader(vertices);
        const tbody = this.createTableBody(vertices, matrix);

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
    }

    static createTableHeader(vertices) {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        // Пустая ячейка для угла
        const corner = document.createElement("th");
        corner.textContent = "→";
        headerRow.appendChild(corner);

        // Заголовки столбцов
        vertices.forEach(v => {
            const th = document.createElement("th");
            th.textContent = v;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        return thead;
    }

    static createTableBody(vertices, matrix) {
        const tbody = document.createElement("tbody");

        vertices.forEach((v, i) => {
            const row = document.createElement("tr");

            // Заголовок строки
            const rowHeader = document.createElement("th");
            rowHeader.textContent = v;
            row.appendChild(rowHeader);

            // Ячейки данных
            vertices.forEach((u, j) => {
                const td = document.createElement("td");
                const dist = matrix[i][u];

                if (dist === Infinity) {
                    const span = document.createElement("span");
                    span.className = "inf";
                    span.textContent = "∞";
                    td.appendChild(span);
                } else {
                    td.textContent = dist;
                }

                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        return tbody;
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
}