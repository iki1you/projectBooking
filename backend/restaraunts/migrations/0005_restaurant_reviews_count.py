# Generated by Django 5.0.4 on 2024-05-04 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaraunts', '0004_remove_restaurant_reviews_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='reviews_count',
            field=models.IntegerField(default=0),
        ),
    ]
