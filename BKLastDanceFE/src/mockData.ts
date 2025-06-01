import { Epic, Team, TeamMember, Sprint, IssueRisk, WorkItem } from './types';

// Mock team members
export const teamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Nguyễn Văn A', employeeCode: 'NV001', position: 'Developer' },
  { id: 'tm2', name: 'Trần Thị B', employeeCode: 'NV002', position: 'Business Analyst' },
  { id: 'tm3', name: 'Lê Văn C', employeeCode: 'NV003', position: 'QA Engineer' },
  { id: 'tm4', name: 'Phạm Thị D', employeeCode: 'NV004', position: 'UX Designer' },
  { id: 'tm5', name: 'Hoàng Văn E', employeeCode: 'NV005', position: 'DevOps Engineer' },
  { id: 'tm6', name: 'Đặng Thị F', employeeCode: 'NV006', position: 'Product Owner' },
  { id: 'tm7', name: 'Vũ Văn G', employeeCode: 'NV007', position: 'Scrum Master' },
  { id: 'tm8', name: 'Bùi Thị H', employeeCode: 'NV008', position: 'Frontend Developer' },
  { id: 'tm9', name: 'Đỗ Văn I', employeeCode: 'NV009', position: 'Backend Developer' },
  { id: 'tm10', name: 'Lý Thị J', employeeCode: 'NV010', position: 'Full Stack Developer' },
];

// Mock teams
export const teams: Team[] = [
  { id: 'team1', name: 'Alpha Team', members: [teamMembers[0], teamMembers[1], teamMembers[2]] },
  { id: 'team2', name: 'Bravo Team', members: [teamMembers[3], teamMembers[4], teamMembers[5]] },
  { id: 'team3', name: 'Charlie Team', members: [teamMembers[6], teamMembers[7], teamMembers[8], teamMembers[9]] },
];

// Define a default project ID for our mock data
const DEFAULT_PROJECT_ID = 'project1';

// Mock sprints for a quarter (assuming 2-week sprints)
export const sprints: Sprint[] = [
  {
    id: 'sprint1',
    name: 'Sprint 1',
    startDate: new Date(2023, 0, 1), // Jan 1, 2023
    endDate: new Date(2023, 0, 14),  // Jan 14, 2023
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 'sprint2',
    name: 'Sprint 2',
    startDate: new Date(2023, 0, 15), // Jan 15, 2023
    endDate: new Date(2023, 0, 28),   // Jan 28, 2023
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 'sprint3',
    name: 'Sprint 3',
    startDate: new Date(2023, 0, 29), // Jan 29, 2023
    endDate: new Date(2023, 1, 11),   // Feb 11, 2023
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 'sprint4',
    name: 'Sprint 4',
    startDate: new Date(2023, 1, 12), // Feb 12, 2023
    endDate: new Date(2023, 1, 25),   // Feb 25, 2023
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 'sprint5',
    name: 'Sprint 5',
    startDate: new Date(2023, 1, 26), // Feb 26, 2023
    endDate: new Date(2023, 2, 11),   // Mar 11, 2023
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 'sprint6',
    name: 'Sprint 6',
    startDate: new Date(2023, 2, 12), // Mar 12, 2023
    endDate: new Date(2023, 2, 25),   // Mar 25, 2023
    projectId: DEFAULT_PROJECT_ID,
  },
];

