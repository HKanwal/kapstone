# Generated by Django 4.1.2 on 2023-01-02 05:41

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("shops", "0014_shopavailability_remove_appointment_date_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="appointment",
            name="end_time",
        ),
        migrations.RemoveField(
            model_name="appointment",
            name="start_time",
        ),
        migrations.AddField(
            model_name="appointment",
            name="duration",
            field=models.DurationField(
                default=datetime.timedelta(seconds=1800), verbose_name="Duration"
            ),
        ),
    ]