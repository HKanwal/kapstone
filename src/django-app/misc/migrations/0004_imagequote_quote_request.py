# Generated by Django 4.1.2 on 2023-01-19 21:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("quotes", "0005_remove_quoterequest_images"),
        ("misc", "0003_remove_imagequote_quote_request"),
    ]

    operations = [
        migrations.AddField(
            model_name="imagequote",
            name="quote_request",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="quotes.quoterequest",
            ),
        ),
    ]