// Mock work items
export const workItems: WorkItem[] = [
  // Work items for Epic 1 (User Authentication System)
  {
    id: 'wi1',
    title: 'Implement Login API',
    description: 'Create REST API endpoints for user login functionality',
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 0, 7),
    type: 'TASK',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint1',
    epicId: 'epic1',
    costs: [
      { id: 'wicost1', name: 'AWS Lambda', type: 'Cloud', amount: 50, sprintId: 'sprint1', workItemId: 'wi1' }
    ],
    dependencies: [],
    assignees: ['tm1', 'tm2']
  },
  {
    id: 'wi2',
    title: 'User Registration Story',
    description: 'As a user, I want to register for an account so I can access the system',
    startDate: new Date(2023, 0, 8),
    endDate: new Date(2023, 0, 14),
    type: 'STORY',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint1',
    epicId: 'epic1',
    costs: [],
    dependencies: ['wi1'],
    assignees: ['tm1']
  },
  {
    id: 'wi3',
    title: 'Fix Authentication Bug',
    description: 'Fix issue with token expiration not being handled properly',
    startDate: new Date(2023, 0, 10),
    endDate: new Date(2023, 0, 12),
    type: 'BUG',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint1',
    epicId: 'epic1',
    costs: [],
    dependencies: [],
    assignees: ['tm3']
  },
  {
    id: 'wi4',
    title: 'Password Reset Feature',
    description: 'Implement password reset functionality with email verification',
    startDate: new Date(2023, 0, 15),
    endDate: new Date(2023, 0, 28),
    type: 'TASK',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint2',
    epicId: 'epic1',
    costs: [
      { id: 'wicost2', name: 'AWS SES', type: 'Cloud', amount: 25, sprintId: 'sprint2', workItemId: 'wi4' }
    ],
    dependencies: ['wi1'],
    assignees: ['tm2', 'tm3']
  },
  // Work items for Epic 2 (User Profile Management)
  {
    id: 'wi5',
    title: 'Profile Update Story',
    description: 'As a user, I want to update my profile information',
    startDate: new Date(2023, 1, 12),
    endDate: new Date(2023, 1, 18),
    type: 'STORY',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint4',
    epicId: 'epic2',
    costs: [],
    dependencies: [],
    assignees: ['tm4']
  },
  {
    id: 'wi6',
    title: 'Avatar Upload Task',
    description: 'Implement avatar upload functionality with image processing',
    startDate: new Date(2023, 1, 19),
    endDate: new Date(2023, 1, 25),
    type: 'TASK',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint4',
    epicId: 'epic2',
    costs: [
      { id: 'wicost3', name: 'AWS S3', type: 'Cloud', amount: 30, sprintId: 'sprint4', workItemId: 'wi6' }
    ],
    dependencies: ['wi5'],
    assignees: ['tm4', 'tm5']
  },
  // Work items for Epic 3 (Notification System)
  {
    id: 'wi7',
    title: 'Email Notification Service',
    description: 'Implement email notification service integration',
    startDate: new Date(2023, 1, 12),
    endDate: new Date(2023, 1, 20),
    type: 'TASK',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint4',
    epicId: 'epic3',
    costs: [
      { id: 'wicost4', name: 'SendGrid API', type: 'Cloud', amount: 40, sprintId: 'sprint4', workItemId: 'wi7' }
    ],
    dependencies: [],
    assignees: ['tm7']
  },
  {
    id: 'wi8',
    title: 'Push Notification Story',
    description: 'As a user, I want to receive push notifications for important updates',
    startDate: new Date(2023, 1, 21),
    endDate: new Date(2023, 2, 5),
    type: 'STORY',
    projectId: DEFAULT_PROJECT_ID,
    sprintId: 'sprint5',
    epicId: 'epic3',
    costs: [],
    dependencies: ['wi7'],
    assignees: ['tm8', 'tm9']
  }
];

