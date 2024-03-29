# Generated by Django 4.1.7 on 2024-02-08 23:59

from django.db import migrations, models
import jsonfield.fields
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProcessReminder',
            fields=[
                ('_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('process_id', models.TextField()),
                ('step_finalizer', models.TextField()),
                ('email', jsonfield.fields.JSONField(default=dict)),
                ('interval', jsonfield.fields.JSONField(default=dict)),
                ('last_reminder_datetime', jsonfield.fields.JSONField(default=dict)),
                ('created_by', models.TextField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='favoritedocument',
            name='collection_id',
            field=jsonfield.fields.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='favoritetemplate',
            name='collection_id',
            field=jsonfield.fields.JSONField(default=dict),
        ),
    ]
