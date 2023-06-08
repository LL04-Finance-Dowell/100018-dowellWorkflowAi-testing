## WorkflowAI Service

### Introduction

This backend service serves as the WorkflowAI application Backend.

### WorkflowAI Service Features

- Workflow Management.
- Workflow Process Management.
- Document Management.
- Template Management.

### Installation Guide

- Clone this repository [here](https://github.com/LL04-Finance-Dowell/100018-dowellWorkflowAi-testing.git).
- The `backend` branch is the most stable branch at any given time, ensure you're working from it.
- Run `pip install -r requirements.txt` to install dependencies.

### Usage

- Run `python manage.py runserver 8001` to start the application.
- Connect to the API using Postman on port 8001.

### API Endpoints

- Base URL: `https://100094.pythonanywhere.com/v1/`
- Documentation: [https://documenter.getpostman.com/view/27182139/2s93mAV1Ax]()

| HTTP Verbs | Endpoints                                   | Action                                           |
| ---------- | ------------------------------------------- | ------------------------------------------------ |
| GET        | companies/:company_id/templates/            | To retrieve templates of given company.          |
| GET        | companies/:company_id/processes/            | To retrieve processes in a company               |
| GET        | companies/:company_id/documents/            | To retrieve documents of a given company.        |
| GET        | companies/:company_id/documents/completed   | To fetch completed documents of a given company. |
| GET        | companies/:company_id/processes/:process_id | To fetch documents of a company by process_id.   |
| GET        | companies/:company_id/workflows/            | To retrieve workflows in a company               |
| GET        | companies/:company_id/favourites/           | To list favourites                               |
| POST       | companies/:company_id/teams/                | To fetch all workflow teams                      |
| POST       | companies/:company_id/settings              | To fetch all workflow AI SETTING Lists           |
| POST       | templates/                                  | To create a new template.                        |
| GET        | templates/:template_id/                     | To retrieve a single template.                   |
| PUT        | templates/:template_id/approval/            | To approve a single template.                    |
| POST       | documents/                                  | To create a new document.                        |
| GET        | documents/:document_id/                     | To retrieve a single document.                   |
| GET        | documents/:document_id/content/             | To get the content map of a single document      |
| POST       | workflows/                                  | To create a new workflow                         |
| GET, PUT   | workflows/:workflow_id/                     | To retrieve /update a single workflow            |
| POST       | workflow-settings/                          | To set wf ai settings                            |
| GET, PUT   | workflow-settings/:wf_setting_id/           | To get / update a single wf ai settings          |
| POST       | processes/                                  | To create a new process                          |
| GET        | processes/:process_id/                      | To retrieve a single process                     |
| POST       | processes/:process_id/verify/               | To verify a process to get access.               |
| POST       | processes/:process_id/finalize-or-reject/   | To mark a documents as finalized/rejected        |
| POST       | processes/:process_id/trigger/              | To trigger process according to given action     |
| POST       | processes/:process_id/links/                | To retrieve verification link for a user         |
| POST       | favourites/                                 | To create favourites                             |
| DELETE     | favourites/:item_id/:item_type/:username/   | To delete favourites                             |
| POST       | archives/                                   | To archive a workflow/document/template/process/ |
| POST       | archives/:item_id/:item_type/restore/       | To restore a workflow/document/template/process/ |
| POST       | teams/                                      | To create workflow teams                         |
| POST       | update-to-teams/                            | To update workflow teams                         |
| POST       | teams/:team_id/                             | To fetch data of workflow teams                  |
| POST       | settings/                                   | To Create New Workflow AI Setting                |
| POST       | update-settings/                            | To Update Existing Workflow AI Setting           |
| GET        | settings/:wf_setting_id/                    | To get a single wf ai settings                   |
| GET        | settings/:username/                         | To get reminders if there is any                 |

---


### Technologies Used

- [Python](https://nodejs.org/) is a programming language that lets you work more quickly and integrate your systems
  more effectively.
- [Django](https://www.djangoproject.com/) is a high-level Python web framework that encourages rapid development and
  clean, pragmatic design.
- [Django Rest Framework](https://www.django-rest-framework.org/) Django REST framework is a powerful and flexible
  toolkit for building Web APIs.
- [MongoDB](https://www.mongodb.com/) is a free open source NOSQL document database with scalability and flexibility.
  Data are stored in flexible JSON-like documents.

### License

This project is available for use under
the [Apache](https://github.com/LL04-Finance-Dowell/100018-dowellWorkflowAi-testing/blob/main/LICENSE) License.