// Mock epics - updated to use assigneeId instead of teamId
export const epics: Epic[] = [
  {
    id: 'epic1',
    code: 'EP-001',
    name: 'User Authentication System',
    description: 'Implement a secure user authentication system with login, registration, and password recovery',
    assigneeId: 'tm1', // Changed from teamId to assigneeId
    projectId: DEFAULT_PROJECT_ID,
    status: 'Implementing',
    startDate: new Date(2023, 0, 1), // Jan 1, 2023
    targetEndDate: new Date(2023, 1, 11), // Feb 11, 2023 (spans 3 sprints)
    dependencies: [],
    dependents: ['epic2', 'epic3'],
    workItems: workItems.filter(wi => wi.epicId === 'epic1'),
    userStories: [
      {
        id: 'us1',
        name: 'User Registration',
        description: 'As a user, I want to register for an account',
        assigneeId: 'tm1',
        effortPoints: 5,
        status: 'Implementing',
        startDate: new Date(2023, 0, 1),
        targetEndDate: new Date(2023, 0, 14),
        epicId: 'epic1',
        phaseEstimates: {
          devDone: 5,
          readyForSIT: 2,
          sitDone: 3,
          uat: 2,
          ptSecurity: 2,
          goLive: 1
        }
      },
      {
        id: 'us2',
        name: 'User Login',
        description: 'As a user, I want to login to my account',
        assigneeId: 'tm2',
        effortPoints: 3,
        status: 'Ready for dev',
        startDate: new Date(2023, 0, 15),
        targetEndDate: new Date(2023, 0, 28),
        epicId: 'epic1',
        phaseEstimates: {
          devDone: 3,
          readyForSIT: 1,
          sitDone: 2,
          uat: 1,
          ptSecurity: 2,
          goLive: 1
        }
      },
      {
        id: 'us3',
        name: 'Password Recovery',
        description: 'As a user, I want to reset my password',
        assigneeId: 'tm3',
        effortPoints: 4,
        status: 'Planning',
        startDate: new Date(2023, 0, 29),
        targetEndDate: new Date(2023, 1, 11),
        epicId: 'epic1',
        phaseEstimates: {
          devDone: 4,
          readyForSIT: 1,
          sitDone: 2,
          uat: 1,
          ptSecurity: 1,
          goLive: 1
        }
      }
    ],
    resourceAllocations: [
      { memberId: 'tm1', sprintId: 'sprint1', fte: 0.8 },
      { memberId: 'tm1', sprintId: 'sprint2', fte: 0.5 },
      { memberId: 'tm2', sprintId: 'sprint2', fte: 0.7 },
      { memberId: 'tm3', sprintId: 'sprint3', fte: 0.6 },
    ],
    costs: [
      { id: 'cost1', name: 'AWS Cognito', type: 'Cloud', amount: 100, sprintId: 'sprint1' },
      { id: 'cost2', name: 'AWS Cognito', type: 'Cloud', amount: 100, sprintId: 'sprint2' },
      { id: 'cost3', name: 'External Consultant', type: 'Outsource', amount: 500, sprintId: 'sprint1' },
    ]
  },
  {
    id: 'epic2',
    code: 'EP-002',
    name: 'User Profile Management',
    description: 'Implement user profile management including updating personal info and preferences',
    assigneeId: 'tm4', // Changed from teamId to assigneeId
    projectId: DEFAULT_PROJECT_ID,
    status: 'Ready for dev',
    startDate: new Date(2023, 1, 12), // Feb 12, 2023
    targetEndDate: new Date(2023, 2, 25), // Mar 25, 2023 (spans 2 sprints)
    dependencies: ['epic1'],
    dependents: [],
    workItems: workItems.filter(wi => wi.epicId === 'epic2'),
    userStories: [
      {
        id: 'us4',
        name: 'Edit User Profile',
        description: 'As a user, I want to edit my profile information',
        assigneeId: 'tm4',
        effortPoints: 4,
        status: 'Planning',
        startDate: new Date(2023, 1, 12),
        targetEndDate: new Date(2023, 1, 25),
        epicId: 'epic2',
        phaseEstimates: {
          devDone: 4,
          readyForSIT: 1,
          sitDone: 2,
          uat: 1,
          ptSecurity: 1,
          goLive: 1
        }
      },
      {
        id: 'us5',
        name: 'User Preferences',
        description: 'As a user, I want to set my preferences',
        assigneeId: 'tm5',
        effortPoints: 3,
        status: 'Planning',
        startDate: new Date(2023, 1, 26),
        targetEndDate: new Date(2023, 2, 11),
        epicId: 'epic2',
        phaseEstimates: {
          devDone: 3,
          readyForSIT: 1,
          sitDone: 1,
          uat: 1,
          ptSecurity: 1,
          goLive: 1
        }
      }
    ],
    resourceAllocations: [
      { memberId: 'tm4', sprintId: 'sprint4', fte: 0.7 },
      { memberId: 'tm5', sprintId: 'sprint5', fte: 0.5 },
      { memberId: 'tm6', sprintId: 'sprint6', fte: 0.3 },
    ],
    costs: [
      { id: 'cost4', name: 'AWS S3 (Profile Pictures)', type: 'Cloud', amount: 50, sprintId: 'sprint4' },
      { id: 'cost5', name: 'AWS S3 (Profile Pictures)', type: 'Cloud', amount: 50, sprintId: 'sprint5' },
    ]
  },
  {
    id: 'epic3',
    code: 'EP-003',
    name: 'Notification System',
    description: 'Implement system notifications and alerts for users',
    assigneeId: 'tm7', // Changed from teamId to assigneeId
    projectId: DEFAULT_PROJECT_ID,
    status: 'Backlog refinement',
    startDate: new Date(2023, 1, 12), // Feb 12, 2023
    targetEndDate: new Date(2023, 2, 25), // Mar 25, 2023 (spans 2 sprints)
    dependencies: ['epic1'],
    dependents: [],
    workItems: workItems.filter(wi => wi.epicId === 'epic3'),
    userStories: [
      {
        id: 'us6',
        name: 'Email Notifications',
        description: 'As a user, I want to receive email notifications',
        assigneeId: 'tm7',
        effortPoints: 6,
        status: 'Planning',
        startDate: new Date(2023, 1, 12),
        targetEndDate: new Date(2023, 1, 25),
        epicId: 'epic3',
        phaseEstimates: {
          devDone: 6,
          readyForSIT: 2,
          sitDone: 3,
          uat: 2,
          ptSecurity: 2,
          goLive: 1
        }
      },
      {
        id: 'us7',
        name: 'In-App Notifications',
        description: 'As a user, I want to receive in-app notifications',
        assigneeId: 'tm8',
        effortPoints: 5,
        status: 'Planning',
        startDate: new Date(2023, 1, 26),
        targetEndDate: new Date(2023, 2, 11),
        epicId: 'epic3',
        phaseEstimates: {
          devDone: 5,
          readyForSIT: 1,
          sitDone: 2,
          uat: 1,
          ptSecurity: 1,
          goLive: 1
        }
      }
    ],
    resourceAllocations: [
      { memberId: 'tm7', sprintId: 'sprint4', fte: 0.8 },
      { memberId: 'tm8', sprintId: 'sprint5', fte: 0.7 },
      { memberId: 'tm9', sprintId: 'sprint6', fte: 0.4 },
    ],
    costs: [
      { id: 'cost6', name: 'AWS SES', type: 'Cloud', amount: 30, sprintId: 'sprint4' },
      { id: 'cost7', name: 'AWS SES', type: 'Cloud', amount: 30, sprintId: 'sprint5' },
      { id: 'cost8', name: 'Push Notification Service', type: 'Cloud', amount: 20, sprintId: 'sprint6' },
    ]
  },
];

