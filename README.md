## WorkflowAI Service

### Introduction

This backend service serves as the WorkflowAI application Backend.

### WorkflowAI Service Features

* Workflow Management.
* Workflow Process Management.
* Document Management.
* Template Management.

### Installation Guide

* Clone this repository [here](https://github.com/LL04-Finance-Dowell/100018-dowellWorkflowAi-testing.git).
* The `backend` branch is the most stable branch at any given time, ensure you're working from it.
* Run `pip install -r requirements.txt` to install dependencies.

### Usage

* Run `python manage.py runserver 8001` to start the application.
* Connect to the API using Postman on port 8001.

### API Endpoints - V0.1

- Base URL: `https://100094.pythonanywhere.com`

| HTTP Verbs | Endpoints                             | Action                                               |
|------------|---------------------------------------|------------------------------------------------------|
| POST       | /v0.1/search/                         | To search templates/documents/workflows              |
| POST       | /v0.1/templates/                      | To create a new template.                            |
| GET        | /v0.1/templates/:template_id/         | To retrieve a single template.                       |
| GET        | /v0.1/templates/approve/:template_id/ | To approve a single template.                        |
| GET        | /v0.1/templates/org/:company_id/      | To retrieve templates of given company.              |
| POST       | /v0.1/documents/                      | To create a new document.                            |
| GET        | /v0.1/documents/:document_id/         | To retrieve a single document.                       |
| GET        | /v0.1/documents/org/:company_id/      | To retrieve documents of a given company.            |
| GET        | /v0.1/documents/content/:document_id/ | To get the content map of a single document          |
| POST       | /v0.1/workflows/                      | To create a new workflow                             |
| GET        | /v0.1/workflows/:workflow_id/         | To retrieve a single workflow                        |
| GET        | /v0.1/workflows/update/               | To update a single workflow.                         |
| GET        | /v0.1/workflows/org/:company_id/      | To retrieve workflows in a company                   |
| POST       | /v0.1/process/                        | To create a new process                              |
| GET        | /v0.1/process/:process_id/            | To retrieve a single process                         |
| POST       | /v0.1/process/verification/link/      | To retrieve verification link for a user             |
| GET        | /v0.1/process/org/:company_id/        | To retrieve processes in a company                   |
| GET        | /v/0.1/process/links/:process_id/     | To get process verification link for a given process |
| POST       | /v0.1/process/action/verify/          | To verify a given process and give access link       |
| POST       | /v0.1/process/action/mark/            | To finalize/reject a process                         |
| POST       | /v0.1/settings/                       | To set wf ai settings                                |
| GET        | /v0.1/settings/:wf_setting_id/        | To get a single wf ai settings                       |
| POST       | /v0.1/settings/update/                | To update wf ai settings                             |

--------------

### API Endpoints - V0.2 (new process page.)

- Base URL: `https://100094.pythonanywhere.com`

| HTTP Verbs | Endpoints                         | Action                                               |
|------------|-----------------------------------|------------------------------------------------------|
| POST       | /v0.2/process/                    | To create a new process                              |
| POST       | /v0.2/process/action/verify/      | To verify a process to get access.                   |
| POST       | /v0.2/process/action/mark/        | To mark a documents as finalized/rejected            |
| POST       | /v0.2/process/action/trigger/     | To trigger process according to given action         |

### Endpoints Definition(Request - Response).

#### Process

_POST_ to `process/verification/`

Request Body

```
{
    "action": "finalize|reject",
    "process_id": "sent_in_payload>",
    "authorized": "<sent_in_payload>",
}
```

_POST_ to `process/link/`

Request Body

```
{
    "process_id": "<workflow_process_field>",
    "user_name": "auth_user_name"
}
```

Response - 200

```
{ <verification_link> }
```

Response - 401

```
"User is not part of this process"
```

Response - 500

_POST_ to `process/verify/`

Request Body

```
{
    "token": "<get this token from the url path>",
    "continent": "<user_city_location>",
    "country" : "<user_country>,
    "city": "<user_city>",
    "user_name": "<username_of_person_authenticated>",
    "portfolio": "<authenticated_porfolio>",
}
```

Response-201

```
{ "editor_link": "<link_to_the_editor> }
```

Response - 401

```
"User is not part of this process"
```

Response - 403

```
"Portfolio for this user is Unauthorized"
```

Response-500

```
" verification failed"
```

_POST_ to `process/start/`

Request Body

```
{
    "action": "<save_and_start_processing|save_workflow_to_document>",
    "criteria": "<member|workflow|steps|document_content|signing_location>",
    "document_id": "<document_id_of_selected_document_to_process>",
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>",
    "data_type":"<get_from_login-api>",
    "workflows": [
        {
            "workflows":
            {
                "workflow_title":"<workflow_title>",
                "steps":
                [
                    {
                        "step_name"        : "<name_of_step>",
                        "role"              : "<the_role>",
                        "skip"            : "<True|False>",
                        "document_map"    : "<selected_content_map>"
                        "member_type"    : "<TEAM_MEMBER|PUBLIC|GUEST>",
                        "member"         : "<username_selected",
                        "member_portfolio": "Portfolio",
                        "rights"        : "<ADD/EDIT|VIEW|COMMENT|APPROVE>",
                        "display_before": "<document_before_processing_this_step|document_after_processing_this_step|document_in_all_steps|document_only_this_step>",
                        "location"    :     "<choice_location_selected>",
                        "limit"    : "<within_1_hour|within_8_hours|within_24_hours|within_3_days|within_7_days|custom_time>",
                        "start_time": "START_DATE_AND_TIME",
                        "end_time":    "END_DATE_AND_TIME",
                        "reminder": "<send_reminder_every_day|send_reminder_every_hour>",
                    },
                ],
            },
        },
    ],
}

```

Response - 201

```
"Started Processing"
```

Response - 500

``` 
"Failed to create process and start processing." 
```

#### Template Management

_POST_ to `templates/`

Request Body

```
{
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>",
    "data_type":"<get_from_the_login_api>"

}
```

Response-201

```
 { "editor_link": "<link_to_the_editor> }
 ```

Response-300

```
{ "message": "Template Name is Required" }
```

Response-400

```
{ "message": "Failed to process template creation." }
```

Response-405

``` 
{ "message": "Template Creation failed"}
```

Response 500

```
{ "message": "Failed to process template creation."}
```

_POST_ `templates/:companyId/`

Response-200

```{ "templates": [list of all templates ]}```

_POST_ `templates/:templateId/`

Response-200

```
{ "editor_link": "<link_to_the_editor>" }
```

Response-400

```
{"message": "Failed to fecth template" }
```

Response-404

```
{"message": "Template Not Found" }
```

Response-500

```
{"message": "Failed to fecth template" }
```

_POST_ `templates/approve/:templateId/`

Response-200

```
{"message": "Template Approved"}
```

Response-400

```
{ "message": "Approval Request Could not be processed."
```

Response-500

```
{ message": "Template Could not be approved"}
```

#### Document Management

_POST_ to `documents/`

Request Body

```
{
    "created_by": "<user_name_of_authenticated_user>"
    "company_id": "<company_id_of_authorized_user>",
    "data_type":"<get_from_the_login_api>",
    "page": "<template["page"]> of chosen template",
    "content": "<template["content"]> of chosen template"

}
```

Response-201

```
{"editor_link": "<link_to_the_editor>}
```

Response-200

```
{ "document:[], "message": "Unable to Create Document"}
```

_GET_ `documents/:companyId/`

Response-200

```
{"documents": [list of all documents ]}
```

_POST_ `documents/documentId/`

Response-200

```
{ "editor_link": "<link_to_the_editor>"}
```

Response-200

```
{ "document":[], "message": "This Document is Not Loaded."}
```

_GET_ `documents/content/:documentId/`

Response-200

```
{"content":"<content_id_and_data>}
```

#### Workflow Management

_POST_ to `workflows/`

Request Body

```
{
    "created_by": "<user_name_of_authenticated_user>",
    "company_id": "<company_id_of_authorized_user>",
    "data_type":"<get_from_the_login_api>",
    "wf_title":"<workflow_title>",
     'steps': [
        {'step_name': 'step_name',
        'role':role_name",}
        ]
}
```

Response-201

```
{ "workflow": "<saved_workflow_data> }
```

Response-200(If Not Created)

```
{ "workflow": [], "message": "Failed to Save Workflow" }
```

_POST_ `workflows/:companyId/`

Response-200

```
{ "workflows": [list of all workflows] }
```

_POST_ `workflows/:workflowId/`

Request Body

```
{ "workflow_id": "<id_specific_of_workflow>" }
```

Response-200

```
{ "workflow": "<detailed_workflow_data>" }
```

Response-200 (If Not Available)

```
{ "workflow":[], "message": "This workflow is Not Loaded." }
```

_POST_ `workflows/update/`
Request Body

```
{

    "created_by": "<user_name_of_authenticated_user>",
    "company_id": "<company_id_of_authorized_user>",
    "data_type":"<get_from_the_login_api>"
    "workflow_id": "<id_specific_of_workflow>",
    "wf_title": "Workflow_title_new_or_existing",
    "steps": [
        {
            "step_name": "update_existing_step_name"
            "role": "update_existing_role"
        }
        ,
        {
            "step_name": "update_existing_step_name"
            "role": "update_existing_role"
        }
        

        ]
}

```

Response-201

```
{ "workflow":{"old(archived) workflow data"}  }
```

Response-200(If Not Successfully Updated)

```
{ "workflow":[], "message": "Failed to Update Workflow"}
```

#### Intelligent Search

_POST_ `search/`

Request Body

```
{
    "company_id":"company_id_of_user",
    "search":search keyword"
}
```

Response-200

```
{
    "search_keyword":"user_search_input",
    "search_result": { "workflow": ["list_of_existing_workflows_with_searched_title"], "document":["list_of_existing_documents_with_searched_name"],"template":["list_of_existing_te,templates_with_searched_name]}
}
```

### Workflow AI Setting

_POST_ `workflow_ai_setting/`

Request Body

```
{
    "company_id": "id of company",
    "owner_name": "owner name",
    "username": "user name",
    "portfolio_name": "the portfolio name",
    "proccess":[{'list of processes'}]
}
```

Response-200

```
{
    
    "workflow_setting": {
        "_id": "created wf_setting id",
        "eventId": "event id",
        "company_id": "company id",
        "owner_name": "owner name",
        "username": "username",
        "portfolio_name": "portfolio name",
        "data_type":"Real_Data",
        "processes":[{'list of processes'}]

                }
}
```

_POST_ `settings/`

Request Body

```
{
    "wf_setting_id":" id of wf_setting_id",
    "company_id": "id of company"
}
```

Response-200

```
{
    
    "workflow_setting": {
        "_id": "wf_setting id",
        "eventId": "event id",
        "company_id": "company id",
        "owner_name": "owner name",
        "username": "username",
        "portfolio_name": "portfolio name",
        "data_type":"Real_Data",
        "processes":[{'list of processes'}]

                }
}
```

_POST_ `settings/update/`

Request Body

```
{
    "wf_setting_id":" id of wf_setting_id",
    "company_id": "id of company",
    "owner_name": "owner name",
    "username": "user name",
    "portfolio_name": "the portfolio name",
    "proccess":[{'list of processes'}]


}
```

Response-200

```
{
    "workflow_setting": {
        "_id": "wf_setting id",
        "eventId": "event id",
        "company_id": "company id",
        "owner_name": "owner name",
        "username": "username",
        "portfolio_name": "portfolio name",
        "data_type":"Real_Data",
        "processes":[{'list of processes'}]

                }
}
```

_POST_ `object_count/`

Request Body

```
{
    "company_id": "id of company"
}
```

Response-200

```
{
    "document_count": int(number of created document),
    "template_count": int(number of created template),
    "process_count": int(number of created process),
    "workflow_count": int(number of created workflow)
}
```

_POST_ `documents/editor_payload/`

Request Body

```
{
    "data": "payload from editor",
    
}
```
_POST_ `templates/editor_payload/`

Request Body

```
{
    "data": "payload from editor",
    
}
```
_POST_ `/favorite/<str:id>/<str:type>/`

Request Body

```
{
    "id": "id",
    "type":"template|document|workflow"
    
}

```
_POST_ `/favorites/`

Response Body

```
{
    "documents": [list of favorite documents],
    "templates": [list of favorite templates],
    "workflows": [list of favorite workflows]
}
```
### Technologies Used

* [Python](https://nodejs.org/) is a programming language that lets you work more quickly and integrate your systems
  more effectively.
* [Django](https://www.djangoproject.com/) is a high-level Python web framework that encourages rapid development and
  clean, pragmatic design.
* [Django Rest Framework](https://www.django-rest-framework.org/) Django REST framework is a powerful and flexible
  toolkit for building Web APIs.
* [MongoDB](https://www.mongodb.com/) is a free open source NOSQL document database with scalability and flexibility.
  Data are stored in flexible JSON-like documents.

### License

This project is available for use under
the [Apache](https://github.com/LL04-Finance-Dowell/100018-dowellWorkflowAi-testing/blob/main/LICENSE) License.

