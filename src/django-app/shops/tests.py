from django.test import TestCase
from .models import Shop, Address
from accounts.models import User, ShopOwner

class BasicShopTestCase(TestCase):
    def setUp(self):
        Address.objects.create(postal_code="M4E2T2", street="104 Test Street", city="Toronto", country="Canada", province="ON")
        ShopOwner.objects.create_user(username="testuser", password="qwerty123", email="testemail@test.com")

    def test_shop_creation(self):
        
        shop_owner = User.objects.get(username="testuser")
        address = Address.objects.get(street="104 Test Street")
        
        shop = Shop.objects.create(shop_owner=shop_owner, shop_email="testemail@test.com", address=address)

        self.assertEqual(shop, Shop.objects.get(shop_owner=shop_owner))
