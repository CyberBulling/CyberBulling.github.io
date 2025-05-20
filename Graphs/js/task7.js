class Task7 {
    static graph = null;
    static mst = null;

    static execute() {
        try {
            const input = document.getElementById("graphInput").value.trim();
            const type = document.getElementById("inputType").value.replace('Weighted','');
            this.graph = GraphParser.parseWeightedGraph(input, type);

            WeightedGraphDrawer.draw(this.graph, "originalCanvas");

            this.mst = GraphAnalyzer.kruskalMST(this.graph);
            this.drawMST();
            this.displayResults();
        } catch (e) {
            this.showError(e.message, 'mstResults');
        }
    }

    static drawMST() {
        const mstGraph = {
            ...this.graph,
            adjacency: {},
            weightedEdges: {}
        };

        this.mst.forEach(({ from, to, weight }) => {
            mstGraph.adjacency[from] = mstGraph.adjacency[from] || [];
            mstGraph.adjacency[from].push(to);

            mstGraph.weightedEdges[from] = mstGraph.weightedEdges[from] || [];
            mstGraph.weightedEdges[from].push({ to, weight, color: "#e74c3c" });
        });

        WeightedGraphDrawer.draw(mstGraph, "resultCanvas");
    }

    static displayResults() {
        const container = document.getElementById("mstResults");
        this.clearContainer(container);

        const heading = document.createElement("h3");
        heading.textContent = "Минимальное остовное дерево:";
        container.appendChild(heading);

        const list = document.createElement("ul");
        list.className = "mst-list";

        this.mst.forEach(edge => {
            const listItem = document.createElement("li");
            listItem.textContent = `${edge.from} → ${edge.to} (вес: ${edge.weight})`;
            list.appendChild(listItem);
        });

        container.appendChild(list);
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

    static highlightMST(mst) {
        mst.forEach(edge => {
            this.graph.weightedEdges[edge.from].find(
                e => e.to === edge.to
            ).color = "#e74c3c";
        });
        WeightedGraphDrawer.draw(this.graph);
    }
}