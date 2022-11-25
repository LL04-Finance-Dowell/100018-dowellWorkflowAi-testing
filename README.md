# WorfklowAI Service

api_url = [https://100094.pythonanywhere.com/v0.1/]

### Template Management

_POST_ to `templates/`
-Creates a new template

Request Body

```
{
   "template_name": "<name_of_template>",
    "copy_template": "<empty_for_now>",
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>"
}
```

Response

```
{
"editor_link": "<link_to_the_editor>
}

```
