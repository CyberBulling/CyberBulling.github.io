class ColoredGraphDrawer extends GraphDrawer {
    static draw(graph, canvasId = "graphCanvas") {
        const canvas = document.getElementById(canvasId);
        this.config.canvasHeight = canvas.height;
        this.config.canvasWidth = canvas.width;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const positions = this.calculatePositions(graph, canvas);
        this.drawEdges(ctx, graph, positions);
        this.drawColoredNodes(ctx, graph, positions);
    }

    static drawColoredNodes(ctx, graph, positions) {
        Object.entries(positions).forEach(([v, pos]) => {
            const color = graph.nodeColors?.[v] !== undefined
                ? GraphColorer.getColorHex(graph.nodeColors[v])
                : this.config.colors.node;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.config.nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(v, pos.x, pos.y);
            const degree = graph.adjacency[v]?.length || 0;
            ctx.fillStyle = "black";
            ctx.font = "bold 14px Arial";
            ctx.fillText(degree, pos.x, pos.y + this.config.nodeLabelOffset);
        });
    }
}

class GraphColorer {
    static execute() {
        try {
            const input = document.getElementById("graphInput").value.trim();
            if (!input) {
                notyf.error("Введите данные графа");
                return;
            }
            const type = document.getElementById("inputType").value;
            type.replace('Weighted', '')
            const graph = GraphParser.parse(input, type);
            const undirectedGraph = GraphAnalyzer._convertToUndirected(graph);
            const { colors, chromaticNumber } = this.colorGraph(undirectedGraph);
            ColoredGraphDrawer.draw(this.addColorsToGraph(graph, colors), "graphCanvas");
            this.displayColors(colors, chromaticNumber);
        } catch (e) {
            notyf.error(`Ошибка: ${e.message}`);
        }
    }
    static displayColors(colors, chromaticNumber) {
        const container = document.getElementById("colors");
        this.clearContainer(container);
        const header = document.createElement("h3");
        header.textContent = `Хроматическое число: ${chromaticNumber}`;
        container.appendChild(header);
        const colorsContainer = document.createElement("div");
        Object.entries(colors).forEach(([v, color]) => {
            const colorItem = document.createElement("div");
            colorItem.style.display = "flex";
            colorItem.style.alignItems = "center";
            colorItem.style.marginBottom = "5px";
            const colorBox = document.createElement("div");
            colorBox.className = "color-box";
            colorBox.style.background = this.getColorHex(color);
            colorBox.style.width = "20px";
            colorBox.style.height = "20px";
            colorBox.style.marginRight = "5px";
            const text = document.createElement("span");
            text.textContent = `Вершина ${v}`;
            colorItem.appendChild(colorBox);
            colorItem.appendChild(text);
            colorsContainer.appendChild(colorItem);
        });
        container.appendChild(colorsContainer);
    }
    static clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    static colorGraph(graph) {
        const vertices = Array.from(graph.vertices).map(Number).sort((a, b) => {
            const degreeA = graph.adjacency[a]?.length || 0;
            const degreeB = graph.adjacency[b]?.length || 0;
            return degreeB - degreeA;
        });
        const colors = {};
        let chromaticNumber = 0;
        vertices.forEach(v => {
            const neighbors = graph.adjacency[v] || [];
            const neighborColors = new Set(
                neighbors.map(n => colors[n]).filter(c => c !== undefined)
            );
            let color = 0;
            while (neighborColors.has(color)) color++;
            colors[v] = color;
            chromaticNumber = Math.max(chromaticNumber, color + 1);
        });
        return { colors, chromaticNumber };
    }
    static addColorsToGraph(graph, colors) {
        return {
            ...graph,
            nodeColors: colors
        };
    }
    static displayColors(colors, chromaticNumber) {
        const container = document.getElementById("colors");
        this.clearContainer(container);
        const header = document.createElement("h3");
        header.textContent = `Хроматическое число: ${chromaticNumber}`;
        container.appendChild(header);
        const colorsContainer = document.createElement("div");
        Object.entries(colors).forEach(([v, color]) => {
            const colorItem = document.createElement("div");
            colorItem.style.display = "flex";
            colorItem.style.alignItems = "center";
            colorItem.style.marginBottom = "5px";
            const colorBox = document.createElement("div");
            colorBox.className = "color-box";
            colorBox.style.backgroundColor = this.getColorHex(color);
            colorBox.style.width = "20px";
            colorBox.style.height = "20px";
            colorBox.style.marginRight = "5px";
            const text = document.createElement("span");
            text.textContent = `Вершина ${v}`;
            colorItem.append(colorBox, text);
            colorsContainer.appendChild(colorItem);
        });
        container.append(header, colorsContainer);
    }
    static getColorHex(index) {
        const palette = [
            "#00a97b", "#00ccff", "#d000ff",
            "#2b744e", "#0006ff", "#fcf236",
            "#d2457c", "#a2665d", "#6852a2",
            "#46748d", "#00ff30", "#7c87c3",
            "#9bbed4", "#de83ab", "#3461ad",
            "#909ea9", "#f57f2a", "#00ffa2",
            "#ff1100", "#602718"
        ];
        return palette[index % palette.length];
    }
}