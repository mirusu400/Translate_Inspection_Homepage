"""
    각종 데이터를 받아와 처리하는 파이썬 파일
"""

from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.shortcuts import render, redirect
from django.views import generic
from django.urls import reverse
from django.template import loader
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.hashers import check_password
from django.db import connection
from .models import TranslateModel
from .forms import SigninForm, SignupForm
from django.forms import ModelForm


def IndexView(request):
    template_name = 'HM_GB/index.html'
    return render(request,template_name)


#실제로 오고가는 파일 처리하는 함수
#DetailView(요청,처리할 파일이름)
def DetailView(request,mesname):
    TEXT_FILE_LIST = ["event_mes_data","mes_data"]  #파일 이름들
    Translate_list = TranslateModel.objects.all()
    context = {'Translate_list': Translate_list,'Request_mes': mesname}
    if(mesname not in TEXT_FILE_LIST):
        return HttpResponseNotFound('<h1>Page not found</h1>') #파일 이름들이 아닌 다른항목으로 접근하면 404
    template_name = 'HM_GB/detail_mes_data.html'
    if request.method == "POST":    #POST 메서드일경우 Query에 저장
        POSTdata = request.POST
        print(POSTdata)
        print("\n\n\n\n\n\n")
        if (POSTdata["PostTranslated"] == "true"):
            IsTranslated = 1
        else:
            IsTranslated = 0
        if (POSTdata["PostInspected"] == "true"):
            IsInspected = 1
        else:
            IsInspected = 0
        with connection.cursor() as cursor:
            update_string = 'UPDATE HM_GB_translatemodel SET Translate_text_KOR2 = "%s", Translate_date = "%s", Translate_IsTranslated = %d, Translate_IsInspected = %d, Translate_text_KORLOG = "%s", Translate_LastEditor = "%s" WHERE id = %d' % (POSTdata["PostTxtKOR2"],
                           POSTdata["PostNowtime"],
                           IsTranslated,
                           IsInspected,
                           POSTdata["PostKORLog"],
                           POSTdata["PostEditor"],
                           int(POSTdata["PostPK"]))
            cursor.execute(update_string)
        return render(request,template_name)
    return render(request,template_name,context)

def changedNoun(request):
    return render(request, 'HM_GB/changedNoun.html')

def signup(request):
    return HttpResponseNotFound('<h1>Page not found</h1>')
    """
    if request.method == "GET":
        return render(request, 'HM_GB/signup.html', {'f': SignupForm()})
    elif request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            if form.cleaned_data['password'] == form.cleaned_data['password_check']:
                # cleaned_data는 사용자가 입력한 데이터를 뜻한다.
                # 즉 사용자가 입력한 password와 password_check가 맞는지 확인하기위해 작성해주었다.

                new_user = User.objects.create_user(form.cleaned_data['username'], form.cleaned_data['email'],
                                                    form.cleaned_data['password'])
                # User.object.create_user는 사용자가 입력한 name, email, password를 가지고 아이디를 만든다.
                # 바로 .save를 안해주는 이유는 User.object.create를 먼저 해주어야 비밀번호가 암호화되어 저장된다.
                new_user.first_name = form.cleaned_data['first_name']
                # 나머지 입력하지 못한 last_name과, first_name은 따로 지정해준다.
                new_user.save()

                return render(request, 'HM_GB/index.html')
            else:
                return render(request, 'HM_GB/signup.html', {'f': form,
                                                                   'error': '비밀번호와 비밀번호 확인이 다릅니다.'})  # password와 password_check가 다를 것을 대비하여 error를 지정해준다.
        else:  # form.is_valid()가 아닐 경우, 즉 유효한 값이 들어오지 않았을 경우는
            return render(request, 'HM_GB/signup.html', {'f': form})
    """

# 원래는 error 메시지를 지정해줘야 하지만 따로 지정해주지 않는다.
def signin(request):  # 로그인 기능
    if request.method == "GET":
        print("asd")
        return render(request, 'HM_GB/signin.html', {'f': SigninForm()})
    elif request.method == "POST":
        form = SigninForm(request.POST)
        id = request.POST['username']
        pw = request.POST['password']
        u = authenticate(username=id, password=pw)
        # authenticate를 통해 DB의 username과 password를 클라이언트가 요청한 값과 비교한다.
        # 만약 같으면 해당 객체를 반환하고 아니라면 none을 반환한다.

        if u:  # u에 특정 값이 있다면
            login(request, user=u)  # u 객체로 로그인해라
            return HttpResponseRedirect(reverse('HM_GB:index'))
        else:
            return render(request, 'HM_GB/signin.html', {'f': form, 'error': '아이디나 비밀번호가 일치하지 않습니다.'})





def signout(request):  # logout 기능
    logout(request)  # logout을 수행한다.
    return HttpResponseRedirect(reverse('HM_GB:index'))
    
def change_pw(request):
    context= {}
    if request.method == "POST":
        current_password = request.POST.get("origin_password")
        user = request.user
        if check_password(current_password,user.password):
            new_password = request.POST.get("password1")
            password_confirm = request.POST.get("password2")
            if new_password == password_confirm:
                user.set_password(new_password)
                user.save()
                login(request, user=user)  # u 객체로 로그인해라
                return HttpResponseRedirect(reverse('HM_GB:index'))
            else:
                context.update({'error':"새로운 비밀번호를 다시 확인해주세요."})
        else:
            context.update({'error':"현재 비밀번호가 일치하지 않습니다."})

    return render(request, "HM_GB/change_pw.html",context)
