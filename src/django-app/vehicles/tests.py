from django.test import TestCase
from .models import Vehicle, Part
from accounts.models import Customer


class VehicleTests(TestCase):
    @classmethod
    def setUpTestData(self):
        self.customer = Customer.objects.create(type="customer", username="testcustomer", password="whatever", email="testcustomer@test.com")

    def test_createVehicle(self):
        expectedManufacturer = "BMW"
        expectedModel = "2000"
        expectedColor = "FLAME RED"
        expectedYear = "2000"
        expectedVIN = "11037"

        vehicle = Vehicle.objects.create(manufacturer=expectedManufacturer, model=expectedModel, color=expectedColor, year=expectedYear, vin=expectedVIN, customer=self.customer)

        self.assertEqual(vehicle.manufacturer, expectedManufacturer)
        self.assertEqual(vehicle.model, expectedModel)
        self.assertEqual(vehicle.color, expectedColor)
        self.assertEqual(vehicle.year, expectedYear)
        self.assertEqual(vehicle.vin, expectedVIN)
        self.assertEqual(vehicle.customer, self.customer)

class PartTests(TestCase):
    def test_createPart(self):

        expectedCondition = "new"
        expectedType = "oem"
        expectedName = "testpart"
        expectedPrice = 2.00

        part = Part.objects.create(name=expectedName, type=expectedType, condition=expectedCondition, price=expectedPrice)

        self.assertEqual(part.condition, expectedCondition)
        self.assertEqual(part.type, expectedType)
        self.assertEqual(part.name, expectedName)
        self.assertEqual(part.price, expectedPrice)
