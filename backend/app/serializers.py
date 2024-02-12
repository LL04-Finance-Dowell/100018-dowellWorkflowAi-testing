from rest_framework import serializers

from .models import (
    FavoriteDocument,
    FavoriteTemplate,
    FavoriteWorkflow,
)


class FavouriteDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteDocument
        fields = "__all__"


class FavouriteTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteTemplate
        fields = "__all__"


class FavouriteWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteWorkflow
        fields = "__all__"
