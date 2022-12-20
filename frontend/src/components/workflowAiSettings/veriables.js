import { v4 as uuidv4 } from "uuid";

export const teams = [
  { _id: uuidv4(), content: "team 1" },
  { _id: uuidv4(), content: "team 1" },
  { _id: uuidv4(), content: "team 1" },
  { _id: uuidv4(), content: "team 1" },
  { _id: uuidv4(), content: "team 1" },
  { _id: uuidv4(), content: "team 1" },
];

export const portfolios = [
  { _id: uuidv4(), content: "portfolio 1" },
  { _id: uuidv4(), content: "portfolio 1" },
  { _id: uuidv4(), content: "portfolio 1" },
  { _id: uuidv4(), content: "portfolio 1" },
  { _id: uuidv4(), content: "portfolio 1" },
  { _id: uuidv4(), content: "portfolio 1" },
];

export const rights = [
  { _id: uuidv4(), content: "view" },
  { _id: uuidv4(), content: "use" },
  { _id: uuidv4(), content: "add" },
  { _id: uuidv4(), content: "make a copy" },
  { _id: uuidv4(), content: "edit" },
  { _id: uuidv4(), content: "disable" },
  { _id: uuidv4(), content: "enable" },
  { _id: uuidv4(), content: "languages" },
  { _id: uuidv4(), content: "admin" },
];

export const processes = [
  { _id: uuidv4(), content: "Documents" },
  { _id: uuidv4(), content: "Templates" },
  { _id: uuidv4(), content: "Workflows" },
  { _id: uuidv4(), content: "Approval Process" },
  { _id: uuidv4(), content: "Evaluation Process" },
  { _id: uuidv4(), content: "Notarisation" },
  { _id: uuidv4(), content: "enable" },
  { _id: uuidv4(), content: "languages" },
  { _id: uuidv4(), content: "Reports" },
  { _id: uuidv4(), content: "Folders" },
  { _id: uuidv4(), content: "Records" },
  { _id: uuidv4(), content: "References" },
  { _id: uuidv4(), content: "Management" },
  { _id: uuidv4(), content: "Portfolio/Team Roles" },
];

export const ownerships = [
  { _id: uuidv4(), content: "Created by Portfolio Owner" },
  { _id: uuidv4(), content: "Created by other team members" },
  { _id: uuidv4(), content: "Created by other users" },
  { _id: uuidv4(), content: "Created by public" },
];

export const portfolioTeamRoles = [
  { _id: uuidv4(), content: "Client" },
  { _id: uuidv4(), content: "Project Manager" },
  { _id: uuidv4(), content: "Development" },
  { _id: uuidv4(), content: "Execution" },
  { _id: uuidv4(), content: "Design" },
  { _id: uuidv4(), content: "Quality" },
  { _id: uuidv4(), content: "Marketing" },
  { _id: uuidv4(), content: "Asset Control" },
  { _id: uuidv4(), content: "Materials Management" },
  { _id: uuidv4(), content: "Team Management" },
  { _id: uuidv4(), content: "Finance Management" },
  { _id: uuidv4(), content: "Legal Compliances" },
  { _id: uuidv4(), content: "Documentation" },
  { _id: uuidv4(), content: "Project Owner" },
];

export const workflowAiSettingsArray = [
  {
    _id: uuidv4(),
    title: "Workflow AI Settings",
    children: [
      { _id: uuidv4(), child: teams, childTitle: "teams" },
      { _id: uuidv4(), child: portfolios, childTitle: "portfolios" },
      { _id: uuidv4(), child: rights, childTitle: "rights" },
      { _id: uuidv4(), child: processes, childTitle: "processes" },
      { _id: uuidv4(), child: ownerships, childTitle: "ownerships" },
      {
        _id: uuidv4(),
        child: portfolioTeamRoles,
        childTitle: "Portfolio/Team Roles",
      },
    ],
  },
];

export const ownershipsDocumnets = [
  {
    _id: uuidv4(),
    content: "Created by Portfolio Owner (display list to select)",
  },
  {
    _id: uuidv4(),
    content: "Created by other team members (display list to select)",
  },
  { _id: uuidv4(), content: "Created by other users (display list to select)" },
  { _id: uuidv4(), content: "Created by public (display list to select)" },
];

