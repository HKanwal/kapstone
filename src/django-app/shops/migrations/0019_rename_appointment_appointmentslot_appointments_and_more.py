# Generated by Django 4.1.2 on 2023-01-03 17:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("shops", "0018_alter_appointmentslot_appointment"),
    ]

    operations = [
        migrations.RenameField(
            model_name="appointmentslot",
            old_name="appointment",
            new_name="appointments",
        ),
        migrations.RemoveField(
            model_name="appointmentslot",
            name="num_slots",
        ),
    ]
