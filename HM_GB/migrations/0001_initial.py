# Generated by Django 2.2.4 on 2019-08-20 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TranslateModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('SubFile_Name', models.CharField(max_length=25, null=True)),
                ('SubFile_Lineindex', models.IntegerField(null=True)),
                ('Translate_text_JPN', models.TextField(null=True)),
                ('Translate_text_ENG', models.TextField(null=True)),
                ('Translate_text_KOR1', models.TextField(null=True)),
                ('Translate_text_KOR2', models.TextField(blank=True, null=True)),
                ('Translate_date', models.DateTimeField(auto_now_add=True)),
                ('Translate_IsTranslated', models.BooleanField(default=False)),
            ],
        ),
    ]
