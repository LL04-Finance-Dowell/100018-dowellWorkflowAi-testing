import { v4 as uuidv4 } from 'uuid';

export const teams = [
  // { _id: uuidv4(), content: 'team 1', isSelected: false },
  // { _id: uuidv4(), content: 'team 1', isSelected: false },
  // { _id: uuidv4(), content: 'team 1', isSelected: false },
  // { _id: uuidv4(), content: 'team 1', isSelected: false },
  // { _id: uuidv4(), content: 'team 1', isSelected: false },
  // { _id: uuidv4(), content: 'team 1', isSelected: false },
];

export const portfolios = [
  // { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
  // { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
  // { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
  // { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
  // { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
  // { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
];

export const rights = [
  { _id: uuidv4(), content: 'view', isSelected: false },
  { _id: uuidv4(), content: 'use', isSelected: false },
  { _id: uuidv4(), content: 'add', isSelected: false },
  { _id: uuidv4(), content: 'make a copy', isSelected: false },
  { _id: uuidv4(), content: 'edit', isSelected: false },
  { _id: uuidv4(), content: 'disable', isSelected: false },
  { _id: uuidv4(), content: 'enable', isSelected: false },
  { _id: uuidv4(), content: 'languages', isSelected: false },
  { _id: uuidv4(), content: 'admin', isSelected: false },
];

export const processes = [
  { _id: uuidv4(), content: 'Documents', isSelected: false },
  { _id: uuidv4(), content: 'Templates', isSelected: false },
  { _id: uuidv4(), content: 'Workflows', isSelected: false },
  { _id: uuidv4(), content: 'Approval Process', isSelected: false },
  { _id: uuidv4(), content: 'Evaluation Process', isSelected: false },
  { _id: uuidv4(), content: 'Notarisation', isSelected: false },
  { _id: uuidv4(), content: 'enable', isSelected: false },
  { _id: uuidv4(), content: 'languages', isSelected: false },
  { _id: uuidv4(), content: 'Reports', isSelected: false },
  { _id: uuidv4(), content: 'Folders', isSelected: false },
  { _id: uuidv4(), content: 'Records', isSelected: false },
  { _id: uuidv4(), content: 'References', isSelected: false },
  { _id: uuidv4(), content: 'Management', isSelected: false },
  { _id: uuidv4(), content: 'Portfolio/Team Roles', isSelected: false },
];

export const ownerships = [
  { _id: uuidv4(), content: 'Created by Portfolio Owner', isSelected: false },
  {
    _id: uuidv4(),
    content: 'Created by other team members',
    isSelected: false,
  },
  { _id: uuidv4(), content: 'Created by other users', isSelected: false },
  { _id: uuidv4(), content: 'Created by public', isSelected: false },
];

export const portfolioTeamRoles = [
  { _id: uuidv4(), content: 'Client', isSelected: false },
  { _id: uuidv4(), content: 'Project Manager', isSelected: false },
  { _id: uuidv4(), content: 'Development', isSelected: false },
  { _id: uuidv4(), content: 'Execution', isSelected: false },
  { _id: uuidv4(), content: 'Design', isSelected: false },
  { _id: uuidv4(), content: 'Quality', isSelected: false },
  { _id: uuidv4(), content: 'Marketing', isSelected: false },
  { _id: uuidv4(), content: 'Asset Control', isSelected: false },
  { _id: uuidv4(), content: 'Materials Management', isSelected: false },
  { _id: uuidv4(), content: 'Team Management', isSelected: false },
  { _id: uuidv4(), content: 'Finance Management', isSelected: false },
  { _id: uuidv4(), content: 'Legal Compliances', isSelected: false },
  { _id: uuidv4(), content: 'Documentation', isSelected: false },
  { _id: uuidv4(), content: 'Project Owner', isSelected: false },
];

