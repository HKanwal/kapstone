# Generated by Django 4.1.2 on 2022-11-07 21:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("shops", "0002_alter_shop_availability_alter_shop_num_bays_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="shop",
            old_name="shopHours",
            new_name="shop_hours",
        ),
    ]
