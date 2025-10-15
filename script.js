// === 1단계: 기본 입력 ===
const q1 = document.getElementById("q1");
const q1Custom = document.getElementById("q1-custom");
const q2 = document.getElementById("q2");
const q2Custom = document.getElementById("q2-custom");
const q3 = document.getElementById("q3");

q1.addEventListener("change", () => {
  q1Custom.style.display = q1.value === "기타" ? "block" : "none";
});
q2.addEventListener("change", () => {
  q2Custom.style.display = q2.value === "여러 타겟" ? "block" : "none";
});

document.getElementById("toStep2").addEventListener("click", () => {
  if (!q1.value) return alert("Q1을 선택하세요.");
  if (q1.value === "기타" && !q1Custom.value.trim()) return alert("Q1 기타 내용을 입력하세요.");
  if (!q2.value) return alert("Q2를 선택하세요.");
  if (q2.value === "여러 타겟" && !q2Custom.value.trim()) return alert("Q2 타겟 상세를 입력하세요.");
  if (!q3.value.trim()) return alert("Q3 내용을 입력하세요.");

  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
  initFollowup();
});

// === 2단계: 맞춤 질문 FSM ===
const questionBox = document.getElementById("questionBox");
const answerInput = document.getElementById("answerInput");
const submitAnswer = document.getElementById("submitAnswer");
const qaList = document.getElementById("qaList");
const toStep3 = document.getElementById("toStep3");

let followupQueue = [];
let currentQuestion = "";
let qaPairs = [];

function initFollowup() {
  const topic = getTopic();
  followupQueue = buildFollowups(topic);
  showNextQuestion();
}

function getTopic() {
  return q1.value === "기타" ? q1Custom.value.trim() : q1.value;
}

function buildFollowups(topic) {
  const Q = [];
  const push = (s) => Q.push(s);

  const commonNudge = "자세히 적어주실수록 더 좋은 결과가 나옵니다.";

  switch (topic) {
    case "학생의 성장 스토리":
      push("몇 학년 학생인가요? " + commonNudge);
      push("윤선생으로 얼마나 학습했나요? (기간/과정)");
      push("어떤 변화가 있었나요? (실력/태도/자신감 등)");
      push("이 학생만의 특별한 점은 무엇인가요?");
      push("성장에 선생님이 기여한 점은 무엇인가요?");
      push("윤선생 학습이 어떻게 도움이 되었나요?");
      break;
    case "학습 팁/노하우 공유":
      push("어떤 영역의 팁인가요? (단어/문법/듣기/말하기/습관 등)");
      push("누구에게 유용한가요? (학년/수준)");
      push("핵심 팁을 한 줄로 요약한다면?");
      break;
    case "학부모 고민 해결":
      push("어떤 고민을 다루나요?");
      push("선생님의 해결책이나 조언은 무엇인가요?");
      push("실제 사례나 적용 방법이 있다면?");
      break;
    case "교육 철학/방법론":
      push("강조하고 싶은 윤선생만의 장점은 무엇인가요? (1:1, 방문학습, 커리큘럼 등)");
      push("선생님의 교육철학 한 줄 정의는?");
      break;
    case "선생님 소개":
      push("윤선생을 선택하신 이유는?");
      push("가장 보람 있었던 기억은?");
      push("선생님의 강점/전문성은?");
      push("어떤 학생/학부모와 특히 잘 맞나요?");
      break;
    case "수업 방식":
      push("매일학습 루틴인가요? 또는 특정 영역의 학습인가요?");
      push("매일학습 루틴은 어떻게 진행되나요?");
      push("{특정영역} 학습을 어떻게 진행하나요?");
      push("윤선생 학습의 특징/결과는?");
      break;
    case "윤선생 커리큘럼":
      push("어떤 코스/레벨/단원에 대해 소개하나요?");
      push("핵심 특징은 무엇인가요? (체계/맞춤/관리 등)");
      push("학생 변화 사례가 있다면?");
      break;
    case "학습 후기":
      push("어떤 회원의 후기인가요? (학년/학습과정)");
      push("회원/학부모 중 누구의 후기인가요?");
      push("감동받은 포인트가 있었나요?");
      push("부각시키고 싶은 포인트는 무엇인가요?");
      break;
    default:
      // 기타/일상/이벤트 등 공통
      push("핵심 메시지는 무엇인가요?");
      push("독자가 얻을 수 있는 이점은 무엇인가요?");
      push("전달하고 싶은 감정/분위기가 있나요?");
      break;
  }

  return Q;
}

