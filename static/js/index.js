const 정답 = "APPLE";

//let은 수정이 가능한 변수 (0번째 시도에 1번째 인덱스)
let attempts = 0;
let index = 0;
let timer;

// keydown event (키보드 누름에 따라 키 인식 로직)
function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display: flex; justify-content:center; position: absolute; align-items:center; top:60vh; left:35vw; font-size: 20px; background-color: grey; width:200; height:100px; margin: -220px 0 0 0;"; //글자가 정중앙에 위치하도록 해보기
    document.body.appendChild(div);
  };
  const gameover = () => {
    window.removeEventListener("keydown", WordleKeydown);
    displayGameover();
    clearInterval(timer);
  };
  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts += 1;
    index = 0;
  };

  // 정답 확인 (서버에 요청을 보내는 비동기 로직)
  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    //서버에서 정답을 받아오는 코드 1(문자열로 만들었을 때)
    const 응답 = await fetch("/answer"); // '응답'은: await 기다려서 /answer로 요청을 보내서 '응답'을 받고
    const 정답 = await 응답.json(); //'정답'은 그 응답을 await 기다려서 '정답'을 업데이트 한다는 의미.
    console.log(정답);

    // //서버에서 정답을 받아오는 코드 2(정답을 객체로 만들었을 때)
    // const 응답 = await fetch("/answer"); //'응답'을 await 기다려서 /answer로 요청을 보내서 '응답'을 받고
    // console.log("응답", 응답);
    // const 정답 = await 응답.json(); //그 응답을 json 은 js한테 맞는 포맷(값)으로 바꿔주는것도 시간이 조금 걸리기 때문에 await 를 써서 기다려주고 바꿔준 그 값을 '정답'에 넣어준다(업데이트 한다)는 의미.
    // console.log("정답 객체", 정답_객체);
    // const 정답 = 정답_객체.answer;
    // console.log("정답", 정답);

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
      else block.style.background = "#787C7E";

      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  //(0번째 시도에 n번째 인덱스)쓰기 위해 backtick ``사용.
  const WordleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    // index가 5일 때 즉, 맨 끝까지 단어가 입력이 됐을 때 Enter키를 누르면 handleEnterKey에 대한 동작이 일어나고, Enter키가 아닌 다른 키가 눌리면 그냥 return해서 끝내라는 뜻.
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };
  const startTimer = () => {
    // 타이머
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", WordleKeydown);
}

appStart();
