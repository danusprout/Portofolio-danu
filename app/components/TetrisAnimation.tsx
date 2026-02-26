import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const COLORS = [
  "#F43F5E", // Red
  "#10B981", // Green
  "#FFA23E", // Orange
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

const SHAPES = [
  [
    [1, 1],
    [1, 1],
  ], // Square
  [[1, 1, 1, 1]], // I-piece horizontal
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ], // L-piece
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ], // J-piece
  [
    [1, 1, 1],
    [0, 1, 0],
  ], // T-piece
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z-piece
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S-piece
  [[1], [1], [1], [1]], // I-piece vertical
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L-piece variant
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J-piece variant
  [
    [1, 1],
    [1, 0],
    [1, 0],
  ], // L-piece rotated
  [
    [1, 1],
    [0, 1],
    [0, 1],
  ], // J-piece rotated
  [
    [1, 0],
    [1, 1],
    [1, 0],
  ], // Cross piece
  [
    [1, 1, 1],
    [1, 0, 1],
  ], // U-piece
];

export const TetrisAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [gridSize, setGridSize] = useState({ rows: 8, cols: 12 });
  const [blockSize, setBlockSize] = useState(0);
  const [grid, setGrid] = useState<string[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    x: number;
    y: number;
  } | null>(null);

  // Update dimensions and grid when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;

        // Calculate block size based on available space and desired grid ratio
        const horizontalBlockSize = Math.floor(offsetWidth / 15);
        const verticalBlockSize = Math.floor(offsetHeight / 11);
        const newBlockSize = Math.min(horizontalBlockSize, verticalBlockSize);

        // Calculate actual grid dimensions
        const cols = Math.floor(offsetWidth / newBlockSize);
        const rows = Math.floor(offsetHeight / newBlockSize);

        setDimensions({ width: offsetWidth, height: offsetHeight });
        setGridSize({ rows, cols });
        setBlockSize(newBlockSize);

        // Initialize grid with new dimensions
        setGrid(
          Array(rows)
            .fill(null)
            .map(() => Array(cols).fill(""))
        );
      }
    };

    updateDimensions();

    // Store ref value
    const currentRef = containerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateDimensions);
    });

    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  const createNewPiece = useCallback(() => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const maxX = gridSize.cols - shape[0].length;
    let startX = Math.floor(Math.random() * (maxX + 1));
    if (startX < 0) startX = 0; // Fallback in case cols is 0 initially

    return {
      shape,
      color,
      x: startX,
      y: 0,
    };
  }, [gridSize.cols]);
  
  const isValidMove = useCallback(
    (piece: typeof currentPiece, newX: number, newY: number) => {
      if (!piece) return false;
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const nextX = newX + x;
            const nextY = newY + y;
            if (
              nextX < 0 ||
              nextX >= gridSize.cols ||
              nextY >= gridSize.rows ||
              (nextY >= 0 && grid[nextY]?.[nextX])
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [grid, gridSize.cols, gridSize.rows]
  );

  const placePiece = useCallback(
    (piece: NonNullable<typeof currentPiece>) => {
      const newGrid = grid.map((row) => [...row]);
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            if (newGrid[piece.y + y] && newGrid[piece.y + y][piece.x + x] !== undefined) {
               newGrid[piece.y + y][piece.x + x] = piece.color;
            }
          }
        }
      }

      // Check for complete lines
      const filledLines = newGrid.reduce((lines, row, index) => {
        if (row.every((cell) => cell !== "")) {
          lines.push(index);
        }
        return lines;
      }, [] as number[]);

      // Remove complete lines and add new empty rows
      if (filledLines.length > 0) {
        const filteredGrid = newGrid.filter(
          (_, index) => !filledLines.includes(index)
        );
        const emptyRows = Array(filledLines.length)
          .fill(null)
          .map(() => Array(gridSize.cols).fill(""));
        setGrid([...emptyRows, ...filteredGrid]);
      } else {
        setGrid(newGrid);
      }
    },
    [grid, gridSize.cols]
  );

  useEffect(() => {
    if (gridSize.cols === 0 || gridSize.rows === 0) return;

    if (!currentPiece) {
      setCurrentPiece(createNewPiece());
      return;
    }

    const interval = setInterval(() => {
      if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
      } else {
        if (currentPiece.y === 0) {
          setGrid(
            Array(gridSize.rows)
              .fill(null)
              .map(() => Array(gridSize.cols).fill(""))
          );
        } else {
          placePiece(currentPiece);
        }
        setCurrentPiece(createNewPiece());
      }
    }, 500);

    return () => clearInterval(interval);
  }, [
    currentPiece,
    createNewPiece,
    isValidMove,
    placePiece,
    gridSize.rows,
    gridSize.cols,
  ]);

  const gridStyle = {
    width: `${blockSize * gridSize.cols}px`,
    height: `${blockSize * gridSize.rows}px`,
    margin: "auto",
  };

  const BlockElement = ({ color }: { color: string }) => (
    <div
      className="relative group transition-all duration-300"
      style={{
        width: `${blockSize}px`,
        height: `${blockSize}px`,
      }}
    >
      {/* Main block with colored border */}
      <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm">
        {/* Outer border with color */}
        <div
          className="absolute inset-0 border-2 transition-all duration-300"
          style={{ borderColor: color }}
        />

        {/* Inner highlight border */}
        <div className="absolute inset-[2px] " />

        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 transition-all duration-300"
          style={{ borderColor: color }}
        />
        <div
          className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 transition-all duration-300"
          style={{ borderColor: color }}
        />
        <div
          className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 transition-all duration-300"
          style={{ borderColor: color }}
        />
        <div
          className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 transition-all duration-300"
          style={{ borderColor: color }}
        />
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-900/50 relative overflow-hidden flex items-center justify-center backdrop-blur-sm"
    >
      <div className="relative rounded-lg overflow-hidden" style={gridStyle}>
        {/* Grid background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-900/30" />

        {/* Grid cells */}
        {grid.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) =>
              cell ? (
                <BlockElement key={`${x}-${y}`} color={cell} />
              ) : (
                <div
                  key={`${x}-${y}`}
                  className="border border-gray-700/20"
                  style={{
                    width: `${blockSize}px`,
                    height: `${blockSize}px`,
                  }}
                />
              )
            )}
          </div>
        ))}

        {/* Current piece */}
        {currentPiece && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: `${currentPiece.x * blockSize}px`,
              top: `${currentPiece.y * blockSize}px`,
            }}
          >
            {currentPiece.shape.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, cellIndex) =>
                  cell ? (
                    <motion.div
                      key={cellIndex}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: (rowIndex + cellIndex) * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <BlockElement color={currentPiece.color} />
                    </motion.div>
                  ) : (
                    <div
                      key={cellIndex}
                      style={{
                        width: `${blockSize}px`,
                        height: `${blockSize}px`,
                      }}
                    />
                  )
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