export const ownershipsTemplates = [
  {
    _id: uuidv4(),
    content: "Created by Portfolio Owner (display list to select)",
  },
  {
    _id: uuidv4(),
    content: "Created by other team members (display list to select)",
  },
  { _id: uuidv4(), content: "Created by other users (display list to select)" },
  { _id: uuidv4(), content: "Created by public (display list to select)" },
];
export const ownershipsWorkflows = [
  {
    _id: uuidv4(),
    content: "Created by Portfolio Owner (display list to select)",
  },
  {
    _id: uuidv4(),
    content: "Created by other team members (display list to select)",
  },
  { _id: uuidv4(), content: "Created by other users (display list to select)" },
  { _id: uuidv4(), content: "Created by public (display list to select)" },
];

export const ownershipsFolders = [
  {
    _id: uuidv4(),
    content: "Created by Portfolio Owner (display list to select)",
  },
  {
    _id: uuidv4(),
    content: "Created by other team members (display list to select)",
  },
  { _id: uuidv4(), content: "Created by other users (display list to select)" },
  { _id: uuidv4(), content: "Created by public (display list to select)" },
];

export const enabledProcessDocuments = [
  { _id: uuidv4(), content: "Save to Drafts" },
  { _id: uuidv4(), content: "Generate QR code" },
  { _id: uuidv4(), content: "OCR to Text" },
  { _id: uuidv4(), content: "Version Control" },
  { _id: uuidv4(), content: "Protect with Password" },
];

export const enabledProcessTemplates = [
  { _id: uuidv4(), content: "Save to Drafts" },
  { _id: uuidv4(), content: "Generate QR code" },
  { _id: uuidv4(), content: "OCR to Text" },
  { _id: uuidv4(), content: "Version Control" },
  { _id: uuidv4(), content: "Protect with Password" },
];

export const enabledProcessWorkflows = [
  { _id: uuidv4(), content: "Secondary Workflows" },
  { _id: uuidv4(), content: " Reject if next step is Rejected" },
  { _id: uuidv4(), content: "History of interaction" },
  { _id: uuidv4(), content: "Set timer for each steps" },
];

export const enabledProcessNotarisation = [
  { _id: uuidv4(), content: "Sign with Seal" },
  { _id: uuidv4(), content: "Digital Signature" },
  { _id: uuidv4(), content: "Sign before me/witness" },
  { _id: uuidv4(), content: "Sign with Identity" },
  { _id: uuidv4(), content: "Invisible Signature" },
];

export const enabledProcessRecords = [
  { _id: uuidv4(), content: "Refer in another Document" },
  { _id: uuidv4(), content: "Refer in another Template" },
  { _id: uuidv4(), content: "View using workflow" },
  { _id: uuidv4(), content: "Set Validity" },
  { _id: uuidv4(), content: "Audits" },
];

export const enabledProcessApprovel = [
  { _id: uuidv4(), content: "Preview workflow Process" },
  { _id: uuidv4(), content: "Start Processing" },
  { _id: uuidv4(), content: "End Processing" },
  { _id: uuidv4(), content: "Workflow wise" },
  { _id: uuidv4(), content: "Workflow step wise" },
  { _id: uuidv4(), content: "Document Content wise" },
  { _id: uuidv4(), content: "Signing Location wise" },
  { _id: uuidv4(), content: "Time limit wise" },
  { _id: uuidv4(), content: "Member type wise" },
];

export const enabledProcessEvaluation = [
  { _id: uuidv4(), content: "Edit history" },
  { _id: uuidv4(), content: "Number of words" },
  { _id: uuidv4(), content: "Language used" },
  {
    _id: uuidv4(),
    content: "Number of characters including space/excluding space",
  },
  { _id: uuidv4(), content: "Nouns, verbs, proverbs, adjectives" },
  { _id: uuidv4(), content: "Spelling" },
  { _id: uuidv4(), content: "Grammar" },
  { _id: uuidv4(), content: "Meaning" },
  { _id: uuidv4(), content: "Measurements / Scale" },
];

