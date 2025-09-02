export type PipelineStage =
  | "APPLIED"
  | "INTERVIEWED"
  | "SOURCED"
  | "OFFERED"
  | "HIRED"
  | "REJECTED";

export type Candidate = {
  id: number;
  name: string;
  role: string;
  location: string;
  experienceYears: number;
  skills: string[];
  pipelineStage: PipelineStage;
  createdAt?: string; 
  updatedAt: string; 
};
