from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import (
    User,
    ShopOwner,
    Employee,
    Customer,
    ShopOwnerData,
    EmployeeData,
    CustomerData,
)

admin.site.register(User)

admin.site.register(ShopOwner)
admin.site.register(ShopOwnerData)

admin.site.register(Employee)
admin.site.register(EmployeeData)

admin.site.register(Customer)
admin.site.register(CustomerData)
