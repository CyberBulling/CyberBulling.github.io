class GraphDrawer {
    static config = {
        nodeRadius: 20,
        edgeColor: "#7f8c8d",
        arrowSize: 10,
        canvasWidth: 800,
        canvasHeight: 600,
        curveOffset: 10,
        nodeLabelOffset: -35, // Смещение текста над вершиной
        colors: {
            node: "green",
            highlight: "#e74c3c",
            weightText: "black"
        }
    };

    static draw(graph, canvasId = "graphCanvas") {
        const canvas = document.getElementById(canvasId);
        this.config.canvasHeight = canvas.height;
        this.config.canvasHeight = canvas.height;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const positions = this.calculatePositions(graph, canvas);
        this.drawEdges(ctx, graph, positions);
        this.drawNodes(ctx, graph, positions);
    }

    static calculatePositions(graph, canvas) {
        const vertices = Array.from(graph.vertices);
        const positions = {};
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 3;

        for (let i = 0; i < vertices.length; i++) { // for вместо reduce
            const v = vertices[i];
            const angle = (i * 2 * Math.PI) / vertices.length;
            positions[v] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        }
        return positions;
    }

    static drawEdges(ctx, graph, positions) {
        const drawn = new Set();

        for (const [fromId, neighbors] of Object.entries(graph.adjacency)) {
            for (const toId of neighbors) {
                const key = `${fromId}-${toId}`;
                if (drawn.has(key)) continue;

                const start = positions[fromId];
                const end = positions[toId];
                this.drawCurvedEdge(ctx, fromId, toId, start, end, graph);
                drawn.add(key);
            }
        }
    }

    static drawCurvedEdge(ctx, fromId, toId, start, end, graph) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const baseAngle = Math.atan2(dy, dx);

        // Корректировка точек начала и конца
        const adjustedStart = {
            x: start.x + Math.cos(baseAngle) * this.config.nodeRadius,
            y: start.y + Math.sin(baseAngle) * this.config.nodeRadius
        };

        const adjustedEnd = {
            x: end.x - Math.cos(baseAngle) * this.config.nodeRadius,
            y: end.y - Math.sin(baseAngle) * this.config.nodeRadius
        };

        // Проверка типа связи
        const isBidirectional = graph.adjacency[toId]?.includes(Number(fromId));


        // Рассчитываем контрольную точку
        const cp = {
            x: (adjustedStart.x + adjustedEnd.x) / 2,
            y: (adjustedStart.y + adjustedEnd.y) / 2
        };

        // Рисуем кривую
        ctx.beginPath();
        ctx.moveTo(adjustedStart.x, adjustedStart.y);
        ctx.quadraticCurveTo(cp.x, cp.y, adjustedEnd.x, adjustedEnd.y);
        ctx.stroke();

        // Рисуем стрелку только для направленных или взвешенных рёбер
        if (!isBidirectional) {
            const arrowAngle = Math.atan2(adjustedEnd.y - cp.y, adjustedEnd.x - cp.x);
            this.drawArrow(ctx, adjustedEnd.x, adjustedEnd.y, arrowAngle);
        }
    }


    static drawArrow(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Рисуем треугольник стрелки
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.config.arrowSize * 2, -this.config.arrowSize);
        ctx.lineTo(-this.config.arrowSize * 2, this.config.arrowSize);
        ctx.closePath();
        ctx.fillStyle = this.config.edgeColor;
        ctx.fill();

        ctx.restore();
    }


    static drawNodes(ctx, graph, positions) {
        Object.entries(positions).forEach(([v, pos]) => {
            // Отрисовка узла
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.config.nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.config.colors.node;
            ctx.fill();

            // ID вершины
            ctx.fillStyle = "black ";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(v, pos.x, pos.y);

            // Степень вершины сверху
            const degree = graph.adjacency[v]?.length || 0;
            ctx.fillStyle = this.config.colors.degreeText;
            ctx.font = "bold 14px Arial";
            ctx.textBaseline = "bottom";
            ctx.fillText(
                degree,
                pos.x,
                pos.y + this.config.nodeLabelOffset
            );
        });
    }
}

class WeightedGraphDrawer extends GraphDrawer {
    static draw(graph, canvasId = "graphCanvas") {
        super.draw(graph, canvasId);
        this.drawWeights(graph, canvasId);
    }

    static drawWeights(graph, canvasId) {
        const canvas = document.getElementById(canvasId);
        this.config.canvasHeight = canvas.height;
        this.config.canvasHeight = canvas.height;
        const ctx = canvas.getContext("2d");
        const positions = this.calculatePositions(graph, canvas);

        Object.entries(graph.weightedEdges).forEach(([from, edges]) => {
            edges.forEach(({ to, weight }) => {
                const start = positions[from];
                const end = positions[to];

                // Расчёт контрольной точки кривой
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const baseAngle = Math.atan2(dy, dx);
                const isBidirectional = graph.adjacency[to]?.includes(Number(from));
                const curveSign = isBidirectional ? -1 : 0;

                const cp = {
                    x: (start.x + end.x) / 2 - dy * this.config.curveOffset / 50 * curveSign,
                    y: (start.y + end.y) / 2 + dx * this.config.curveOffset / 50 * curveSign
                };

                // Новое смещение (уменьшено с 35 до 15)
                const offset = -10;
                const textAngle = Math.atan2(cp.y - (start.y + end.y) / 2, cp.x - (start.x + end.x) / 2);

                // Позиция текста ближе к ребру
                const textX = cp.x + Math.cos(textAngle) * offset;
                const textY = cp.y + Math.sin(textAngle) * offset;

                // Отрисовка
                ctx.save();
                ctx.translate(textX, textY);

                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.strokeText(weight, 0, 0);
                ctx.fillStyle = this.config.colors.weightText;
                ctx.font = "bold 15px Arial";
                ctx.textAlign = "center";
                ctx.fillText(weight, 0, 0);
                ctx.restore();
            });
        });
    }


    static calculateControlPoint(start, end, graph) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const isBidirectional = graph.adjacency[end]?.includes(Number(start));
        const curveSign = isBidirectional ? -1 : 0;

        return {
            x: (start.x + end.x) / 2 - dy * this.config.curveOffset / 50 * curveSign,
            y: (start.y + end.y) / 2 + dx * this.config.curveOffset / 50 * curveSign
        };
    }
}