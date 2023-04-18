import jsonfield
from django.db import models
from django.core.validators import validate_comma_separated_integer_list


class FavoriteTemplate(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField()
    template_name = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteDocument(models.Model):
    _id = models.TextField(primary_key=True)
    document_name = jsonfield.JSONField()
    company_id = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteWorkflow(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField()
    workflows = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


class WorkflowAiSetting(models.Model):
    Process_choice = [
        ("Documents", "Documents"),
        ("Templates", "Templates"),
        ("Workflows", "Workflows"),
        ("Approval_Process", "Approval Process"),
        ("Evaluation_Process", "Evaluation Process"),
        ("Notarisation", "Notarisation"),
        ("Reports", "Reports"),
        ("Folders", "Folders"),
        ("Records", "Records"),
        ("References", "References"),
        ("Management", "Management"),
        ("Portfolio_or_Team_Roles", " Portfolio/Team Roles"),
    ]
    Document_choice = [
        ("Save_to_Drafts", "Save to Drafts"),
        ("Generate_QR_code", "Generate QR code"),
        ("OCR_to_Text", "OCR to Text"),
        ("Version_Control", "Version Control"),
        ("Protect_with_Password", "Protect with Password"),
    ]
    Template_choice = [
        ("Save_to_Drafts", "Save to Drafts"),
        ("Generate_QR_code", "Generate QR code"),
        ("OCR_to_Text", "OCR to Text"),
        ("Version_Control", "Version Control"),
        ("Protect_with_Password", "Protect with Password"),
    ]
    Workflow_choice = [
        ("Secondary_Workflows", "Save to Drafts"),
        ("Reject", "Reject if next step is Rejected"),
        ("History_of_interaction", "History of interaction"),
        ("Set_step_timer", " Set timer for each steps"),
    ]
    Notarisation_choice = [
        ("Sign_with_Seal", "Sign with Seal"),
        ("Digital_Signature", "Digital Signature"),
        ("Sign_before_me_or_witness", "Sign before me/witness"),
        ("Sign_with_Identity", "Sign with Identity"),
        ("Invisible_Signature", "Invisible Signature"),
    ]
    Folder_choice = [
        ("View_documents_in_folder", "View documents in folder"),
        ("View_templates_in_folder", "View templates in folder"),
        ("Move_to_folder", "Move to folder"),
        ("Remove_from_folder", "Remove from folder"),
    ]
    Record_choice = [
        ("Refer_in_another_Document", "Refer in another Document"),
        ("Refer_in_another_Template", "Refer in another Template"),
        ("View_using_workflow", "View using workflow"),
        ("Audits", "Audits"),
    ]
    Reference_choice = [
        ("Show_Documents_ID", "Show ID number for Documents"),
        ("Show_Templates_ID", "Show ID number for Templates"),
        ("Show_Workflows_ID", "Show ID number for workflows"),
        ("Show_Folders_ID", "Show ID number for folders"),
        ("Show_Processes_ID", "Show ID number for Processes"),
        ("Show_Reports_ID", "Show ID number for Reports Reports"),
        ("Show_Records_ID", "Show ID number for Records"),
        ("Show_Portfolio_ID", "Show ID number for Portfolio"),
        ("Show_Right_ID", "Show ID number for Rightd"),
        ("Show_Owner_ID", "Show ID number for Owner"),
    ]
    Aproval_Process_choice = [
        ("Preview_workflow_Process", "Preview workflow Process"),
        ("Start_Processing", "Start Processing"),
        ("End_Processing", "End Processing"),
        ("Workflow_wise", "Workflow wise"),
        ("Workflow_step_wise", "Workflow step wise"),
        ("Document_Content_wise", "Document Content wise"),
        ("Signing_Location_wise", "Signing Location wise"),
        ("Time_limit_wise", "Time limit wise"),
        ("Member_type_wise", "Member type wise"),
    ]
    Evaluation_Process_choice = [
        ("Edit_history", "Edit history"),
        ("Number_of_words", "Number of words"),
        ("Language_used", "Language used"),
        (
            "Number_of_characters",
            " Number of characters including space/excluding space",
        ),
        ("Nouns_verbs_proverbs_adjectives", "Nouns, verbs, proverbs, adjectives"),
        ("Spelling", "Spelling"),
        ("Grammar", "Grammar"),
        ("Meaning", "Meaning"),
        ("Measurements_or_Scale", "Measurements / Scale"),
    ]
    Report_choice = [
        ("Templates", "Templates"),
        ("Workflows", "Workflows"),
        ("Documents", "Documents"),
        ("Processes", "Processes"),
        ("Folders", "Folders"),
        ("Records_Completed", "Records / Completed"),
    ]
    Management_choice = [
        ("Billing_Plans", "Billing Plans"),
        ("Create_Teams", "Create Teams"),
        ("DoWell_Knowledge_Centre", "DoWell Knowledge Centre"),
        ("Chat_with_other_Portfolios", "Chat with other Portfolios"),
        ("Auto_save_Document_every_one_minute", "Auto save Document every one minute"),
        ("Auto_save_Template_every_one_minute", "Auto save Template every one minute"),
        ("Remove_my_account_from_Workflow_AI", "Remove my account from Workflow AI"),
    ]
    Portflio_choice = [
        ("Set_as_Project_Manager", "Set as Project Manager"),
        ("Set_as_Client", "Set as Client"),
        ("Set_as_Development", "Set as Development"),
        ("Set_as_Execution", "Set as Execution"),
        ("Set_as_Design", "Set as Design"),
        ("Set_as_Quality", "Set as Quality"),
        ("Set_as_Marketing", "Set as Marketing"),
        ("Set_as_Asset_Control", "Set as Asset Control"),
        ("Set_as_Materials_Management", "Set as Materials Management"),
        ("Set_as_Team_Management", "Set as Team Management"),
        ("Set_as_Finance_Management", "Set as Finance Management"),
        ("Set_as_Legal_Compliances", "Set as Legal Compliances"),
        ("Set_as_Documentation", "Set as Documentation"),
        ("Set_as_Project_Owner", "Set as Project Owner"),
    ]
    company_id = jsonfield.JSONField()
    created_by = jsonfield.JSONField()
    Process = jsonfield.JSONField(default=None, null=True)
    Documents = jsonfield.JSONField(default=None, null=True)
    Templates = jsonfield.JSONField(default=None, null=True)
    Workflows = jsonfield.JSONField(default=None, null=True)
    Notarisation = jsonfield.JSONField(default=None, null=True)
    Folders = jsonfield.JSONField(default=None, null=True)
    Records = jsonfield.JSONField(default=None, null=True)
    References = jsonfield.JSONField(default=None, null=True)
    Approval_Process = jsonfield.JSONField(default=None, null=True)
    Evaluation_Process = jsonfield.JSONField(default=None, null=True)
    Reports = jsonfield.JSONField(default=None, null=True)
    Management = jsonfield.JSONField(default=None, null=True)
