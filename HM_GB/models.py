import datetime
from django.db import models
from django.utils import timezone

class TranslateModel(models.Model):
    SubFile_Name = models.CharField(max_length=25,null=True)
    SubFile_Lineindex = models.IntegerField(null=True)
    Translate_text_JPN = models.TextField(null=True)
    Translate_text_ENG = models.TextField(null=True)
    Translate_text_KOR1 = models.TextField(null=True)
    Translate_text_KOR2 = models.TextField(null=True,blank=True)
    Translate_date = models.CharField(max_length=25)
    Translate_IsTranslated = models.BooleanField(default=False)
    Translate_IsInspected = models.BooleanField(default=False)
    Translate_text_KORLOG = models.TextField(null=True, blank=True)
    Translate_LastEditor = models.TextField(null=True, blank=True)
# Create your models here.
