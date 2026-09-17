from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Пользователь системы с расширенными полями."""
    
    ROLE_CHOICES = [
        ('admin', 'Администратор'),
        ('dispatcher', 'Диспетчер'),
        ('engineer', 'Инженер'),
        ('viewer', 'Наблюдатель'),
    ]
    
    phone = models.CharField('Телефон', max_length=20, blank=True)
    role = models.CharField('Роль', max_length=20, choices=ROLE_CHOICES, default='viewer')
    department = models.CharField('Отдел', max_length=100, blank=True)
    is_dispatcher = models.BooleanField('Диспетчер', default=False)
    is_engineer = models.BooleanField('Инженер', default=False)
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['username']
    
    def __str__(self):
        return f'{self.username} ({self.get_role_display()})'
    
    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser
