# WorfklowAI Service

api_url = `https://100094.pythonanywhere.com/v0.1/`
For Test:

```
{
"created_by": "Maanish",
"company_id": "6365ee18ff915c925f3a6691"
}

```

### Template Management

_POST_ to `templates/`

- Creates a new template

Request Body

```
{
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>"
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
    "company_id": "<auth_company_id>"
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
    "company_id": "<auth_company_id>"
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
    "company_id": "<auth_company_id>"
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

### Document Management

_POST_ to `documents/`

- Creates a new Document by providing company_id and created_by parameters and their value from front end

Request Body

```
{
    "company_id": "<company_id_of_authenticated_user>",
    "template_id": "<template_id_existing>",
    "created_by": "<user_name_of_authenticated_user>"
}
```

Response-201

```
{
    "editor_link": "<link_to_the_editor>
}

```

Response-405

```
{
    "message": "Unable to Create Document"
}
```

Response 500

```
{
    "message": "Failed to process document creation"
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

Response-400

```
{
    "message": "This Document is Not Loaded."
}

```

Response-500

```
{
    "message": "Failed to Load Document"
}

```

_POST_ `documents/to-sign/`

- Getting a Document company_id

Request Body

```
{
    "company_id": "<id_of_company>"
}
```

Response-200

```
["ist of documents to be signed with their detail"]

```

Response-500
{
"message": "These document is Rejected Document."
}

_POST_ `documents/mine/`

- Getting a Document company_id and created_by

Request Body

```
{
    "company_id": "<id_of_company>"
    "created_by": "<name_of_user>"
}
```

Response-200

```
{
    "documents":["list of documents created by the user"]
}

```

Response-500

```
{
    "message": "There is no document created by This user."
}
```

_POST_ `documents/rejected/`

- Getting a Rejected Documents using company_id

Request Body

```
{
    "company_id": "<id_of_company>"
}
```

Response-200

```
{
    "documents":["list of rejected documents"]
}

```

Response-500

```
{
    "message": "These document is not in Rejected Document list."
}
```

_POST_ `documents/drafts/`

- Getting a Drafted Documents using company_id

Request Body

```
{
    "company_id": "<id_of_company>"
}
```

Response-200

```
{
    "documents":["list of drafted documents"]
}

```

Response-500

```
{
    "message": "No Document in Drafts"
}
```

### Worfklow Management
_POST_ to `workflows/`

- Creates a new workflow

Request Body

```
{
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>"    
    "wf_title":"<workflow_title>",
     'steps': [
        {'step_name': 'step_one', 
        "rights":"<ADD/EDIT_or_VIEW_or_COMMENT_or_APPROVE>",
        "display_before":"<true or false>",
        "skip":"<True_or_False>",
        "limit":"<No_limit>",
        "start_time":"<START_DATE_AND_TIME>",
        "end_time":"<END_DATE_AND_TIME>",
        "member_portfolio":"<Portfolio_1>",
        "member_type":"<TEAM_MEMBER_or_GUEST>" 
        'reminder': ''}]
}
```

Response-201

```
{
    "workflow": "<saved_workflow_data>
}
```

Response-400

```
{
    
    "message": "Workflow Data required"
             
}

```

Response-500

```
{
    
    "message": "Failed to Save Workflow"
             
}