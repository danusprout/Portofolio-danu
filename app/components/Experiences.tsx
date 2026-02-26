"use client";

// Experiences.tsx
import { useState, useEffect } from "react";
import { CalendarDays, Briefcase, GraduationCap } from "lucide-react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { experiences as experienceItem } from "@/app/data/experiences"; // Import experiences data
import type { Experience } from "@/app/data/experiences"; // Import Experience type
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const ExperienceItem = ({
  experience,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  experience: Experience;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const Icon = experience.type === "work" ? Briefcase : GraduationCap;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-10 pb-8 pt-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Vertical Line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 border-2 border-[#273344] ${
          isHovered ? "bg-[#F43F5E]" : "bg-[#273344]"
        }`}
      />

      {/* Circular Icon */}
      <div
        className={`absolute left-0 top-0 -translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 shadow-lg transition-all duration-300 border-2 ${
          isHovered
            ? "border-[#F43F5E] bg-[#F43F5E] rotate-12"
            : "border-[#273344] bg-[#131821]"
        }`}
      >
        <Icon
          className={`w-4 h-4 transition-colors duration-300 ${
            isHovered ? "text-white" : "text-slate-400"
          }`}
        />
      </div>

      {/* Content Box */}
      <div
        className={`rounded-lg p-6 transition-all duration-300 border-2 ${
          isHovered
            ? "border-[#F43F5E] bg-[#F43F5E]/5 backdrop-blur-md"
            : "border-[#273344] bg-[#131821]/80 backdrop-blur-md"
        }`}
      >
        {/* Date */}
        <div className="flex items-center mb-3">
          <CalendarDays className="w-4 h-4 text-slate-500 mr-2" />
          <p
            className={`text-sm transition-colors duration-300 ${
              isHovered ? "text-[#F43F5E]" : "text-slate-500"
            }`}
          >
            {experience.date}
          </p>
        </div>

        {/* Title and Company */}
        <h3 className="text-xl font-bold text-white mb-1">
          {experience.title}
        </h3>
        <h4 className="text-lg font-medium text-slate-300 mb-4">
          {experience.company}
        </h4>

        {/* Description */}
        <p className="text-slate-400 leading-relaxed">
          {experience.description}
        </p>

        {/* Skills */}
        {experience.skills && experience.skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {experience.skills.map((skill) => (
              <span
                key={skill.id}
                className={`px-3 py-1 text-sm font-medium transition-colors duration-300 border ${
                  isHovered
                    ? "border-[#F43F5E] text-[#F43F5E] bg-[#F43F5E]/10"
                    : "border-[#273344] text-slate-300 bg-[#273344]/30"
                }`}
              >
                {skill.title}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <span className="text-sm text-slate-500 italic">No skills listed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function Experiences() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [experiencesData, setExperiencesData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setExperiencesData(experienceItem);
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
          <div key={i} className="relative pl-10 pb-8 pt-2">
            <Skeleton className="absolute left-0 top-0 h-full w-1" />
            <Skeleton className="absolute left-0 top-0 -translate-x-1/2 h-8 w-8 rounded-full" />
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-20 w-full" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-6 w-20" />
                ))}
              </div>
            </div>
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
        <div className="text-[#F43F5E] text-4xl">
          <HiOutlineOfficeBuilding />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Experiences</h2>
          <p className="text-lg mt-2 text-slate-400">
            My professional journey.
          </p>
        </div>
      </div>

      <div className="relative py-8">
        {experiencesData.map((exp, index) => (
          <ExperienceItem
            key={exp.id}
            experience={exp}
            index={index}
            isHovered={hoveredId === exp.id}
            onMouseEnter={() => setHoveredId(exp.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}
      </div>
    </motion.div>
  );
}
