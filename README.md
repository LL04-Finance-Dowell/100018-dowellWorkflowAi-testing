# WorfklowAI Service

api_url = `https://100094.pythonanywhere.com/v0.1/`

### Workflow Process Service.

_POST_ to `process/link/`

- Request Body

```
{
    "workflow_process": "<workflow_process_field>",
    "user_name": "auth_user_name"
}
```

Response - 200

```
{
    <verification_link>
}

```

Response - 401

```

"User is not part of this process"

```

Response - 500

_POST_ to `process/verify/`

- Verification Checks for document link

Request Body

```
{
    "token": "<get this token from the url path>",
    "location": "<user_city_location>",
    "user_name": "<username_of_person_authenticated>",
    "portfolio": "<authenticated_porfolio>",
}
```

Response-201

```
{
    "editor_link": "<link_to_the_editor>
}

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

" verification failed"

_POST_ to `process/start/`

- Save and Start Processing

Request Body

```
{
    "criteria": "<member|workflow|steps|document_content|signing_location>"
    "document_id": "<document_id_of_selected_document_to_process>",
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>",
    "data_type":"<real|archive|test|learning>",
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

_POST_ to `process/new/`

- Save Workflows to document

Request Body

```
{
    "document_id": "<document_id_of_selected_document_to_process>",
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>",
    "data_type":"<real|archive|test|learning data>",
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

Response - 500

```
    "Failed to save Workflows to document"
```

### Template Management

_POST_ to `templates/`

- Creates a new template

Request Body

```
{
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>",
    "data_type":"<real|archive|test|learning data>"
}
```

Response-201

```
{
    "editor_link": "<link_to_the_editor>
}

```

Response-300

```
{
    "message": "Template Name is Required"
}
```

Response-400

```
{
    "message": "Failed to process template creation."
}
```

Response-405

```
{
    "message": "Template Creation failed"
}
```

Response 500

```
{
    "message": "Failed to process template creation."
}
```

_POST_ `templates/detail/`

- Getting a single template

Request Body

```
{
    "template_id": "<id_of_the_template>",
    "template_name": "<name_of_template_from_list>"
}
```

Response-200

```
{
    "editor_link": "<link_to_the_editor>"
}

```

Response-400

```
{
    "message": "Failed to fecth template"
}

```

Response-404

```
{
    "message": "Template Not Found"
}

```

Response-500

```
{
    "message": "Failed to fecth template"
}

```

_POST_ `templates/approved/`

- List of Approved templates for a single user.

Request Body

```
{
    "company_id": "<auth_company_id>",
    "created_by": "<auth_user_name>"
}
```

Response-200

```
    [<Array of templates>]

```

Response-400

```
{
    "message": "Request Could not be processed."
}
```

Response-404

```
{
    "message": "You have no approved templates"
}
```

Response-500

```
{
    "message": "Could not fetch your approved templates at this time"
}
```

_POST_ `templates/approve/`

- Approve a given template.

Request Body

```
{
    "template_id": "<id_of_template_>",
}
```

Response-200

```
{
    "message": "Template Approved"
}
```

Response-400

```
{
    "message": "Approval Request Could not be processed."
}
```

Response-500

```
{
    "message": "Template Could not be approved"
}
```

_POST_ `templates/pending/`

- Templates Pending Approval.

Request Body

```
{
    "company_id": "<auth_company_id>",
    "created_by": "<auth_user_name>"
}
```

Response-200

```
    [<Array of templates>]
```

Response-400

```
{
    "message": "Approval Request Could not be processed."
}
```

Response-404

```
{
    "message": "You have no pending templates to approved"
}
```

Response-500

```
{
    "message": "Could not fetch templates at this time."
}
```

_POST_ `templates/mine/`

- List of my created templates.

Request Body

```
{
    "company_id": "<auth_company_id>",
    "created_by": "<auth_user_name>"
}
```

Response-200

```

    [<Array of templates>]

```

Response-404

```
{
    "message": "You have not created any templates"
}
```

Response-500

```
{
    "message": "Could not fetch templates at this time."
}
```

_POST_ `templates/saved/`

- List of my Organization templates.

Request Body

```
{
    "company_id": "<auth_company_id>",
}
```

Response-200

```

    [<Array of templates>]

```

Response-404

```
{
    "message": "No templates in organization"
}
```

Response-500

```
{
    "message": "Could not fetch templates at this time."
}
```

### Document Management

_POST_ to `documents/`

- Creates a new Document by providing created_by parameter and its value from front end

Request Body

```
{
    "template_id": "<template_id_existing>",
    "created_by": "<user_name_of_authenticated_user>"
    "company_id": "<company_id_of_authorized_user>",
    "data_type":"<real|archive|test|learning data>"

}
```

Response-201

```
{
    "editor_link": "<link_to_the_editor>
}

```

Response-200

```
{   "document:[],
    "message": "Unable to Create Document"
}
```

_POST_ `documents/detail/`

- Getting a single Document by document_name and document_id

Request Body

```
{
    "document_name": "<id_of_the_document>",
    "document_id": "<name_of_document_from_list>"
}
```

Response-200

```
{
    "editor_link": "<link_to_the_editor>"
}

```

Response-200

```
{
    "document":[],
    "message": "This Document is Not Loaded."
}

```

_POST_ `documents/to-sign/`

- Getting a Document by company_id

Request Body

```
{
    "company_id": "<company_id_of_authorized_user>",
    "user_name": "<auth_user_name>"
}
```

Response-200

```
{
"documents":["list of documents to be signed with their detail"]
}
```

- if no list

Response-200

```
{
  "documents": []
  "message": "These document is Rejected Document."
}
```

_POST_ `documents/mine/`

- Getting a Document company_id and created_by

Request Body

```
{
    "created_by": "<name_of_user>"
    "company_id": "<company_id_of_authorized_user>",

}
```

Response-200

```
{
    "documents":["list of documents created by the user"]
}

```

if no List
Response-200

```
{
    "documents": [],
    "message": "There is no document created by This user."
}
```

_POST_ `documents/rejected/`

- Getting a Rejected Documents using company_id

Request Body

```
{
        "company_id": "<company_id_of_authorized_user>",

}
```

Response-200

```
{
    "documents":["list of rejected documents"]
}

```

If No List
Response-200

```
{
    "documents": [],
    "message": "These document is not in Rejected Document list."
}
```

_POST_ `documents/saved/`

- Getting a Saved Documents using company_id

Request Body

```
{
    "company_id": "<company_id_of_authorized_user>",

}
```

Response-200

```
{
    "documents":["list of saved documents"]
}

```

If No List
Response-500

```
{
    "documents": [],
    "message": "No Document in Drafts"
}
```

_POST_ `documents/document_content/`

- Get Data and ID of each content in document

Request Body

```
 {"document_id":"<Id of specific document>"}
```

Response-200

```
{"content":"<content_id_and_data>}
```

### Worfklow Management

_POST_ to `workflows/`

- Creates a new workflow

Request Body

```
{
    "created_by": "<user_name_of_authenticated_user>",
    "company_id": "<company_id_of_authorized_user>",
    "data_type":"<real|archive|test|learning data>"
    "wf_title":"<workflow_title>",
     'steps': [
        {'step_name': 'step_name',
        'role':role_name",}
        ]
}
```

Response-201

```
{
    "workflow": "<saved_workflow_data>
}

```

If Not Created
Response-200

```
{
    "workflow": [],
    "message": "Failed to Save Workflow"
}

```

_POST_ `workflows/detail/`

- Getting a single workflow by workflow_title and workflow_id

Request Body

```
{
    "workflow_id": "<id_specific_of_workflow>"
}
```

Response-200

```
{
    "workflow": "<detailed_workflow_data>"
}

```

If Not Availabel
Response-200

```
{
    "workflow":[],
    "message": "This workflow is Not Loaded."
}

```

_POST_ `workflows/mine/`

- Getting a Workflow company_id and created_by

Request Body

```
{
    "created_by": "<name_of_user>"
    "company_id": "<company_id_of_authorized_user>",
}
```

Response-200

```
{
    "workflow":["list of workflows created by the user"]
}

```

If Not Available
Response-200

```
{
    "workflow":[],
    "message": "There is no workflow created by This user."
}
```

_POST_ `workflows/update/`

- Getting and Updating Workflow workflow_id

Request Body

```
{

    "created_by": "<user_name_of_authenticated_user>",
    "company_id": "<company_id_of_authorized_user>",
    "data_type":"<real|archive|test|learning data>"
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
{
    "workflow":{"old(archived) workflow data"},
}

If Not Sucessfully Updated
Response-200

```

{
"workflow":[],
"message": "Failed to Update Workflow"

}

_POST_ `workflows/saved/`

- List of my Organization Workflows.

Request Body

```
{
    "company_id": "<auth_company_id>",
}
```

Response-200

```

    [<List of Saved Workflows within company>]

```

### Intelligent Search

- search document, workflow and template.

_POST_ `search/`

Request Body

```
{
    "company_id":"i",
    "search":search keyword"
}
```

Response-200

```
{
    "search_keyword":"user_search_input",
    "search_result": {
                "workflow": ["list_of_existing_workflows_with_searched_title"],
                "document":["list_of_existing_documents_with_searched_name"],
                "templat":["list_of_existing_te,templates_with_searched_name"]
                }
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
_POST_ `get_WFAI_setting/`

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
_POST_ `update_WFAI_setting/`

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

