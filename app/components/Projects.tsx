import { projects as projectItem } from "@/app/data/projects";
import type { Project } from "@/app/data/projects";
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
import { Skeleton } from "@/components/ui/skeleton";

import { TetrisAnimation } from "./TetrisAnimation";

// ProjectItem Component
const ProjectItem = ({
  project,
  index,
}: {
  project: Project;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(projectItem);
    setLoading(false);
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
