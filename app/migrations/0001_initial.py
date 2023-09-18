# Generated by Django 4.0 on 2023-09-18 19:49

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FavoriteDocument',
            fields=[
                ('_id', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('document_name', jsonfield.fields.JSONField(default=dict)),
                ('company_id', jsonfield.fields.JSONField(default=dict)),
                ('favourited_by', models.TextField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='FavoriteTemplate',
            fields=[
                ('_id', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('company_id', jsonfield.fields.JSONField(default=dict)),
                ('template_name', jsonfield.fields.JSONField(default=dict)),
                ('favourited_by', models.TextField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='FavoriteWorkflow',
            fields=[
                ('_id', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('company_id', jsonfield.fields.JSONField(default=dict)),
                ('workflows', jsonfield.fields.JSONField(default=dict)),
                ('favourited_by', models.TextField(max_length=200)),
            ],
        ),
    ]
