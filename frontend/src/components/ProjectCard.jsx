import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const isNew = project.isNew;
  return (
    <div className="bg-white border border-[#eceae4] rounded-[20px] p-5 md:p-[22px] flex flex-col hover:shadow-[0_12px_28px_-18px_rgba(20,35,59,0.35)] hover:-translate-y-[2px] transition-all duration-300">
      <div className="flex justify-between items-start">
        <div
          className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-2xl"
          style={{ background: project.iconBg }}
          aria-hidden="true"
        >
          {project.icon}
        </div>
        <span
          className="text-[11px] font-bold px-[11px] py-[5px] rounded-full"
          style={{ color: project.statusColor, background: project.statusBg }}
        >
          {project.status}
        </span>
      </div>
      <div className="text-[17px] md:text-[18px] font-extrabold text-[#15233b] mt-[14px] leading-tight">
        {project.title}
      </div>
      <div className="text-[13px] text-[#837f76] mt-1">{project.subtitle}</div>
      <div className="h-2 bg-[#ece9e2] rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-[#d99a1c] rounded-full transition-all duration-700"
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <div className="flex justify-between items-baseline mt-[9px]">
        <span className="text-[15px] font-extrabold text-[#15233b]">
          {project.raisedLabel}{" "}
          <span className="text-[12px] font-medium text-[#837f76]">
            of {project.goalLabel}
          </span>
        </span>
        {project.progress >= 90 ? (
          <span className="text-[13px] text-[#1f8b57] font-bold">{project.progress}%</span>
        ) : (
          <span className="text-[13px] text-[#837f76] font-semibold">
            {project.donors > 0 ? `${project.donors} donors` : "Be the first"}
          </span>
        )}
      </div>
      <div className="mt-auto pt-4 flex gap-2">
        <button
          onClick={() => navigate(`/project/${project.id}`)}
          className="flex-1 border border-[#e7e5df] hover:border-[#15233b] bg-white text-[#15233b] text-[14px] font-bold py-3 rounded-[12px] transition-colors"
        >
          Details
        </button>
        <button
          onClick={() => navigate(`/donate?project=${project.id}`)}
          className={`flex-1 border-none text-[14px] font-extrabold py-3 rounded-[12px] transition-colors ${
            isNew
              ? "bg-[#17458b] hover:bg-[#0e2a52] text-white"
              : "bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05]"
          }`}
        >
          {isNew ? "Donate first" : "Donate"}
        </button>
      </div>
    </div>
  );
}
