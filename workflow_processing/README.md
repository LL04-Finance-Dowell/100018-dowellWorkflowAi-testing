# Workflow Processing

# the process

```
process_model = {"baseDocumentId": "doc_id", "processTitle": "workflow_title + -"}
```

# steps

```
steps = [
{
    "stepNumber": 1,
    "permitInternalWorkflow": "True|False",
    "stepLocation": "any|select",
    "stepContinent": "the_continent",
    "stepCountry": "the_country",
    "stepCity": "the_city",
    "stepTime": "no_time_limit|select|custom",
    "stepTimeLimit": "within_1_hour|within_8_hours|within_24_hours|within_3_days|within_7_days",
    "stepStartTime": "the_time",
    "stepEndTime": "the_time",
    "stepTask": #tasks(refer),
    "stepReminder": "no_reminder|every_hour|every_day|decide_later", # document
    "stepCloneCount": "clone_count", # display_options
    "stepDisplay": "before_this_step|_after_this_step|_only_this_step|in_all_steps",
    "steProcessingOrder": "no_order|team->user->public|team->public->user|user->team->public|user->public->team|public->team->user|public->user->team",
    "stepDocumentCloneMap": #cloneMap(refer)
}
]

```

# cloneMaps

```
cloneMap = [
    {
        "user_name": "document_id"
    }
]
```

# tasks

```
task = {
    "publicMembers": [{ member: "user_name", "porfolio": "member_portfolio"}],
    "teamMembers": [{ member: "user_name", "porfolio": "member_portfolio"}],
    "userMembers": [{ member: "user_name", "porfolio": "member_portfolio"}],
    "taskType": "request_for_task|assign_task",
    "rights": "add_edit|view|comment|approve",
    "activityType": "team_task|individual_task",
    "rights": "add_edit|view|comment|approve",
    "activityType": "team_task|individual_task",
    "taskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time",
    "step": "assigned",
    "process_id": "process"

}
```

# request_body

```
{
"steps": steps,
"parent_document": "<the_base_doc_id>",
"process_title": "<workflow_titles separated by a `-` >",
}
```

# document processing.

```
processing_options = [
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
]
```
