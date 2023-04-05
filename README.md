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

| HTTP Verbs | Endpoints                                 | Action                                           |
| ---------- | ----------------------------------------- | ------------------------------------------------ |
| GET        | companies/:company_id/templates/          | To retrieve templates of given company.          |
| GET        | companies/:company_id/processes/          | To retrieve processes in a company               |
| GET        | companies/:company_id/documents/          | To retrieve documents of a given company.        |
| GET        | companies/:company_id/workflows/          | To retrieve workflows in a company               |
| GET        | companies/:company_id/favourites/         | To list favourites                               |
| POST       | templates/                                | To create a new template.                        |
| GET        | templates/:template_id/                   | To retrieve a single template.                   |
| PUT        | templates/:template_id/approval/          | To approve a single template.                    |
| POST       | documents/                                | To create a new document.                        |
| GET        | documents/:document_id/                   | To retrieve a single document.                   |
| GET        | documents/:document_id/content/           | To get the content map of a single document      |
| POST       | workflows/                                | To create a new workflow                         |
| GET, PUT   | workflows/:workflow_id/                   | To retrieve /update a single workflow            |
| POST       | workflow-settings/                        | To set wf ai settings                            |
| GET, PUT   | workflow-settings/:wf_setting_id/         | To get / update a single wf ai settings          |
| POST       | processes/                                | To create a new process                          |
| GET        | processes/:process_id/                    | To retrieve a single process                     |
| POST       | processes/:process_id/verify/             | To verify a process to get access.               |
| POST       | processes/:process_id/finalize-or-reject/ | To mark a documents as finalized/rejected        |
| POST       | processes/:process_id/trigger/            | To trigger process according to given action     |
| POST       | processes/:process_id/links/              | To retrieve verification link for a user         |
| POST       | favourites/                               | To create favourites                             |
| DELETE     | favourites/:item_id/:item_type/:username/ | To delete favourites                             |
| POST       | archives/                                 | To archive a workflow/document/template/process/ |
| POST       | archives/:item_id/:item_type/restore/     | To restore a workflow/document/template/process/ |
| POST       | teams/                                    | To create workflow teams                         |
| POST       | update-to-teams/                          | To update workflow teams                         |

---

### Endpoints Definition(Request - Response).

#### Archives

_POST_ to `archives/`

- Archive an item or you can say (add to trash).

Request Body

```
{
    "item_id": "object id",
    "item_type": "workflow|template|document|process"
}
```

_POST_ to `archives/<str:item_id>/<str:item_type>/restore/`

- Restore an item from archives.

Request Body

```
{
    "item_id": "object id",
    "item_type": "workflow|template|document|process"
}
```

#### Favourites

_GET_ to `companies/<str:company_id>/favourites/`

- List all favs

Response

200

500

_POST_ to `favourites/`

- Create a favourite

Request Body

```
{
    "item": "the whole single_item",
    "username": "logged in person",
    "item_type: "workflow|template|document"
}
```

Response

201

400

500

_DELETE_ to `favourites/<str:item_id>/<str:item_type>/<str:username>/`

- Delete an item from favs

204

500

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

_POST_ to `process/:process_id/links/`

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

_POST_ to `process/:process_id/verify/`

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

_POST_ `companies/:company_id/templates/`

Response-200

```
{ "templates": [list of all templates ]}
```

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
{ "message": "Approval Request Could not be processed."}
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

_POST_ `/v0.2/favorite/`

Request Body

```
{
    "item_id":"id_of_item"
    "item_type":"template|document|workflow"
    "username": "logged_in_user"

}

Response Body

{
saved_favorites
}


```

_POST_ `/v0.1/favorites/`

Request Body

```
{
    "company_id": "company_id",
    "username":"logged in user name"

}

```

Response Body

```
{
    "documents": [list of favorite documents],
    "templates": [list of favorite templates],
    "workflows": [list of favorite workflows]
}
```

_POST_ `/v0.2/delete/<str:id>/<str:type>/`

Request Body

```
no need
```

_POST_ `/v0.1/teams/`

Request Body

```
{
"team_name":"Name of Team",
"team_code":"the code",
"team_spec":"secification",
"universal_code":"universal_code",
"details":"details about the team",
"portfolio_list":[list of portfolios],
"company_id":"company_id",
"created_by":"created_by",
"data_type":'Real_Data' | 'Learning_Data' | 'Testing_Data'|'Archived_Data'
}

```

Request Body

```
{
    "Team Saved":{
                "team_name":"Name of saved Team",
                "team_code":"saved code",
                "team_spec":"saved secification",
                "universal_code":"saved universal_code",
                "details":"details",
                "portfolio_list":[list of saved portfolios],
                "company_id":"company_id",
                "created_by":"created_by",
                "data_type": saved 'Real_Data' | 'Learning_Data' | 'Testing_Data'|'Archived_Data'
                }
}

```

_POST_ `/v0.1/update_teams/`

Request Body

```
{
"team_id":"team_id",
"team_name":"Name of Team",
"team_code":"the code",
"team_spec":"secification",
"universal_code":"universal_code",
"details":"details about the team",
"portfolio_list":[list of portfolios],
"company_id":"company_id",
"created_by":"created_by",
"data_type":'Real_Data' | 'Learning_Data' | 'Testing_Data'|'Archived_Data'
}

```

Request Body

```
{
    "Team Updated":{
                "_id":"team_id",
                "team_name":"Name of saved Team",
                "team_code":"saved code",
                "team_spec":"saved secification",
                "universal_code":"saved universal_code",
                "details":"details",
                "portfolio_list":[list of saved portfolios],
                "company_id":"company_id",
                "created_by":"created_by",
                "data_type": saved 'Real_Data' | 'Learning_Data' | 'Testing_Data'|'Archived_Data'
                }
}

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

```

```

```