export const workflowAiSettingsArray = [
  {
    _id: uuidv4(),
    title: 'Workflow AI Settings',
    children: [
      { _id: uuidv4(), items: [], proccess_title: 'teams' },
      { _id: uuidv4(), items: [], proccess_title: 'portfolios' },
      { _id: uuidv4(), items: rights, proccess_title: 'rights' },
      { _id: uuidv4(), items: processes, proccess_title: 'processes' },
      { _id: uuidv4(), items: ownerships, proccess_title: 'ownerships' },
      {
        _id: uuidv4(),
        items: portfolioTeamRoles,
        proccess_title: 'Portfolio/Team Roles',
      },
    ],
  },
];

export const ownershipsDocumnets = [
  {
    _id: uuidv4(),
    content: 'Created by Portfolio Owner (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other team members (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other users (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by public (display list to select)',
    isSelected: false,
  },
];

export const ownershipsTemplates = [
  {
    _id: uuidv4(),
    content: 'Created by Portfolio Owner (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other team members (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other users (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by public (display list to select)',
    isSelected: false,
  },
];
export const ownershipsWorkflows = [
  {
    _id: uuidv4(),
    content: 'Created by Portfolio Owner (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other team members (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other users (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by public (display list to select)',
    isSelected: false,
  },
];

export const ownershipsFolders = [
  {
    _id: uuidv4(),
    content: 'Created by Portfolio Owner (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other team members (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by other users (display list to select)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Created by public (display list to select)',
    isSelected: false,
  },
];

export const enabledProcessDocuments = [
  // { _id: uuidv4(), content: 'Save to Drafts', isSelected: false },
  // { _id: uuidv4(), content: 'Generate QR code', isSelected: false },
  // { _id: uuidv4(), content: 'OCR to Text', isSelected: false },
  // { _id: uuidv4(), content: 'Version Control', isSelected: false },
  // { _id: uuidv4(), content: 'Protect with Password', isSelected: false },
];

export const enabledProcessTemplates = [
  // { _id: uuidv4(), content: 'Save to Drafts', isSelected: false },
  // { _id: uuidv4(), content: 'Generate QR code', isSelected: false },
  // { _id: uuidv4(), content: 'OCR to Text', isSelected: false },
  // { _id: uuidv4(), content: 'Version Control', isSelected: false },
  // { _id: uuidv4(), content: 'Protect with Password', isSelected: false },
];

export const enabledProcessWorkflows = [
  // { _id: uuidv4(), content: 'Secondary Workflows', isSelected: false },
  // {
  //   _id: uuidv4(),
  //   content: 'Reject if next step is Rejected',
  //   isSelected: false,
  // },
  // { _id: uuidv4(), content: 'History of interaction', isSelected: false },
  // { _id: uuidv4(), content: 'Set timer for each steps', isSelected: false },
];

export const enabledProcessNotarisation = [
  // { _id: uuidv4(), content: 'Sign with Seal', isSelected: false },
  // { _id: uuidv4(), content: 'Digital Signature', isSelected: false },
  // { _id: uuidv4(), content: 'Sign before me/witness', isSelected: false },
  // { _id: uuidv4(), content: 'Sign with Identity', isSelected: false },
  // { _id: uuidv4(), content: 'Invisible Signature', isSelected: false },
];

export const enabledProcessRecords = [
  // { _id: uuidv4(), content: 'Refer in another Document', isSelected: false },
  // { _id: uuidv4(), content: 'Refer in another Template', isSelected: false },
  // { _id: uuidv4(), content: 'View using workflow', isSelected: false },
  // { _id: uuidv4(), content: 'Set Validity', isSelected: false },
  // { _id: uuidv4(), content: 'Audits', isSelected: false },
];

