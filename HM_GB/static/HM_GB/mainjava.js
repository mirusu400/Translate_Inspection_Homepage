setInterval("dpTime()",1000);
window.onload = function () {
	JPElem = document.getElementById("TxtJpn");
	ENElem = document.getElementById("TxtEng");
	KRElem = document.getElementById("TxtKOR1");
	KR2Elem = document.getElementById("TxtKOR2");
	IsTransElem = document.getElementById("isTranslated");
	IsInspeElem = document.getElementById("isInspected");
	TransDateElem = document.getElementById("Transtime");
	NowTimeElem = document.getElementById("nowtime");
	KORLogElem = document.getElementById("KORLog");
	EditorElem = document.getElementById("ShowEditorName");
	var PreviewIndex = 0;
	SelectSubIndex();
	
}
$(document).keyup(function(event) {
	var element = document.activeElement
	if(element != KR2Elem)
	{
		if (event.keyCode == '37' || event.keyCode == '38') { //왼쪽 화살표 + 위쪽
			goprev();
		}
		else if (event.keyCode == '39' || event.keyCode == '40') { //오른쪽 화살표 + 아래
			gonext();
		}
	}
});



/*
함수 설명
PutArray(chknum)	수정한 데이터들을 배열에 다시 저장하는 함수
Submitform(chknum)	각종 데이터들을 Django로 보내서 저장하는 함수
FileGet		각 파일명을 노출되게 하는 함수. SubFileArr의 데이터를 읽어와서 Select 항목에 저장
SelectSubIndex	파일을 선택했을때 각 라인을 노출되게 하는 함수. SubFileLineArr 데이터를 이용
checkstatue(linePK)	SelectSubIndex 함수 내에 쓰이며 각 라인 설명(text)를 다는데 사용되는 함수
chkViewPrev		게임 실행화면 미리보기를 할건지 말건지에 관한 함수
changeExPreview	미리보기 배열을 만드는 관련 함수
SelectLine		라인을 선택했을때 그 라인에 맞는 PK를 가져와 Change하는 함수
ChangeTxt(ord)	배열에서 값을 가져와 모든 폼의 값을 변경하는 함수.
auto_grow(element)	textarea 폼의 값을 자동으로 조절해주는 함수
goprev, gonext	각 라인을 선택하는 Option 값을 앞/뒤로 가는 함수
goExPrev, goExnext	각 미리보기를 앞/뒤로 이동하는 함수
*/



//--------------------------------