// Mock issues/risks
export const issuesRisks: IssueRisk[] = [
  {
    id: 'ir1',
    title: 'Security vulnerability in authentication flow',
    description: 'Potential security issue identified in the login process',
    status: 'Open',
    severity: 'High',
    assigneeId: 'tm1',
    epicId: 'epic1',
    createdDate: new Date(2023, 0, 10),
    updatedDate: new Date(2023, 0, 10),
  },
  {
    id: 'ir2',
    title: 'Integration with legacy systems delayed',
    description: 'The integration with legacy authentication system is taking longer than expected',
    status: 'In Progress',
    severity: 'Medium',
    assigneeId: 'tm3',
    epicId: 'epic1',
    createdDate: new Date(2023, 0, 17),
    updatedDate: new Date(2023, 0, 22),
  },
  {
    id: 'ir3',
    title: 'Dependency on third-party service',
    description: 'The notification system depends on an external service that might not be reliable',
    status: 'Open',
    severity: 'Medium',
    assigneeId: 'tm7',
    epicId: 'epic3',
    createdDate: new Date(2023, 1, 15),
    updatedDate: new Date(2023, 1, 15),
  },
];

// Utility function to get epic status class
export const getEpicStatusClass = (status: string): string => {
  switch (status) {
    case 'Not started':
      return 'status-not-started';
    case 'Backlog refinement':
      return 'status-backlog-refinement';
    case 'Ready for dev':
      return 'status-ready-for-dev';
    case 'Implementing':
      return 'status-implementing';
    case 'SIT':
      return 'status-sit';
    case 'Last mile':
      return 'status-last-mile';
    case 'Done':
      return 'status-done';
    case 'Cancelled':
      return 'status-cancelled';
    default:
      return 'status-not-started';
  }
};

// Utility function to get a team by ID (keeping for backward compatibility)
export const getTeamById = (teamId: string): Team | undefined => {
  return teams.find(team => team.id === teamId);
};

// Utility function to get a team member by ID
export const getTeamMemberById = (memberId: number): TeamMember | undefined => {
  return teamMembers.find(member => member.id === memberId);
};

// Utility function to get a sprint by ID
export const getSprintById = (sprintId: number): Sprint | undefined => {
  return sprints.find(sprint => sprint.id === sprintId);
};

// Utility function to get a work item by ID
export const getWorkItemById = (workItemId: string): WorkItem | undefined => {
  return workItems.find(workItem => workItem.id === workItemId);
};

// Improved formatDate function with better type handling and error checking
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) {
    return 'N/A';
  }

  try {
    let dateObj: Date;

    // Handle different input types
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return 'N/A';
    }

    // Check if it's a valid date by explicitly testing the timestamp
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }

    // Format date using Intl.DateTimeFormat for Vietnamese format (DD/MM/YYYY)
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);

  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};