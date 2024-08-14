# 39강 예4
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

answer='APPLE'

# 정답 확인하는 코드
@app.get('/answer')
def get_answer():
    return answer #문자열로 값을 내주는 방법.
    # return {'answer':answer}  #answer안에 내가 지정한 answer값인 APPLE을 넣어서 객체로 보내는 방법. (.js 파일: 서버에서 정답을 받아오는 코드 2(정답을 객체로 만들었을 때))

    # "/" 루트 경로로 들어갔을 때 파일이 뜰 수 있도록 설정. StaticFiles의 위치: "static"폴더(html,js,css)로 주면서 ,html=True(index.html과css,js함께 보여준다)로 하면 경로가 조금 더 깔끔해진다. 
app.mount("/", StaticFiles(directory="static",html=True), name="static")