function PutArray(chknum) {
	var edit = document.getElementById("EditorName");
	KOR2Arr[NumIndex] = KR2Elem.value;
	if(chknum >= 1)
		IsTransArr[NumIndex] = "true";
	if(chknum == 2)
		IsInspeArr[NumIndex] = "true";
	else
		IsInspeArr[NumIndex] = IsInspeElem.checked;
	TransDateArr[NumIndex] = NowTimeElem.value;
	EditorArr[NumIndex] = username;
	SubFileLineArr[NumIndex] = checkstatue(NumIndex); //재반영을 위해서 수정해줌. POST값에는 안들어감
	KORLogArr[NumIndex] = "---------------------" + NowTimeElem.value + "<" + KR2Elem.value +  "---------------------" + KORLogArr[NumIndex]
}
function Submitform(chknum) {
	if(((IsInspeArr[NumIndex] == "False") || (IsInspeArr[NumIndex] == false)) && (KR2Elem.value != "") && (KR2Elem.value != "None"))
	{
		PutArray(chknum)
		if($('#nowtime').val() !== "")
		{
			var csrftoken = getCookie('csrftoken');
			var posting = $.post('',
			{ 
				'csrfmiddlewaretoken': csrftoken,
				'PostPK': PKarr[NumIndex], 
				'PostTxtKOR2': KOR2Arr[NumIndex], 
				'PostTranslated': IsTransArr[NumIndex], 
				'PostInspected': IsInspeArr[NumIndex], 
				'PostNowtime': TransDateArr[NumIndex], 
				'PostEditor': EditorArr[NumIndex], 
				'PostKORLog': KORLogArr[NumIndex],
			});
			posting.fail(function(jqXHR) {
				SendFailToast("Fail!","알수없는 이유로 저장을 실패했습니다")
			})
			posting.done(function(jqXHR) {
				SelectSubIndex()
				$("#TextIndexID").val(NumIndex).prop("selected", true);
				SendSucToast("Done!","정상적으로 저장이 완료되었습니다")
			})
		}
		else
		{
			SendFailToast("Fail!","로드가 덜 된 상태에서 Submit을 요청했습니다.")
			
		}
	}
	else
	{
		SendFailToast("Fail!","검수완료된 텍스트나 아무것도 없는 텍스트를\nSubmit 할려고 했습니다.")
	}
	//post("", data); 
}
function FileGet() {
	var TransItems=0;
	var OriItems=0;
	var Fileval = document.getElementById("Subindex");
	
	for(var i=0; i < SubFileArr.length-1; i++)
	{
		//if (temp != SubFileArr[i])
		if(KOR2Arr[i] != "None")
				TransItems++;
		if (SubFileArr[i] != SubFileArr[i+1])
		{
			
			var objOption = document.createElement("option");
			objOption.text = SubFileArr[i] + " " + TransItems + " / " + OriItems;
			objOption.value = i+1
			TransItems = 0;
			OriItems = 0;
			Fileval.add(objOption);
		}
		OriItems++;
	}
	var objOption = document.createElement("option");
	objOption.text = SubFileArr[i] + " " + TransItems + " / " + (OriItems - 1);
	objOption.value = i
	Fileval.add(objOption);
}
function SelectSubIndex() {
	var temp = 0;
	var fileindexnum = 0;
	var select = document.getElementById("Subindex");
	var option_value = select.options[select.selectedIndex].value;
	var Indexval = document.getElementById("TextIndexID");
	var OriItems = select.options[select.selectedIndex].text.split("/")[1];
	Maxline = 0;
	Indexval.options.length=0;		//옵션 초기화
	linePK = option_value - OriItems; //0번째 항목부터 Index하기
	

	var objOption = document.createElement("option");
	objOption.text = checkstatue(linePK);
	objOption.value = linePK;
	Indexval.add(objOption);
	linePK++;
	Maxline++;
	while(1)
	{
		var objOption = document.createElement("option");       
		objOption.text = checkstatue(linePK);
		objOption.value = linePK;
		Indexval.add(objOption);
		if(linePK == SubFileLineArr.length)
		{
			break;
		}
		linePK++;
		Maxline++;
		if(SubFileLineArr[linePK] == 0)
		{
			break;
		}
	}
}
function checkstatue(linePK) {
	var optxt;
	if(IsTransArr[linePK] == "True" || IsTransArr[linePK] == "true")
	{
		if(IsInspeArr[linePK] == "True" || IsInspeArr[linePK] == "true")
			optxt = SubFileLineArr[linePK] + "|" + "검수완료" + "|" + KOR2Arr[linePK];
		else
			optxt = SubFileLineArr[linePK] + "|" + "번역완료" + "|" + KOR2Arr[linePK];
	}
	else
		optxt = SubFileLineArr[linePK] + "|" + "번역안됨" + "|" + KOR2Arr[linePK];
	return optxt
}
function SelectLine() {
	a = document.getElementById("TextIndexID")
	NumIndex = a.options[a.selectedIndex].value;
	ChangeTxt(NumIndex);
}
function ChangeTxt(ord) {
	
	//변경 될때 텍스트 변경
	JPElem.value = ConvertSystemSourcetoHtml(JPNArr[ord]);
	ENElem.value = ConvertSystemSourcetoHtml(ENGArr[ord]);
	KRElem.value = ConvertSystemSourcetoHtml(KOR1Arr[ord]);
	KR2Elem.value = ConvertSystemSourcetoHtml(KOR2Arr[ord]);
	TransDateElem.value = TransDateArr[ord];
	KORLogElem.value = ConvertSystemSourcetoHtml(KORLogArr[ord]);
	EditorElem.value = EditorArr[ord];
	
	if(IsTransArr[ord] == "True" || IsTransArr[ord] == "true" )
		IsTransElem.checked = true;
	else
		IsTransElem.checked = false;
	if(IsInspeArr[ord] == "True" || IsInspeArr[ord] == "true" )
		IsInspeElem.checked = true;
	else
		IsInspeElem.checked = false;
	if(KR2Elem.value == "None")
		KR2Elem.value = "";
	chkInspected(IsInspeElem);
	setKOR2TxtFocus();
	auto_grow(JPElem);
	auto_grow(ENElem);
	auto_grow(KRElem);
	PreviewIndex = 0;
	changeExPreview();
	return;
}
function chkViewPrev() {
	if(ViewPrev == false)
	{
		ViewPrev = true;
		changeExPreview();
	}
	else
		ViewPrev = false;
	return
}
function changeExPreview() {
	if(ViewPrev == true)
	{
		Txt = KR2Elem.value
		var Txtarray = new Array();
		var ReturnTxt = "";
		var TmpIndex = 0;
		
		PreviewArray.length = 0;
		Txtarray = Txt.split("");
		for (var i=0; i<Txtarray.length; i++)
		{
			if(Txtarray[i] == "[")
			{
				var TmpTxt = Txtarray[i] + Txtarray[i+1] + Txtarray[i+2] + Txtarray[i+3] + Txtarray[i+4] + Txtarray[i+5]
				if(TmpTxt == "[2823]") //줄 넘김
					ReturnTxt += "<br>"
				else if(TmpTxt == "[2A23]") //주인공이름
					ReturnTxt += document.getElementById("PrevName").value
				else if(TmpTxt == "[0010]" || TmpTxt == "[0110]" || TmpTxt == "[0210]" ||  TmpTxt == "[0310]" || TmpTxt == "[0410]" || TmpTxt == "[0510]" || TmpTxt == "[0610]" || TmpTxt == "[0710]" || TmpTxt == "[0810]" || TmpTxt == "[0910]" || TmpTxt == "[0A10]" || TmpTxt == "[0B10]" || TmpTxt == "[0C10]" || TmpTxt == "[0D10]" || TmpTxt == "[0E10]") //기타
					ReturnTxt += document.getElementById("PrevNameOther").value
				else if(TmpTxt == "[9123]") //주인공이름(결혼이후)
					ReturnTxt += document.getElementById("PrevNameAfter").value
				else if(TmpTxt == "[3723]") //자녀이름
					ReturnTxt += document.getElementById("PrevNameBirth").value
				else if(TmpTxt == "[6E20]") //파란색
					ReturnTxt += '<span class="bluePrvTxt">'
				else if(TmpTxt == "[6D20]") //빨간색
					ReturnTxt += '<span class="redPrvTxt">'
				else if(TmpTxt == "[6F20]") //빨간색
					ReturnTxt += '<span class="greenPrvTxt">'
				else if(TmpTxt == "[6C20]") //일반색
					ReturnTxt += '</span>'
				else if(TmpTxt == "[2B23]") //칸 넘김
				{
					PreviewArray[TmpIndex] = ReturnTxt;
					TmpIndex++;
					ReturnTxt = "";
				}
				else if(TmpTxt == "[0E27]") //텍스트 EOF
				{
					PreviewArray[TmpIndex] = ReturnTxt;
					$("#previewTxt").html(PreviewArray[PreviewIndex]);
					return
				}
				i+=5;
			}
			else if(Txtarray[i] == " ")
				ReturnTxt += "　"
			else if(Txtarray[i] == ".")
				ReturnTxt += "。"
			else if(Txtarray[i] == ",")
				ReturnTxt += "、"
			else if(Txtarray[i] == "?")
				ReturnTxt += "？"
			else if(Txtarray[i] == "!")
				ReturnTxt += "！"
			else
			{
				ReturnTxt += Txtarray[i];
			}
		}
		PreviewArray[TmpIndex] = ReturnTxt;
		$("#previewTxt").html(PreviewArray[PreviewIndex]);
		return
	}
	else
	{
		return
	}
}
function goExPrev() {
	if(PreviewIndex == 0)
	{
		SendWarnToast("Fail!","End of line!");
	}
	else
	{
		PreviewIndex--;
		$("#previewTxt").html(PreviewArray[PreviewIndex]);
	}
	
}
function goExNext() {
	if(PreviewIndex == (PreviewArray.length - 1))
	{
		SendWarnToast("Fail!","End of line!");
	}
	else
	{
		PreviewIndex++;
		$("#previewTxt").html(PreviewArray[PreviewIndex]);
	}
	
}




