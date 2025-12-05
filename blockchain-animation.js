// Blockchain Network Animation
class BlockchainAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.blocks = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // Setup canvas
        this.canvas.id = 'blockchain-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        document.addEventListener('click', (e) => this.createBlockOnClick(e));

        // Create initial nodes
        this.createNodes(30);
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNodes(count) {
        for (let i = 0; i < count; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
                connections: []
            });
        }
    }

    createBlockOnClick(e) {
        const block = {
            x: e.clientX,
            y: e.clientY,
            size: 40,
            alpha: 1,
            rotation: 0,
            vx: (Math.random() - 0.5) * 2,
            vy: -2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            pulsePhase: 0
        };
        this.blocks.push(block);

        // Create ripple effect
        this.createRipple(e.clientX, e.clientY);
    }

    createRipple(x, y) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.nodes.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    radius: Math.random() * 2 + 1,
                    connections: [],
                    life: 100
                });
            }, i * 100);
        }
    }

    drawNodes() {
        this.nodes.forEach((node, i) => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Boundary check
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Mouse interaction
            const dx = this.mouseX - node.x;
            const dy = this.mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                node.x -= (dx / distance) * force * 2;
                node.y -= (dy / distance) * force * 2;
            }

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#1a2332';
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(26, 35, 50, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Draw connections
            for (let j = i + 1; j < this.nodes.length; j++) {
                const other = this.nodes[j];
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(other.x, other.y);
                    const opacity = (1 - distance / 150) * 0.3;
                    this.ctx.strokeStyle = `rgba(26, 35, 50, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }

            // Handle node life
            if (node.life !== undefined) {
                node.life--;
                if (node.life <= 0) {
                    this.nodes.splice(i, 1);
                }
            }
        });
    }

    drawBlocks() {
        this.blocks = this.blocks.filter(block => {
            block.x += block.vx;
            block.y += block.vy;
            block.vy += 0.1; // Gravity
            block.rotation += block.rotationSpeed;
            block.alpha -= 0.01;
            block.pulsePhase += 0.1;

            if (block.alpha <= 0) return false;

            const pulse = Math.sin(block.pulsePhase) * 5;
            const size = block.size + pulse;

            this.ctx.save();
            this.ctx.translate(block.x, block.y);
            this.ctx.rotate(block.rotation);

            // Draw blockchain block
            this.ctx.globalAlpha = block.alpha;
            
            // Outer glow
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = 'rgba(26, 35, 50, 0.8)';
            
            // Block
            this.ctx.fillStyle = '#1a2332';
            this.ctx.fillRect(-size / 2, -size / 2, size, size);
            
            // Border
            this.ctx.strokeStyle = 'rgba(26, 35, 50, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(-size / 2, -size / 2, size, size);

            // Inner lines (blockchain pattern)
            this.ctx.strokeStyle = 'rgba(61, 74, 92, 0.6)';
            this.ctx.lineWidth = 1;
            for (let i = -size / 4; i < size / 2; i += size / 4) {
                this.ctx.beginPath();
                this.ctx.moveTo(-size / 2, i);
                this.ctx.lineTo(size / 2, i);
                this.ctx.stroke();
            }

            // Hash symbol
            this.ctx.fillStyle = 'rgba(61, 74, 92, 0.8)';
            this.ctx.font = 'bold 12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('#', 0, 0);

            this.ctx.restore();

            return true;
        });
    }

    drawGrid() {
        const gridSize = 50;
        const offset = Date.now() * 0.01;
        
        this.ctx.strokeStyle = 'rgba(26, 35, 50, 0.05)';
        this.ctx.lineWidth = 1;

        for (let x = (offset % gridSize) - gridSize; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = (offset % gridSize) - gridSize; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.drawNodes();
        this.drawBlocks();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlockchainAnimation();
    });
} else {
    new BlockchainAnimation();
}
