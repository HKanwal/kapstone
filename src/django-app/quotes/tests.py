from django.test import TestCase
from shops.models import Shop, Address
from vehicles.models import Vehicle
from .models import Quote, QuoteRequest
from accounts.models import ShopOwner, Customer


class QuoteRequestTests(TestCase):
    @classmethod
    def setUpTestData(self):
        address = Address.objects.create(postal_code="M4E2T2", street="104 Test Street", city="Toronto", country="Canada", province="ON")
        shop_owner = ShopOwner.objects.create_user(type="shop_owner", username="testuser", password="qwerty123", email="testemail@test.com")
        self.customer = Customer.objects.create(type="customer", username="testcustomer", password="whatever", email="testcustomer@test.com")
        self.vehicle = Vehicle.objects.create(manufacturer="that one car maker", model="2", color="unknown", year="2000", vin="11037", customer=self.customer)

        self.shop = Shop.objects.create(shop_owner=shop_owner, shop_email="testemail@test.com", address=address)
        

    def test_createQuoteRequest(self):
        expectedEmail = "testcustomer@test.com"
        expectedDescription = "car machine broke"
        expectedStatus = "Not Accepted"

        quote_request = QuoteRequest.objects.create(shop=self.shop, user=self.customer, preferred_email=expectedEmail, description=expectedDescription, vehicle=self.vehicle)

        self.assertEqual(quote_request.shop, self.shop)
        self.assertEqual(quote_request.user, self.customer)
        self.assertEqual(quote_request.preferred_email, expectedEmail)
        self.assertEqual(quote_request.description, expectedDescription)
        self.assertEqual(quote_request.vehicle, self.vehicle)
        self.assertEqual(quote_request.status, expectedStatus)

    def test_getQuoteRequestStatus(self):
        expectedEmail = "testcustomer@test.com"
        expectedDescription = "car machine broke"
        expectedStatus = "new_quote"

        quote_request = QuoteRequest.objects.create(shop=self.shop, user=self.customer, preferred_email=expectedEmail, description=expectedDescription, vehicle=self.vehicle)
        Quote.objects.create(quote_request=quote_request, shop=self.shop, price=2.00, estimated_time="1 day", expiry_date="2000-01-01")

        self.assertEqual(quote_request.status, expectedStatus)

class QuoteTests(TestCase):
    @classmethod
    def setUpTestData(self):
        address = Address.objects.create(postal_code="M4E2T2", street="104 Test Street", city="Toronto", country="Canada", province="ON")
        shop_owner = ShopOwner.objects.create_user(type="shop_owner", username="testuser", password="qwerty123", email="testemail@test.com")
        self.customer = Customer.objects.create(type="customer", username="testcustomer", password="whatever", email="testcustomer@test.com")
        self.vehicle = Vehicle.objects.create(manufacturer="that one car maker", model="2", color="unknown", year="2000", vin="11037", customer=self.customer)

        self.shop = Shop.objects.create(shop_owner=shop_owner, shop_email="testemail@test.com", address=address)

    def test_createQuote(self):
        expectedNotes = "we will fix your car."
        expectedStatus = "new_quote"
        expectedPrice = 2.00
        expectedTime = "1 day"
        expectedExpiryDate = "2000-01-01"

        quote_request = QuoteRequest.objects.create(shop=self.shop, user=self.customer, preferred_email="email@email.com", description="car machine broke", vehicle=self.vehicle)

        quote = Quote.objects.create(notes=expectedNotes, quote_request=quote_request, shop=self.shop, price=2.00, estimated_time="1 day", expiry_date="2000-01-01")
        
        self.assertEqual(quote.quote_request, quote_request)
        self.assertEqual(quote.shop, self.shop)
        self.assertEqual(quote.status, expectedStatus)
        self.assertEqual(quote.price, expectedPrice)
        self.assertEqual(quote.expiry_date, expectedExpiryDate)
        self.assertEqual(quote.estimated_time, expectedTime)
        self.assertEqual(quote.notes, expectedNotes)