/* Maybe Not Changed FOREVER */


function goprev() {
	var sel = document.getElementById("TextIndexID");
	tt = sel.options[sel.selectedIndex].text.split('|')[0];
	if((NumIndex == 0) || (tt == "0")) //|| (sel.options[sel.selectedIndex - 1].value === undefined))
	{
		SendWarnToast("Fail!","End of line!");
	}
	else
	{
		NumIndex--;
		sel.selectedIndex = NumIndex;
		$("#TextIndexID").val(NumIndex).prop("selected", true);
		ChangeTxt(NumIndex);
	}
}
//다음버튼 누르기
function gonext() {
	var sel = document.getElementById("TextIndexID");
	tt = sel.options[sel.selectedIndex].text.split('|')[0];
	tt *= 1
	if((sel.length == Number(NumIndex) + 1) || tt == Maxline - 1)
	{
		SendWarnToast("Fail!","End of line!");
	}
	else
	{
		NumIndex++;
		sel.selectedIndex = NumIndex;
		$("#TextIndexID").val(NumIndex).prop("selected", true);
		ChangeTxt(NumIndex);
	}
}


function chkInspected(box) {
	var dis = document.getElementById("TxtKOR2");
	if(box.checked == true)
	{
		dis.readOnly = true;
	}
	else if(box.checked == false)
	{
		dis.readOnly = false;
	}
}
function onclickTrans(box) {
	IsInspeElem = document.getElementById("isInspected");
	if((verify == 0) && (IsInspeElem.checked == true))
	{
		SendFailToast("Fail!","검수완료된 항목은 더이상 조작이 불가능합니다");
		if(box.checked == true)
			box.checked = false;
		else
			box.checked = true;
	}
}