function showNextQuestion() {
  if (followupQueue.length === 0) {
    questionBox.innerHTML = `<div class="done">맞춤 질문이 완료되었습니다.</div>`;
    toStep3.disabled = false;
    return;
  }
  currentQuestion = followupQueue.shift();
  questionBox.innerHTML = `<div class="question">${currentQuestion}</div>`;
  answerInput.value = "";
  answerInput.focus();
}

submitAnswer.addEventListener("click", () => {
  const ans = answerInput.value.trim();
  if (!ans) return;

  qaPairs.push({ question: currentQuestion, answer: ans });
  renderQA();
  showNextQuestion();
});

function renderQA() {
  qaList.innerHTML = qaPairs.map(({ question, answer }, idx) => `
    <div class="qa-item">
      <div class="q">${idx + 1}. ${question}</div>
      <div class="a">→ ${answer}</div>
    </div>
  `).join("");
}

toStep3.addEventListener("click", () => {
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "block";
});

// === 3단계 & 생성 ===
const generateBtn = document.getElementById("generate");
const output = document.getElementById("output");
const resultSec = document.getElementById("result");
const loading = document.getElementById("loading");

// 스타일 체크박스
function getStyleOptions() {
  return {
    shorter: document.getElementById("shorter").checked,
    longer: document.getElementById("longer").checked,
    emojiMore: document.getElementById("emojiMore").checked,
    emojiLess: document.getElementById("emojiLess").checked,
    friendlier: document.getElementById("friendlier").checked,
    moreProfessional: document.getElementById("moreProfessional").checked,
    forStudents: document.getElementById("forStudents").checked,
  };
}

function getAudience() {
  return q2.value === "여러 타겟" ? q2Custom.value.trim() : q2.value;
}

function getApiBase() {
  // 배포 후 자신의 Worker URL로 바꾸세요.
  // 예: https://yoon-caption-worker.your-subdomain.workers.dev
  return localStorage.getItem("apiBase") || "https://yoon-caption-worker.hyunqwer.workers.dev";
}

generateBtn.addEventListener("click", async () => {
  const payload = {
    q1_topic: getTopic(),
    q2_audience: getAudience(),
    q3_media_desc: q3.value.trim(),
    extraAnswers: qaPairs,
    styleOptions: getStyleOptions(),
    regionTags: parseTags(document.getElementById("regionTags").value),
  };

  resultSec.style.display = "block";
  loading.style.display = "block";
  output.textContent = "";

  try {
    const res = await fetch(getApiBase() + "/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || data?.error || "API Error");
    output.textContent = data.result;
  } catch (e) {
    output.textContent = "오류가 발생했습니다: " + e.message;
  } finally {
    loading.style.display = "none";
  }
});

// 유틸
function parseTags(v) {
  return v.split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

// 복사/다운로드
document.getElementById("copyBtn").addEventListener("click", async () => {
  const text = output.textContent;
  if (!text) return;
  await navigator.clipboard.writeText(text);
  alert("복사되었습니다.");
});

document.getElementById("downloadTxt").addEventListener("click", () => {
  download("caption.txt", output.textContent);
});

document.getElementById("downloadMd").addEventListener("click", () => {
  download("caption.md", output.textContent);
});

function download(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

