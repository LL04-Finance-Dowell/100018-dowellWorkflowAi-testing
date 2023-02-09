_POST_ `v0.2/process/start/`

- Start processing based on give actions.

## request_body

```
{
    "company_id": "<company_id_of_authenticated_user>",
    "created_by": "<user_name_of_authenticated_user>",
    "data_type": "<get_from_login-api>",
    "parent_document_id": "<document_id_of_selected_document_to_process>",
    "action": "",
    "workflows": [
        {
            "workflows": {
                "workflow_title": "<workflow_title>",
                "steps": [
                    {
                        "stepNumber": 1,
                        "stepRole": "<role_from_workflow_creation>",
                        "permitInternalWorkflow": "True|False",
                        "stepLocation": "any|select",
                        "stepContinent": "the_continent",
                        "stepCountry": "the_country",
                        "stepCity": "the_city",
                        "stepTime": "no_time_limit|select|custom",
                        "stepTimeLimit": "within_1_hour|within_8_hours|within_24_hours|within_3_days|within_7_days",
                        "stepStartTime": "the_time",
                        "stepEndTime": "the_time",
                        "stepPublicMembers": [
                            {
                                "member": "user_name",
                                "porfolio": "member_portfolio"
                            }
                        ],
                        "stepTeamMembers": [
                            {
                                "member": "user_name",
                                "porfolio": "member_portfolio"
                            }
                        ],
                        "stepUserMembers": [
                            {
                                "member": "user_name",
                                "porfolio": "member_portfolio"
                            }
                        ],
                        "stepTaskType": "request_for_task|assign_task",
                        "stepRights": "add_edit|view|comment|approve",
                        "stepActivityType": "team_task|individual_task",
                        "stepTaskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time",
                        "stepReminder": "no_reminder|every_hour|every_day|decide_later",
                        "stepCloneCount": "clone_count",
                        "stepDisplay": "before_this_step|_after_this_step|_only_this_step|in_all_steps",
                        "steProcessingOrder": "no_order|team_user_public|team_public_user|user_team_public|user_public_team|public_team_user|public_user_team",
                        "stepDocumentCloneMap": [
                            {
                                "user_name": "document_id"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

## processing action options

```
{
    "save_workflow_to_document_and_save_to_drafts",
    "cancel_process_before_completion",
    "pause_processing_after_completing_ongoing_step",
    "resume_processing_from_next_step",
    "test_document_processing_wf_wise",
    "test_document_processing_wf_steps_wise",
    "test_document_processing_content_wise",
    "start_document_processing_wf_wise",
    "start_document_processing_wf_steps_wise",
    "start_document_processing_content_wise",
    "close_processing_and_mark_as_completed",
}
```
