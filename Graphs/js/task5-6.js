class Task56 {
    static graph = null;
    static correctComponents = 0;

    static execute() {
        try {
            const input = document.getElementById("graphInput").value.trim();
            if (!input) {
                notyf.error("Введите данные графа");
                return;
            }
            const type = document.getElementById("inputType").value.replace('Weighted', '');
            this.graph = GraphParser.parse(input, type);

            // Явное преобразование вершин к числам
            this.graph.vertices = new Set(Array.from(this.graph.vertices).map(Number));

            this.correctComponents = GraphAnalyzer.findConnectedComponents(this.graph);
            this.displayComponentsCount();
            GraphDrawer.draw(this.graph);
        } catch (e) {
            notyf.error(e.message);
        }
    }

    static validate() {
        try {
            const userInput = parseInt(document.getElementById("userComponents").value);
            this.displayValidationResult(userInput === this.correctComponents);
        } catch (e) {
            notyf.error(e.message);
        }
    }

    static displayComponentsCount() {
        const container = document.getElementById("componentsCount");
        this.clearContainer(container);

        const countElement = document.createElement("div");
        countElement.className = "result-text";
        countElement.textContent = this.correctComponents;

        container.appendChild(countElement);
    }

    static displayValidationResult(isValid) {
        const container = document.getElementById("validationResult");
        this.clearContainer(container);

        const resultSpan = document.createElement("span");
        resultSpan.className = isValid ? "correct" : "error";

        const icon = document.createTextNode(isValid ? "✓ " : "✗ ");

        isValid ? notyf.success(`Верно! Компонент: ${this.correctComponents}`)
            : notyf.error(`Неверно! Правильный ответ: ${this.correctComponents}`)

        resultSpan.appendChild(icon);
        resultSpan.appendChild(text);
        container.appendChild(resultSpan);
    }

    static clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}