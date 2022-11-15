# Generated by Django 4.1.2 on 2022-11-08 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("shops", "0004_shop_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="shop",
            name="name",
            field=models.CharField(
                max_length=255, unique=True, verbose_name="shop name"
            ),
        ),
    ]