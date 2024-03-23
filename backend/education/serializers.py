from rest_framework import serializers


class CreateCollectionSerializer(serializers.Serializer):
    DATABASE_CHOICES = (
        ("META_DATA", "META_DATA"),
        ("DATA", "DATA"),
    )

    workspace_id = serializers.CharField(
        max_length=100, allow_null=False, allow_blank=False
    )
    """collection_name = serializers.CharField(
        max_length=100, allow_null=False, allow_blank=False
    )"""
    database_type = serializers.MultipleChoiceField(choices=DATABASE_CHOICES)
