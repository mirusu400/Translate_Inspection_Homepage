from django.urls import path
from . import views

app_name = 'HM_GB'

urlpatterns = [
    path('<mesname>', views.DetailView, name='detail_mes_data'),
    path('', views.IndexView, name='index'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('change_pw/', views.change_pw, name='change_pw'),
    #path('<int:question_id>/', views.DetailView.as_view(), name='detail'),
    #path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    #path('<int:question_id>/vote/', views.vote, name='vote'),
]