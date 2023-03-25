from django.core.management.base import BaseCommand, CommandError
from shops.models import Shop, ShopAvailability, ShopAvailabilitySlot
from datetime import timedelta, datetime
from django.utils.timezone import make_aware


class Command(BaseCommand):
    help = "Generates a list of available slots for two weeks"

    def add_arguments(self, parser):
        parser.add_argument("-s", "--shop", type=int)

    def _generate_shop_availability(self, shop, date, shop_hours):
        if shop_hours == None:
            return
        shop_availability_day, created = ShopAvailability.objects.get_or_create(
            shop=shop,
            date=date,
        )
        shop_availability_slot, created = ShopAvailabilitySlot.objects.get_or_create(
            shop_availability=shop_availability_day,
            defaults={
                "start_time": make_aware(shop_hours.from_time),
                "end_time": make_aware(shop_hours.to_time),
            },
        )

    def _manage_slots_for_date(self, shop, date):
        day = date.strftime("%A").lower()
        shop_hours = shop.get_hours_for_day(day)
        if shop_hours != None:
            self._generate_shop_availability(shop, date, shop_hours)

    def handle(self, *args, **options):
        days = 14

        if options["shop"]:
            shops = Shop.objects.filter(id=options["shop"])
        else:
            shops = Shop.objects.all()

        for shop in shops:
            for i in range(days):
                date = make_aware(datetime.now()) + timedelta(days=i)
                self._manage_slots_for_date(shop, date)

            self.stdout.write(
                self.style.SUCCESS("Generating appointments for Shop: %s" % shop.name)
            )

        success_message = f"Successfully generated appointments for: {', '.join([shop.name for shop in shops])}"

        self.stdout.write(self.style.SUCCESS(success_message))

        return success_message