export const enabledProcessApprovel = [
  // { _id: uuidv4(), content: 'Preview workflow Process', isSelected: false },
  // { _id: uuidv4(), content: 'Start Processing', isSelected: false },
  // { _id: uuidv4(), content: 'End Processing', isSelected: false },
  // { _id: uuidv4(), content: 'Workflow wise', isSelected: false },
  // { _id: uuidv4(), content: 'Workflow step wise', isSelected: false },
  // { _id: uuidv4(), content: 'Document Content wise', isSelected: false },
  // { _id: uuidv4(), content: 'Signing Location wise', isSelected: false },
  // { _id: uuidv4(), content: 'Time limit wise', isSelected: false },
  // { _id: uuidv4(), content: 'Member type wise', isSelected: false },
];

export const enabledProcessEvaluation = [
  // { _id: uuidv4(), content: 'Edit history', isSelected: false },
  // { _id: uuidv4(), content: 'Number of words', isSelected: false },
  // { _id: uuidv4(), content: 'Language used', isSelected: false },
  // {
  //   _id: uuidv4(),
  //   content: 'Number of characters including space/excluding space',
  //   isSelected: false,
  // },
  // {
  //   _id: uuidv4(),
  //   content: 'Nouns, verbs, proverbs, adjectives',
  //   isSelected: false,
  // },
  // { _id: uuidv4(), content: 'Spelling', isSelected: false },
  // { _id: uuidv4(), content: 'Grammar', isSelected: false },
  // { _id: uuidv4(), content: 'Meaning', isSelected: false },
  // { _id: uuidv4(), content: 'Measurements / Scale', isSelected: false },
];

export const enabledProcessReports = [
  // { _id: uuidv4(), content: 'Templates', isSelected: false },
  // { _id: uuidv4(), content: 'Workflows', isSelected: false },
  // { _id: uuidv4(), content: 'Documents', isSelected: false },
  // { _id: uuidv4(), content: 'Processes', isSelected: false },
  // { _id: uuidv4(), content: 'Folders', isSelected: false },
  // { _id: uuidv4(), content: 'Records / Completed', isSelected: false },
];

export const processesInWorkflowAIArray = [
  {
    _id: uuidv4(),
    title:
      'Assign Roles & Rights to Portfolios & Teams in Enabled Processes in Workflow AI',
    children: [
      {
        _id: uuidv4(),
        column: [
          { _id: uuidv4(), items: teams, proccess_title: 'teams' },
          { _id: uuidv4(), items: portfolios, proccess_title: 'portfolios' },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: portfolioTeamRoles,
            proccess_title: 'Portfolio/Team Roles',
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: [],
            proccess_title: 'rights',
            type: 'hardcode',
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: ownershipsDocumnets,
            proccess_title: 'ownerships - documents',
            type: 'hardcode',
          },
          {
            _id: uuidv4(),
            items: ownershipsTemplates,
            proccess_title: 'ownerships - templates',
            type: 'hardcode',
          },
          {
            _id: uuidv4(),
            items: ownershipsWorkflows,
            proccess_title: 'ownerships - workflows',
            type: 'hardcode',
          },
          {
            _id: uuidv4(),
            items: ownershipsFolders,
            proccess_title: 'ownerships - folders',
            type: 'hardcode',
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: enabledProcessDocuments,
            proccess_title: 'Documents',
          },
          {
            _id: uuidv4(),
            items: enabledProcessTemplates,
            proccess_title: 'Templates',
          },
          {
            _id: uuidv4(),
            items: enabledProcessWorkflows,
            proccess_title: 'Workflows',
          },
          {
            _id: uuidv4(),
            items: enabledProcessNotarisation,
            proccess_title: 'Notarisation',
          },
          {
            _id: uuidv4(),
            items: enabledProcessRecords,
            proccess_title: 'Records',
          },
          {
            _id: uuidv4(),
            items: enabledProcessApprovel,
            proccess_title: 'Approval Process',
          },
          {
            _id: uuidv4(),
            items: enabledProcessEvaluation,
            proccess_title: 'Evaluation Process',
          },
          {
            _id: uuidv4(),
            items: enabledProcessReports,
            proccess_title: 'Reports',
          },
        ],
      },
    ],
  },
];

