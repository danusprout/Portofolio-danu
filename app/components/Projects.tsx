import { projects as projectItem } from "@/app/data/projects";
import type { Projects } from "@/app/data/projects";
import { useEffect, useState, useCallback, useRef } from "react";
import { HiOutlineBeaker, HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Tetris Animation Component
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

const TetrisAnimation = () => {
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
    const startX = Math.floor(Math.random() * (maxX + 1));

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
            newGrid[piece.y + y][piece.x + x] = piece.color;
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

  // Calculate grid container size to ensure full coverage
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

// ProjectItem Component
const ProjectItem = ({
  project,
  index,
}: {
  project: Projects;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(new Date(date));
  };

  return (
    <>
      <div
        className="transform cursor-pointer transition-all duration-300 group"
        onClick={() => setIsDialogOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-64 overflow-hidden border-2 border-[#273344] bg-[#131821]/80 backdrop-blur-md group-hover:border-[#FFA23E] transition-colors">
          <div className="flex h-full flex-col md:flex-row">
            {/* Content Section */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-3">
                  {project.description}
                </p>
              </div>
              {project.skills && project.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-0.5 text-xs font-medium border border-[#273344] text-slate-300 bg-[#273344]/30"
                    >
                      {skill.title}
                    </span>
                  ))}
                  {project.skills.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-slate-500">
                      +{project.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Animation Section */}
            <div className="w-full md:w-1/2 h-full bg-[#1a2332] relative overflow-hidden">
              <div className="absolute inset-0">
                <TetrisAnimation />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#131821] via-transparent to-transparent" />
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute top-4 right-4 transform opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center space-x-2 bg-[#273344] px-4 py-2">
              <span className="text-sm text-white">View Details</span>
              <HiOutlineExternalLink className="text-white text-lg" />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#131821] border-[#273344] text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {project.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              <div className="mt-4 space-y-4">
                {/* Date */}
                <div className="text-sm text-slate-400">
                  {formatDate(new Date(project.date))}
                </div>

                {/* Project Image */}
                {project.imageUrl && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <p className="text-slate-300">{project.description}</p>

                {/* Skills */}
                {project.skills && (
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-1 text-xs font-semibold rounded-md bg-[#273344] text-slate-200"
                      >
                        {skill.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Visit Button */}
                <div className="flex justify-end pt-4">
                  <Button asChild className="bg-[#273344] hover:bg-[#354459]">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      Visit Project
                      <HiOutlineExternalLink className="ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Main Projects Component
export default function Projects() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProjects(projectItem);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-auto mt-12 mb-8 lg:ml-[-1.25em] flex items-center space-x-4 text-white">
        <div className="text-[#FFA23E] text-4xl">
          <HiOutlineBeaker />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="text-lg mt-2 text-slate-400">
            Here are some projects I&apos;ve built.
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <ProjectItem key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
