from rest_framework import serializers


class CreateCollectionSerializer(serializers.Serializer):
    DATABASE_CHOICES = (
        ("META_DATA", "META_DATA"),
        ("PROCESS_DATABASE", "PROCESS_DATABASE"),
        ("WORKFLOW_DATABASE", "WORKFLOW_DATABASE"),
        ("TEMPLATE_DATABASE", "TEMPLATE_DATABASE"),
        ("CLONES_DATABASE", "CLONES_DATABASE"),
    )
    workspace_id = serializers.CharField(
        max_length=100, allow_null=False, allow_blank=False
    )
    """collection_name = serializers.CharField(
        max_length=100, allow_null=False, allow_blank=False
    )"""
    database_type = serializers.MultipleChoiceField(choices=DATABASE_CHOICES)