//create edit teamsin

// export const teamsInWorkflowAITeams = [
//   {
//     _id: uuidv4(),
//     content: 'Team 1 (Name, Code, Spec, Details, Universal Code)',
//   },
//   {
//     _id: uuidv4(),
//     content: 'Team 2 (Name, Code, Spec, Details, Universal Code)',
//   },
//   {
//     _id: uuidv4(),
//     content: 'Team 3 (Name, Code, Spec, Details, Universal Code)',
//   },
//   {
//     _id: uuidv4(),
//     content: 'Team 4 (Name, Code, Spec, Details, Universal Code)',
//   },
//   {
//     _id: uuidv4(),
//     content: 'Team 5 (Name, Code, Spec, Details, Universal Code)',
//   },
// ];
export const teamsInWorkflowAITeams = [];

// export const teamsInWorkflowAIPortfolios = [
//   { _id: uuidv4(), content: 'Portfolio 1' },
//   { _id: uuidv4(), content: 'Portfolio 2' },
//   { _id: uuidv4(), content: 'Portfolio 3' },
//   { _id: uuidv4(), content: 'Portfolio 4' },
//   { _id: uuidv4(), content: 'Portfolio 5' },
// ];
export const teamsInWorkflowAIPortfolios = [];

export const teamsInWorkflowAITeamDetails = [
  // { _id: uuidv4(), content: '<Team Name>' },
  // { _id: uuidv4(), content: '<Team Code>' },
  // { _id: uuidv4(), content: '<Team Spec>' },
  // { _id: uuidv4(), content: '<Team Details>' },
  // { _id: uuidv4(), content: '<Team Universal code>' },
];

export const teamsInWorkflowAI = [
  {
    _id: uuidv4(),
    title: 'Create/Edit Teams in Workflow AI',
    children: [
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: teamsInWorkflowAITeams,
            proccess_title: 'teams',
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: teamsInWorkflowAIPortfolios,
            proccess_title: 'portfolios',
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: teamsInWorkflowAITeamDetails,
            proccess_title: 'team details',
          },
        ],
      },
    ],
  },
];

//-------------------------//

const permissionProcesses = [
  { _id: uuidv4(), content: 'Documents (set display name)', isSelected: false },
  { _id: uuidv4(), content: 'Templates (set display name)', isSelected: false },
  { _id: uuidv4(), content: 'Workflows (set display name)', isSelected: false },
  {
    _id: uuidv4(),
    content: 'Approval Process (set display name)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Evaluation Process (set display name)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Notarisation (set display name)',
    isSelected: false,
  },
  { _id: uuidv4(), content: 'Reports (set display name)', isSelected: false },
  { _id: uuidv4(), content: 'Folders (set display name)', isSelected: false },
  { _id: uuidv4(), content: 'Records (set display name)', isSelected: false },
  {
    _id: uuidv4(),
    content: 'References (set display name)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Management (set display name)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Portfolio/Team Roles (set display name)',
    isSelected: false,
  },
];

const permissionDocuments = [
  { _id: uuidv4(), content: 'Save to Drafts', isSelected: false },
  { _id: uuidv4(), content: 'Generate QR code', isSelected: false },
  { _id: uuidv4(), content: 'OCR to Text', isSelected: false },
  { _id: uuidv4(), content: 'Version Control', isSelected: false },
  { _id: uuidv4(), content: 'Protect with Password', isSelected: false },
];

const permissionTemplates = [
  { _id: uuidv4(), content: 'Save to Drafts', isSelected: false },
  { _id: uuidv4(), content: 'Generate QR code', isSelected: false },
  { _id: uuidv4(), content: 'OCR to Text', isSelected: false },
  { _id: uuidv4(), content: 'Version Control', isSelected: false },
  { _id: uuidv4(), content: 'Protect with Password', isSelected: false },
];

