#-*- coding:utf-8 -*-
import sqlite3
import os
con = sqlite3.connect('db.sqlite3')
JPN_dir = 'D:/한글화/목장이야기 바람의바자회/데이터 언팩/JPN_mes_data_txt'
ENG_dir = 'D:/한글화/목장이야기 바람의바자회/데이터 언팩/US_mes_data_txt'
KOR_dir = 'D:/한글화/목장이야기 바람의바자회/데이터 언팩/KOR_mes_data_txt'

sql = "INSERT INTO HM_GB_translatemodel(SubFile_Name, SubFIle_Lineindex,Translate_text_JPN,Translate_text_ENG,Translate_text_KOR1, Translate_date, Translate_IsTranslated, Translate_IsInspected) VALUES(?,?,?,?,?,?,0,0)"

JPN_list = os.listdir(JPN_dir)
ENG_list = os.listdir(ENG_dir)
KOR_list = os.listdir(KOR_dir)
'''
JPN_list = 파일 명을 담고있는 리스트
JPN_File = 파일 명
JPN_Open 파일을 열었을때 메소드
JPN_Arr = 파일을 열었을때의 각 라인 배열
JPN_Txt = 한 줄
'''
print(JPN_list)
for i in range(0,len(JPN_list)):
    print(i)
    JPN_File = JPN_dir + "\\" + JPN_list[i]
    ENG_File = ENG_dir + "\\"  + ENG_list[i]
    KOR_File = KOR_dir + "\\"  + KOR_list[i]
    FILE_NAME = JPN_list[i]
    print(JPN_list[i])
    JPN_Open = open(JPN_File,'r',encoding='utf-8-sig')
    JPNArr = [line for line in JPN_Open.readlines() if line.strip()]
    ENG_Open = open(ENG_File,'r',encoding='utf-8-sig')
    ENGArr = [line for line in ENG_Open.readlines() if line.strip()]
    KOR_Open = open(KOR_File,'r',encoding='utf-8-sig')
    KORArr = [line for line in KOR_Open.readlines() if line.strip()]
    JPN_Open.close()
    ENG_Open.close()
    KOR_Open.close()
    for k in range(0,len(JPNArr)):
        cursor = con.cursor()
        JPNTxt = JPNArr[k].replace("\n","")
        ENGTxt = ENGArr[k].replace("\n","")
        KORTxt = KORArr[k].replace("\n","")
        cursor.execute(sql,(FILE_NAME,k,JPNTxt,ENGTxt,KORTxt,0))


con.commit()
con.close()