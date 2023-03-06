# Generated by Django 4.1.2 on 2023-02-13 22:30

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("quotes", "0008_alter_quote_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="quote",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True,
                default=django.utils.timezone.now,
                verbose_name="created at",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="quoterequest",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True,
                default=django.utils.timezone.now,
                verbose_name="created at",
            ),
            preserve_default=False,
        ),
    ]