const permissionWorkflows = [
  { _id: uuidv4(), content: 'Secondary Workflows', isSelected: false },
  {
    _id: uuidv4(),
    content: 'Reject if next step is Rejected',
    isSelected: false,
  },
  { _id: uuidv4(), content: 'History of interaction', isSelected: false },
  { _id: uuidv4(), content: 'Set timer for each steps', isSelected: false },
];

const permissionNotarisation = [
  { _id: uuidv4(), content: 'Sign with Seal', isSelected: false },
  { _id: uuidv4(), content: 'Digital Signature', isSelected: false },
  { _id: uuidv4(), content: 'Sign before me/witness', isSelected: false },
  { _id: uuidv4(), content: 'Sign with Identity', isSelected: false },
  { _id: uuidv4(), content: 'Invisible Signature', isSelected: false },
];

const permissionFolders = [
  { _id: uuidv4(), content: 'View documents in folder', isSelected: false },
  { _id: uuidv4(), content: 'View templates in folder', isSelected: false },
  { _id: uuidv4(), content: 'Move to folder', isSelected: false },
  { _id: uuidv4(), content: 'Remove from folder', isSelected: false },
];

const permissionRecords = [
  { _id: uuidv4(), content: 'Refer in another Document', isSelected: false },
  { _id: uuidv4(), content: 'Refer in another Template', isSelected: false },
  { _id: uuidv4(), content: 'View using workflow', isSelected: false },
  { _id: uuidv4(), content: 'Set Validity', isSelected: false },
  { _id: uuidv4(), content: 'Audits', isSelected: false },
  { _id: uuidv4(), content: 'disable', isSelected: false },
  { _id: uuidv4(), content: 'enable', isSelected: false },
  { _id: uuidv4(), content: 'languages', isSelected: false },
  { _id: uuidv4(), content: 'admin', isSelected: false },
];

const permissionReferences = [
  {
    _id: uuidv4(),
    content: 'Show ID number for Documents (WDOCXXXXXXXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Templates (WTEPXXXXXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Workflows (WWKFXXXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Folders (WFLDXXXXXXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Processes (WPROXXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Reports (WREPXXXXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Records (WRECXXXXXXXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Portfolio (WPTFXXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Right (WRGTXXX)',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Show ID number for Owner (WONRXXXXXXXX)',
    isSelected: false,
  },
];

const permissionApprovalProcess = [
  { _id: uuidv4(), content: 'Preview workflow Process', isSelected: false },
  { _id: uuidv4(), content: 'Start Processing', isSelected: false },
  { _id: uuidv4(), content: 'End Processing', isSelected: false },
  { _id: uuidv4(), content: 'Workflow wise', isSelected: false },
  { _id: uuidv4(), content: 'Workflow step wise', isSelected: false },
  { _id: uuidv4(), content: 'Document Content wise', isSelected: false },
  { _id: uuidv4(), content: 'Signing Location wise', isSelected: false },
  { _id: uuidv4(), content: 'Time limit wise', isSelected: false },
  { _id: uuidv4(), content: 'Member type wise', isSelected: false },
];

const permissionEvaluationProcess = [
  { _id: uuidv4(), content: 'Edit history', isSelected: false },
  { _id: uuidv4(), content: 'Number of words', isSelected: false },
  { _id: uuidv4(), content: 'Language used', isSelected: false },
  {
    _id: uuidv4(),
    content: 'Number of characters including space/excluding space',
  },
  {
    _id: uuidv4(),
    content: 'Nouns, verbs, proverbs, adjectives',
    isSelected: false,
  },
  { _id: uuidv4(), content: 'Spelling', isSelected: false },
  { _id: uuidv4(), content: 'Grammar', isSelected: false },
  { _id: uuidv4(), content: 'Meaning', isSelected: false },
  { _id: uuidv4(), content: 'Measurements / Scale', isSelected: false },
];

