# Generated by Django 4.1.2 on 2022-11-28 23:46

from django.db import migrations, models
import django.db.models.deletion
import shops.validators


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_employeedata_shop"),
        ("quotes", "0003_quoterequest_shop_quoterequest_user"),
        ("vehicles", "0001_initial"),
        ("shops", "0010_alter_invitation_unique_together"),
    ]

    operations = [
        migrations.CreateModel(
            name="Appointment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField(blank=True, verbose_name="date")),
                ("time", models.TimeField(blank=True, verbose_name="time")),
                (
                    "duration",
                    models.DurationField(verbose_name="appointment duration in hours"),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "customer",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="accounts.customer",
                    ),
                ),
                (
                    "shop",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="shops.shop"
                    ),
                ),
                (
                    "vehicle",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="vehicles.vehicle",
                    ),
                ),
            ],
            options={
                "verbose_name": "Appointment",
                "verbose_name_plural": "Appointments",
            },
        ),
        migrations.CreateModel(
            name="Service",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=30, verbose_name="service name")),
                (
                    "description",
                    models.TextField(
                        blank=True, null=True, verbose_name="service description"
                    ),
                ),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2, max_digits=10, verbose_name="service price"
                    ),
                ),
            ],
            options={
                "verbose_name": "Service",
                "verbose_name_plural": "Services",
            },
        ),
        migrations.CreateModel(
            name="WorkOrder",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "odometer_reading_before",
                    models.PositiveIntegerField(
                        null=True, verbose_name="odometer reading before"
                    ),
                ),
                (
                    "odometer_reading_after",
                    models.PositiveIntegerField(
                        null=True, verbose_name="odometer reading after"
                    ),
                ),
                (
                    "discount",
                    models.DecimalField(
                        decimal_places=2,
                        default=0,
                        max_digits=5,
                        verbose_name="discount percentage",
                    ),
                ),
                ("notes", models.TextField(blank=True, verbose_name="notes")),
                (
                    "grand_total",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="grand total amount",
                    ),
                ),
                (
                    "appointment",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="shops.appointment",
                    ),
                ),
                (
                    "employee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="accounts.employee",
                    ),
                ),
                (
                    "quote",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="quotes.quote"
                    ),
                ),
                (
                    "shop",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="shops.shop"
                    ),
                ),
            ],
            options={
                "verbose_name": "Work Order",
                "verbose_name_plural": "Work Orders",
            },
        ),
        migrations.CreateModel(
            name="ServicePart",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "quantity",
                    models.PositiveIntegerField(
                        default=1,
                        validators=[shops.validators.validate_nonzero],
                        verbose_name="number of parts",
                    ),
                ),
                (
                    "part",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="vehicles.part"
                    ),
                ),
                (
                    "service",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="shops.service"
                    ),
                ),
            ],
            options={
                "verbose_name": "ServicePart",
                "verbose_name_plural": "ServiceParts",
            },
        ),
        migrations.AddField(
            model_name="service",
            name="parts",
            field=models.ManyToManyField(
                through="shops.ServicePart", to="vehicles.part"
            ),
        ),
        migrations.AddField(
            model_name="service",
            name="shop",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="shops.shop"
            ),
        ),
        migrations.AlterUniqueTogether(
            name="service",
            unique_together={("shop", "name")},
        ),
    ]