function onclickInspec(box)
{
	if(verify == 1)
		chkInspected(box);
	else
	{
		SendFailToast("Fail!","로그인한 유저만 본 항목을 조작할 수 있습니다");
		if(box.checked == true)
			box.checked = false;
		else
			box.checked = true;
	}
}

function GetKORorigin() {
	KR1Elem = document.getElementById("TxtKOR1");
	KR2Elem = document.getElementById("TxtKOR2");
	KR2Elem.value = KR1Elem.value;
}
function GetJPNorigin() {
	JPElem = document.getElementById("TxtJpn");
	KR2Elem = document.getElementById("TxtKOR2");
	KR2Elem.value = JPElem.value;
}
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

function setKOR2TxtFocus() {
	document.getElementById("TxtKOR2").focus();
}
function dpTime(){
	var now = new Date();
	year = now.getFullYear();
	month = now.getMonth() + 1;
	date = now.getDate();
	hours = now.getHours();
	minutes = now.getMinutes();
	seconds = now.getSeconds();
	if (hours > 12) {
		hours -= 12; ampm = "오후 ";
	}
	else
		ampm = "오전 ";
	if (hours < 10)
		hours = "0" + hours;
	if (minutes < 10)
		minutes = "0" + minutes;
	if (seconds < 10)
		seconds = "0" + seconds;
	document.getElementById("nowtime").value = year + "-" + month + "-" + date + " " + ampm + hours + ":" + minutes + ":" + seconds;
}
function ConvertSystemSourcetoHtml(str){
	str = str.replace(/&#39;/g, "'");
	return str;
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function SendWarnToast(Head, Body) {
	$.toast({
		icon: 'warning',
		heading: Head,
		text: Body,
		position: 'bottom-right',
		stack: false,
		hideAfter: 3000,
		showHideTransition: 'plain',
		allowToastClose: true,
	})
}
function SendFailToast(Head, Body) {
	$.toast({
		icon: 'error',
		heading: Head,
		text: Body,
		position: 'bottom-right',
		stack: false,
		hideAfter: 3000,
		showHideTransition: 'plain',
		allowToastClose: true,
	})
}
function SendSucToast(Head,Body) {
	$.toast({
		icon: 'success',
		heading: Head,
		text: Body,
		position: 'bottom-right',
		stack: false,
		hideAfter: 3000,
		showHideTransition: 'plain',
		allowToastClose: true,
	})
}