const permissionReports = [
  { _id: uuidv4(), content: 'Templates', isSelected: false },
  { _id: uuidv4(), content: 'Workflows', isSelected: false },
  { _id: uuidv4(), content: 'Documents', isSelected: false },
  { _id: uuidv4(), content: 'Processes', isSelected: false },
  { _id: uuidv4(), content: 'Folders', isSelected: false },
  { _id: uuidv4(), content: 'Records / Completed', isSelected: false },
];

const permissionManagement = [
  { _id: uuidv4(), content: 'Billing Plans', isSelected: false },
  { _id: uuidv4(), content: 'Create Teams', isSelected: false },
  { _id: uuidv4(), content: 'DoWell Knowledge Centre', isSelected: false },
  { _id: uuidv4(), content: 'Chat with other Portfolios', isSelected: false },
  {
    _id: uuidv4(),
    content: 'Auto save Document every one minute',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Auto save Template every one minute',
    isSelected: false,
  },
  {
    _id: uuidv4(),
    content: 'Remove my account from Workflow AI',
    isSelected: false,
  },
];

const permissionRoles = [
  { _id: uuidv4(), content: 'Set as Client', isSelected: false },
  { _id: uuidv4(), content: 'Set as Project Manager', isSelected: false },
  { _id: uuidv4(), content: 'Set as Development', isSelected: false },
  { _id: uuidv4(), content: 'Set as Execution', isSelected: false },
  { _id: uuidv4(), content: 'Set as Design', isSelected: false },
  { _id: uuidv4(), content: 'Set as Quality', isSelected: false },
  { _id: uuidv4(), content: 'Set as Marketing', isSelected: false },
  { _id: uuidv4(), content: 'Set as Asset Control', isSelected: false },
  { _id: uuidv4(), content: 'Set as Materials Management', isSelected: false },
  { _id: uuidv4(), content: 'Set as Team Management', isSelected: false },
  { _id: uuidv4(), content: 'Set as Finance Management', isSelected: false },
  { _id: uuidv4(), content: 'Set as Legal Compliances', isSelected: false },
  { _id: uuidv4(), content: 'Set as Documentation', isSelected: false },
  { _id: uuidv4(), content: 'Set as Project Owner', isSelected: false },
];

export const permissionArray = [
  {
    _id: uuidv4(),
    title: 'Enable / Disable Processes in Workflow AI',
    children: [
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: permissionProcesses,
            proccess_title: 'Processes',
            order: 4,
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: permissionDocuments,
            proccess_title: 'Documents',
            order: 4,
          },
          {
            _id: uuidv4(),
            items: permissionTemplates,
            proccess_title: 'Templates',
            order: 4,
          },
          {
            _id: uuidv4(),
            items: permissionWorkflows,
            proccess_title: 'Workflows',
            order: 4,
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: permissionNotarisation,
            proccess_title: 'Notarisation',
            order: 4,
          },
          {
            _id: uuidv4(),
            items: permissionFolders,
            proccess_title: 'Folders',
            order: 4,
          },
          {
            _id: uuidv4(),
            items: permissionRecords,
            proccess_title: 'Records',
            order: 4,
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: permissionReferences,
            proccess_title: 'References',
            order: 4,
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: permissionApprovalProcess,
            proccess_title: 'Approval Process',
            order: 4,
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: permissionEvaluationProcess,
            proccess_title: 'Evaluation Process',
            order: 4,
          },
          {
            _id: uuidv4(),
            items: permissionReports,
            proccess_title: 'Reports',
            order: 4,
          },
        ],
      },
      {
        _id: uuidv4(),
        column: [
          {
            _id: uuidv4(),
            items: permissionManagement,
            proccess_title: 'Management',
            order: 4,
          },
          {
            _id: uuidv4(),
            items: permissionRoles,
            proccess_title: 'Portfolio/Team Roles',
            order: 4,
          },
        ],
      },
    ],
  },
];
