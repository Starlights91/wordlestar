# 39강 예4
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

answer='APPLE'

@app.get('/answer')
def get_answer():
    return answer
    # return {'answer':answer}  #answer안에 내가 지정한 answer값인 TRAIN을 넣어서 객체로 보내는 방법. (.js 파일: 서버에서 정답을 받아오는 코드 2(정답을 객체로 만들었을 때))
    
app.mount("/", StaticFiles(directory="static",html=True), name="static")