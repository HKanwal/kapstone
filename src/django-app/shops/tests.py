from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from .models import Shop, Address, Service, ServicePart
from accounts.models import ShopOwner, Employee, EmployeeData
from vehicles.models import Part

class AddressTests(TestCase):
    def test_addressCreation(self):
        address = Address.objects.create(postal_code="M4E2T2", street="102 Test Street", city="Toronto", country="Canada", province="ON")

        self.assertEqual(address.postal_code,"M4E2T2")
        self.assertEqual(address.street,"102 Test Street")
        self.assertEqual(address.city,"Toronto")
        self.assertEqual(address.country,"Canada")
        self.assertEqual(address.province,"ON")

class ShopTests(TestCase):
    @classmethod
    def setUpTestData(self):
        address = Address.objects.create(postal_code="M4E2T2", street="104 Test Street", city="Toronto", country="Canada", province="ON")
        shop_owner = ShopOwner.objects.create_user(type="shop_owner", username="testuser", password="qwerty123", email="testemail@test.com")
        
        self.shop = Shop.objects.create(shop_owner=shop_owner, shop_email="testemail@test.com", address=address)
        self.employee = Employee.objects.create_user(username="testemployee", password="whatever", email="testemployee@test.com")
        self.employeeData = EmployeeData.objects.create(user=self.employee, shop=self.shop)

    def test_Employees(self):
        employee = EmployeeData.objects.filter(shop__pk=self.shop.pk)
        self.assertEqual(self.shop.num_employees, 1)
        self.assertQuerysetEqual(self.shop.get_employees(), employee)

    def test_hasEmployee(self):
        
        id = self.employeeData.user.pk

        self.assertTrue(self.shop.has_employee(id))

class ServicesTests(APITestCase):
    @classmethod
    def setUpTestData(self):
        address = Address.objects.create(postal_code="M4E2T2", street="104 Test Street", city="Toronto", country="Canada", province="ON")
        self.shop_owner = ShopOwner.objects.create_user(type="shop_owner", username="testuser2", password="qwerty123", email="testemail@test.com")
        self.shop = Shop.objects.create(shop_owner=self.shop_owner, shop_email="testemail2@test.com", address=address)

        self.part1 = Part.objects.create(condition="new", type="oem", name="testpart1", price="2.00")
        self.part2 = Part.objects.create(condition="used", type="aftermarket", name="testpart2", price="2.00")
    
    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(self.shop_owner)
    
    def test_createService(self):
        expectedPartList = [self.part1.pk]
        expectedName = "testname"
        expectedDescription = "test description"
        expectedActive = True

        response = self.client.post('/shops/services/', {'shop': self.shop.pk, 'name': expectedName, 'description': expectedDescription, 'price': 2.00, 'parts': [self.part1.pk], 'active': True})
        id = response.data['id']
        service = Service.objects.get(pk=id)

        self.assertEqual(service.name, expectedName)
        self.assertEqual(service.description, expectedDescription)
        self.assertEqual(service.shop, self.shop)
        self.assertEqual(service.price, 2.00)
        self.assertEqual(response.data['parts'], expectedPartList)
        self.assertEqual(service.active, expectedActive)

        self.assertEqual(self.part1.pk, ServicePart.objects.get(part=self.part1).pk)
    
    def test_updateServiceSwapPart(self):
        expectedPartList = [self.part2.pk]
        expectedName = "testname"
        expectedDescription = "test description"
        expectedActive = True

        response = self.client.post('/shops/services/', {'shop': self.shop.pk, 'name': expectedName, 'description': expectedDescription, 'price': 2.00, 'parts': [self.part1.pk], 'active': True})
        id = response.data['id']
        response = self.client.patch(f'/shops/services/{id}/', {'shop': self.shop.pk, 'name': expectedName, 'description': expectedDescription, 'price': 2.00, 'parts': [self.part2.pk], 'active': True})
        

        service = Service.objects.get(pk=id)

        self.assertEqual(service.name, expectedName)
        self.assertEqual(service.description, expectedDescription)
        self.assertEqual(service.shop, self.shop)
        self.assertEqual(service.price, 2.00)
        self.assertEqual(response.data['parts'], expectedPartList)
        self.assertEqual(service.active, expectedActive)

        self.assertEqual(self.part2.pk, ServicePart.objects.get(part=self.part2).part.pk)


