# WorfklowAI Service

### Template Management

| METHOD |                        URL                         | REQUEST | PARAM | RESPONSE |
| ------ | :------------------------------------------------: | ------- | ----- | -------- |
| _POST_ | [https://100094.pythonanywhere.com/v0.1/templates] | `{      |

"template_name": "<name_of_template>",
"copy_template": "<empty_for_now>",
"company_id": "<company_id_of_authenticated_user>",
"created_by": "<user_name_of_authenticated_user>"
}`| none |{
"editor_link": "<link_to_the_editor>
}
|
