interface RenderOptions {
    initialValues?: string | undefined;
    superElement?: string | Readonly<Node> | null | undefined;
    showPoints: boolean;
    size: number;
}

interface CanvasRenderingContext2D {
    curve(
        points: readonly number[],
        tension: number | undefined,
        numOfSeg: number | undefined,
        close: boolean
    ): Float32Array;
}

class GenderSquare {
    private static readonly codingStr =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    static readonly pointRadius = 3;

    private readonly context: CanvasRenderingContext2D;
    readonly element: HTMLCanvasElement;
    points: number[] = [];
    showPoints: boolean;

    #tension = 0.5;

    get tension(): number {
        return this.#tension;
    }
    set tension(newValue: number) {
        this.#tension = Math.max(0, Math.min(newValue, 1));
        if (Number.isNaN(this.#tension)) this.#tension = 0.5;
    }

    constructor(
        options: RenderOptions
    ) {
        let container: Node | null | undefined;
        if (typeof options.superElement == 'string')
            container = document.querySelector(options.superElement);
        else
            container = options.superElement;

        this.element = document.createElement('canvas');
        this.element.id = 'square';
        this.element.width = options.size;
        this.element.height = options.size;
        container?.appendChild(this.element);

        this.context = this.element.getContext('2d')!;
        this.context.lineJoin = 'round';
        this.context.translate(0.5, 0.5);

        this.showPoints = options.showPoints;

        if (options.initialValues !== undefined) this.loadData(options.initialValues);
    }

    loadData(data: string) {
        const width = this.element.width;
        const maxVal = GenderSquare.codingStr.length - 1;

        if (data.length % 2) {
            this.#tension = Math.round(
                GenderSquare.codingStr.indexOf(data[data.length - 1]) * 100 / maxVal
            ) / 100;
            data = data.substring(0, data.length - 1);
        }

        this.points = [...data].map(el =>
            Math.round(GenderSquare.codingStr.indexOf(el) * width / maxVal)
        );
    }

    saveData(): string {
        const width = this.element.width;
        const maxVal = GenderSquare.codingStr.length - 1;

        return this.points.map(el =>
            GenderSquare.codingStr[Math.round(el * maxVal / width)]
        ).join('') + GenderSquare.codingStr[Math.round(this.#tension * maxVal)];
    }

    redraw() {
        this.context.clearRect(-1, -1, this.element.width + 2, this.element.height + 2);

        this.context.beginPath();
        this.context.moveTo(this.points[0], this.points[1]);
        this.context.curve(this.points, 1 - this.#tension, 25, true);
        this.context.closePath();

        this.context.strokeStyle = 'yellow';
        this.context.lineWidth = GenderSquare.pointRadius;
        this.context.fillStyle = 'rgba(0 0 0/0.2)';
        this.context.fill();
        this.context.stroke();

        if (this.showPoints) {
            this.context.lineWidth = 1;
            for (let i = 0; i < this.points.length; i += 2) {
                this.context.strokeStyle = 'black';
                this.context.strokeRect(
                    this.points[i] - GenderSquare.pointRadius,
                    this.points[i + 1] - GenderSquare.pointRadius,
                    GenderSquare.pointRadius * 2,
                    GenderSquare.pointRadius * 2
                );
            }
        }
    }
}