export const enabledProcessReports = [
  { _id: uuidv4(), content: "Templates" },
  { _id: uuidv4(), content: "Workflows" },
  { _id: uuidv4(), content: "Documents" },
  { _id: uuidv4(), content: "Processes" },
  { _id: uuidv4(), content: "Folders" },
  { _id: uuidv4(), content: "Records / Completed" },
];

export const processesInWorkflowAIArray = [
  {
    _id: uuidv4(),
    title: "Workflow AI Settings",
    children: [
      {
        _id: uuidv4(),
        column: [
          { _id: uuidv4(), child: teams, childTitle: "teams" },
          { _id: uuidv4(), child: portfolios, childTitle: "portfolios" },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            child: portfolioTeamRoles,
            childTitle: "Portfolio/Team Roles",
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [{ _id: uuidv4(), child: rights, childTitle: "rights" }],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            child: ownershipsDocumnets,
            childTitle: "ownerships - documents",
          },
          {
            _id: uuidv4(),
            child: ownershipsTemplates,
            childTitle: "ownerships - templates",
          },
          {
            _id: uuidv4(),
            child: ownershipsWorkflows,
            childTitle: "ownerships - workflows",
          },
          {
            _id: uuidv4(),
            child: ownershipsFolders,
            childTitle: "ownerships - folders",
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            child: enabledProcessDocuments,
            childTitle: "Documents",
          },
          {
            _id: uuidv4(),
            child: enabledProcessTemplates,
            childTitle: "Tempaltes",
          },
          {
            _id: uuidv4(),
            child: enabledProcessWorkflows,
            childTitle: "Workflows",
          },
          {
            _id: uuidv4(),
            child: enabledProcessNotarisation,
            childTitle: "Notarisation",
          },
          {
            _id: uuidv4(),
            child: enabledProcessRecords,
            childTitle: "Records",
          },
          {
            _id: uuidv4(),
            child: enabledProcessApprovel,
            childTitle: "Approval Process",
          },
          {
            _id: uuidv4(),
            child: enabledProcessEvaluation,
            childTitle: "Evaluation Process",
          },
          {
            _id: uuidv4(),
            child: enabledProcessReports,
            childTitle: "Reports",
          },
        ],
      },
    ],
  },
];

//create edit teamsin

export const teamsInWorkflowAITeams = [
  {
    _id: uuidv4(),
    content: "Team 1 (Name, Code, Spec, Details, Universal Code)",
  },
  {
    _id: uuidv4(),
    content: "Team 1 (Name, Code, Spec, Details, Universal Code)",
  },
  {
    _id: uuidv4(),
    content: "Team 1 (Name, Code, Spec, Details, Universal Code)",
  },
  {
    _id: uuidv4(),
    content: "Team 1 (Name, Code, Spec, Details, Universal Code)",
  },
];

export const teamsInWorkflowAIPortfolios = [
  { _id: uuidv4(), content: "Portfolio 1" },
  { _id: uuidv4(), content: "Portfolio 1" },
  { _id: uuidv4(), content: "Portfolio 1" },
  { _id: uuidv4(), content: "Portfolio 1" },
  { _id: uuidv4(), content: "Portfolio 1" },
];

export const teamsInWorkflowAITeamDetails = [
  { _id: uuidv4(), content: "<Team Name>" },
  { _id: uuidv4(), content: "<Team Code>" },
  { _id: uuidv4(), content: "< Team Spec>" },
  { _id: uuidv4(), content: "<Team Details>" },
  { _id: uuidv4(), content: "<Team Universal code>" },
];

export const teamsInWorkflowAI = [
  {
    _id: uuidv4(),
    title: "Create/Edit Teams in Workflow AI",
    children: [
      {
        _id: uuidv4(),
        column: [
          { _id: uuidv4(), child: teamsInWorkflowAITeams, childTitle: "teams" },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            child: teamsInWorkflowAIPortfolios,
            childTitle: "porfolios",
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            child: teamsInWorkflowAITeamDetails,
            childTitle: "team details",
          },
        ],
      },
    ],
  },
];
