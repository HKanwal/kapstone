from django.core.exceptions import ValidationError


def validate_nonzero(value):
    if value == 0:
        raise ValidationError(
            ("Enter a value greater than 0"),
            params={"value": value},
        )
