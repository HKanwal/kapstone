# Generated by Django 4.1.2 on 2023-02-13 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("quotes", "0007_quoterequest_vehicle"),
    ]

    operations = [
        migrations.AlterField(
            model_name="quote",
            name="status",
            field=models.CharField(
                choices=[
                    ("new_quote", "New Quote"),
                    ("accepted", "Accepted"),
                    ("rejected", "Rejected"),
                    ("in_progress", "In Progress"),
                    ("done", "Done"),
                    ("rework", "Rework"),
                ],
                default="new_quote",
                max_length=12,
                verbose_name="status",
            ),
        ),
    ]