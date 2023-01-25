# data model processing

# the process
process_model = {"baseDocumentId": "doc_id", "processTitle": "workflow_title + -"}

# steps
steps = [
    {
        "stepNumber": 1,
        "permitInternalWorkflow": "True|False",
        # location
        "stepLocation": "any|select",
        "continent": "the_continent",
        "country": "the_country",
        "city": "the_city",
        # time
        "stepTime": "no_time_limit|select|custom",
        "timeLimit": "no_time_limit|within_1_hour|within_8_hours|within_24_hours|within_3_days|within_7_days",
        "start_time": "the_time",
        "end_time": "the_time",
        # reminder
        "reminder": "no_reminder|every_hour|every_day|decide_later",
        # document
        "documentClone": "clone_count",
        # display_options
        "documentDisplay": "display_document_before_processing_this_step|display_document_after_processing_this_step|display_document_only_this_step|display_document_in_all_steps",
        # task
        "membersAssignedTask": "team|users|public",
        "publicMembers": ["list_of_assigned_usernames"],
        "teamMembers": ["list_of_assigned_usernames"],
        "userMembers": ["list_of_assigned_usernames"],
        "taskType": "request_for_task|assign_task",
        "rights": "add_edit|view|comment|approve",
        "activityType": "team_task|individual_task",
        "taskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time|",
        "processingOrder": "no_order|team_member->user->public|team_member->public->user|user->team_member->public|user->public->team_member|public->team_member->user|public->user->team_member",
    }
]

# document processing.
processing_options = [
    "save_workflow_to_document_and_save_to_drafts",
    "cancel_process_before_completion",
    "pause_processing_after_completing_ongoing_step",
    "resume_processing_from_next_step",
    "test_document_processing_wf_wise",
    "test_document_processing_wf_steps_wise",
    "test_document_processing_content_wise"
]

# function map
def document_processing():
    pass


def save_wf_to_document():
    pass


def test_document_processing():
    pass


def workflow_wise_processing():
    pass


def content_wise_processing():
    pass


def workflow_step_wise_processing():
    pass


def verify_internal_wf_permission():
    pass


def verify_task():
    pass


def verify_location():
    pass


def verify_display_rights():
    pass


def verify_location():
    pass


def verify_time():
    pass
