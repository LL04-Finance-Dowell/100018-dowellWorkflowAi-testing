# WorfklowAI Service

api_url = `https://100094.pythonanywhere.com/v0.1/`

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

### Worfklow Management
