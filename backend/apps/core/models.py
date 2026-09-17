from django.db import models


class TimeStampedModel(models.Model):
    """Абстрактная модель с полями created_at и updated_at."""
    
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)
    
    class Meta:
        abstract = True
