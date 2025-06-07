// src/types/index.ts – centralised domain models

/* ─────────── ENUMS ─────────── */
export const EpicStatuses = [
  'Not started',
  'Backlog refinement',
  'Ready for dev',
  'Implementing',
  'SIT',
  'Last mile',
  'Done',
  'Cancelled',
] as const;
export type EpicStatus = (typeof EpicStatuses)[number];

export const UserStoryStatuses = [
  'Planning',
  'Ready for dev',
  'Implementing',
  'SIT',
  'Last mile',
  'Done',
] as const;
export type UserStoryStatus = (typeof UserStoryStatuses)[number];

/* ─────────── CORE ENTITIES ─────────── */
export interface Person {
  id: number;
  name: string;
  mail: string;
  role: string;
}

export interface Sprint {
  id: number;
  name: string;
  startDate: string; // ISO string to ease (de)serialise
  endDate: string;
}

export interface ResourceAllocation {
  id: number;
  epicId: number;
  personId: number;
  personName: string;
  personRole: string;
  sprintId: number;
  sprintName: string;
  fte: number;
}

export interface Cost {
  id: string;
  name: string;
  type: 'Cloud' | 'Outsource' | 'Other';
  amount: number;
  epicId: number;
  workItemId?: number; // Add workItemId for Cost relationship
}

export interface WorkItem {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: WorkItemType;
  sprintId: number | null;
  epicId: string;
  projectId: string;
  costs: Cost[];
  dependencies: number[]; // Array of WorkItem IDs this item depends on
  assignees: number[]; // Array of Person/TeamMember IDs assigned to this item
}
export type WorkItemType = 'TASK' | 'STORY' | 'BUG';

export interface UserStory {
  id: number;
  name: string;
  description: string;
  assigneeId: number | null;
  effortPoints: number;
  status: UserStoryStatus;
  startDate: string;
  targetEndDate: string;
  epicId: number;
  phaseEstimates: {
    devDone: number;
    readyForSIT: number;
    sitDone: number;
    uat: number;
    ptSecurity: number;
    goLive: number;
  };
}

export interface Epic {
  id: number;
  code: string;
  title: string;
  description: string;
  assigneeId: number;
  projectId: number;  // Added projectId to link epics to epics
  status: EpicStatus;
  startDate: Date;
  targetEndDate: Date;
  dependencies: string[]; // Array of Epic IDs this epic depends on
  workItems: WorkItem[]; // Add workItems array
  resourceAllocations: ResourceAllocation[];
  costs: Cost[];
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssueRisk {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  assigneeId: number | null;
  epicId: number;
  createdDate: string;
  updatedDate: string;
}

/* ─────────── REQUEST TYPES (frontend → backend) ─────────── */
export interface EpicRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: EpicStatus;
  projectId: number;
}
export type EpicViewType = 'backlog' | 'resource' | 'cost' | 'timeline';
