# WorfklowAI Service

### Template Management

| HTTP METHOD |                        URL                         | REQUEST-BODY | PARAMETER | RESPONSE |
| ----------- | :------------------------------------------------: | ------------ | --------- | -------- |
| _POST_      | [https://100094.pythonanywhere.com/v0.1/templates] | none         |

{
"template_name": "<name_of_template>",
"copy_template": "<empty_for_now>",
"company_id": "<company_id_of_authenticated_user>",
"created_by": "<user_name_of_authenticated_user>"
} |  
Response
{
"editor_link": "<link_to_the_editor>
} |
