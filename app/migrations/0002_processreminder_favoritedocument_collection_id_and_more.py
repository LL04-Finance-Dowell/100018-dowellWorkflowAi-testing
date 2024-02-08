# Generated by Django 4.1.7 on 2024-01-31 16:18

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProcessReminder',
            fields=[
                ('_id', models.TextField(primary_key=True, serialize=False)),
                ('last_reminder_datetime', models.TextField(max_length=100)),
                ('process_created_by', models.TextField(max_length=50)),
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
