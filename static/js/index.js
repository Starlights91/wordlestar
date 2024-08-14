// const 정답 = "APPLE";

let index = 0; // let=수정가능한 변수. index 시작 번호는 0번부터 시작.
let attempts = 0; // N번째 시도 횟수.
let timer; // 타이머.

// keydown event (키보드 누름에 따라 키 인식 로직)
function appStart() {
  const handleClick = (event) => {
    const keyText = event.target.textContent; //클릭한 키의 텍스트
    const keyId = event.target.id; //클릭한 키의 아이디
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    if (keyText === "ENTER") {
      handleEnterKey();
    } else if (keyId === "back-key") {
      handleBackspace();
    } else {
      thisBlock.innerText = keyText;
      index += 1;
    }
  };

  const keys = document.querySelectorAll(".keyboard-column"); //일반키들 전체 선택하기
  //반환받은 keys는 리스트형식이다. 따라서 keys 자체에 이벤트를 줄수 없기 때문에 배열순회함수인 foreach로 key라는 이름의 매개변수로 정한 요소 하나 하나에 이벤트를 준다.
  keys.forEach((key) => {
    key.addEventListener("click", handleClick);
  });
  const spKeys = document.querySelectorAll(".keyboard-column wide"); //특수키(enter,backspace)들 전체 선택하기
  spKeys.forEach((spkey) => {
    spkey.addEventListener("click", handleClick);
  });

  // function appStart() {
  // .js에서 html 부분 추가로 게임 종료 메시지 보여주기
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:30vh; left:42vw; background-color:white; width:200px; height:100px;"; // position:absolute;는 body 기준으로 absolute가 올라간다(css에서 따로 absolute를 입력하지 않은 이상). & top:40vh; left:45vw;는 왼쪽부터 보는 화면에 45%에 위치하도록.
    document.body.appendChild(div);
  };

  //다음줄로 넘어가기
  const nextLine = () => {
    if (attempts === 6) return gameover(); // 6번째시도는 다음입력이 아닌 return함수로 gameover();호출하고 빠져나오기.
    attempts += 1;
    index = 0; // nextLine 함수에서 index 시작 번호 0번부터 다시 시작.
  };

  // 게임 종료: (그 다음 키가 입력되지 않도록 함)
  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown); //이 이벤트를 지워준다.
    displayGameover();
    clearInterval(timer); //하단의 timer = setInterval(setTime, 1000);를 잠깐 저장해두었다가 게임끝나면 clear.
  };

  // 엔터 키로 정답 확인: (await, async: 서버에 요청을 보내는 비동기 로직)
  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드1 (문자열로 만들었을 때):
    //fetch는 JS에서 서버(main.py)로 "/answer"라는 경로로 요청 보내고,
    const 응답 = await fetch("/answer");
    //응답을 받고 그 응답을 json 포맷으로 변경을 기다리면 정답 값 안에 있다.
    const 정답 = await 응답.json();

    // //서버에서 정답을 받아오는 코드 2(정답을 객체로 만들었을 때)
    // const 응답 = await fetch("/answer"); //'응답'을 await 기다려서 /answer로 요청을 보내서 '응답'을 받고
    // console.log("응답", 응답);
    // const 정답 = await 응답.json(); //그 응답을 json 은 js한테 맞는 포맷(값)으로 바꿔주는것도 시간이 조금 걸리기 때문에 await 를 써서 기다려주고 바꿔준 그 값을 '정답'에 넣어준다(업데이트 한다)는 의미.
    // console.log("정답 객체", 정답_객체);
    // const 정답 = 정답_객체.answer;
    // console.log("정답", 정답);

    // for문 = 특정횟수 반복하면서 판단하기 위한 조건문. i는 0부터 인덱스 5까지, i를 하나씩 늘려가면서 판단.
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText; // 입력글자
      const 정답_글자 = 정답[i]; // 정답 한글자
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1; // 맞은 갯수를 하나 올려준다.
        block.style.background = "#6AAA64"; //입력한글자===정답과 자리를 맞췄을 때:"초록색"배경.
      } else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
      //입력한글자 중에 자리는 틀리고 정답 글자가 포함되어 있을때:"노란색"배경.
      else block.style.background = "#787C7E"; // 둘다(초록색도 노란색도 아닐때) 틀렸을 때, 회색으로 표시.
      block.style.color = "white"; // 그리고 그 회색 블럭에 화이트 컬러 글자로 입력.
      console.log("입력한 글자:", 입력한_글자, "정답글자:", 정답_글자);
    }

    //전부 정답인 경우
    if (맞은_갯수 === 5) gameover();
    else nextLine(); // const handleEnterKey의 for문이 끝나면 nextLine 함수를 호출.
  };

  // 백스페이스로 해당블럭의 innerText의 index가 0보다 클 때만 1개 빼서 ""빈칸으로 없애고 인덱스를 1개 줄여준다.
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  //키를 눌렀을때
  const handleKeydown = (event) => {
    // 2개의 변수 미리 지정: const key & const keyCode
    const key = event.key.toUpperCase(); //대문자로 변경
    const keyCode = event.keyCode; //keyCode는 유니크해서 겹칠수 없음 (A=65~Z=90)
    // 한 개의 블럭을 선택하는 방법:
    //(0번째 시도에 n번째 인덱스)쓰기 위해 backtick ``사용.
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    // 백스페이스 키:
    if (event.key === "Backspace") handleBackspace();
    // 엔터 키:
    // 그리고 백스페이스 눌렀을 때에도 다른것 실행되지 않길 바라니까 else if로 이어지게. 원하는 변수를 넣을 때 ``backtick 사용. ${attempts}${index} = N번째 시도의 N번째 인덱스인 블럭 가져오기.
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } // 인덱스가 5일때(맨끝까지 단어가 입력됐을 때) Enter키누르면 엔터키에 대한 동작 일어나고, 다른 키가 눌리면 그냥 아무것도 안하고 return(반환)해서 끝내라는 뜻.
    else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key; //keyCode는 유니크해서 겹칠수 없고 A=65~Z=90 에 만족하는 키만 입력.
      index += 1; //index += 1; & index == index + 1; == index++; 3가지 모두 (완전같은건 아니지만)여기선 같은 뜻.
    }
  };

  // 타이머:
  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer"); //html에서 id로 timer로 지정하여서, #timer로 입력.
      timeDiv.innerText = `Timer: ${분}:${초}`;
    }

    // 주기성
    timer = setInterval(setTime, 1000);
  };

  startTimer();
  // keyup= 키를 누르고 뗐을 때 이벤트발생. keydown = 누르지마자 이벤트발생.
  window.addEventListener("keydown", handleKeydown); // addEventListener ()안에 있는 함수는 const handleKeydown = () 괄호 안의 이벤트가 안목적으로 전달.
}

appStart(); // function 안에 들어있는 함수를 로직이 실행되어 appStart로 호출.
