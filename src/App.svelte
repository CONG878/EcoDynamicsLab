<script>
  import Router, { link } from "svelte-spa-router";
  import EcoSimulator from "./EcoSimulator.svelte";
  import LabBoard from "./LabBoard.svelte";

  const routes = {
    "/EcoSimulator": EcoSimulator,
    "/EcoSimulator/:id": EcoSimulator,
    "/LabBoard": LabBoard,
  };
</script>

<Router {routes} />

<main>
  <!-- 헤더 섹션 -->
  <section class="hero">
    <h1>생태계 시뮬레이션: 자연을 탐구하는 웹 실험실</h1>
    <p>포식자-피식자 상호작용을 직접 시뮬레이션하고 관찰해보세요.</p>
    <div class="links">
      <a href="/EcoSimulator" class="link primary" use:link
        >시뮬레이터 시작하기</a
      >
      <a href="/LabBoard" class="link" use:link>실험 목록 보기</a>
      <a href="https://github.com/CONG878/EcoDynamicsLab" class="link"
        >GitHub 소스 코드</a
      >
    </div>
  </section>

  <!-- 프로젝트 소개 섹션 -->
  <section class="introduction">
    <h2>프로젝트 소개</h2>
    <p>
      생태계에서의 복잡한 상호작용을 이해하고 시각화하기 위한 웹 기반
      플랫폼입니다. 사용자들이 직접 매개변수를 조정하여 생물 종의 개체수 변화를
      관찰할 수 있습니다.
    </p>
    <p>
      더 자세한 내용을 보려면 <a
        href="https://docs.google.com/presentation/d/15Id6BQe-RjARUtpK_n-l210SrvCA5RH2XrrL35_48Vc/edit?usp=sharing"
        target="_blank">프로젝트 프레젠테이션</a
      >을 확인하세요.
    </p>
  </section>

  <!-- 주요 기능 섹션 -->
  <section class="features">
    <h2>주요 기능</h2>
    <div class="feature-list">
      <div class="feature-item">
        <h3>인터랙티브 모델링</h3>
        <p>피식자와 포식자의 초기 조건 및 상호작용 계수를 자유롭게 설정</p>
      </div>
      <div class="feature-item">
        <h3>실시간 시뮬레이션</h3>
        <p>미분 방정식을 통한 개체수 변화의 즉각적인 계산 및 표시</p>
      </div>
      <div class="feature-item">
        <h3>데이터 시각화</h3>
        <p>직관적인 그래프로 결과를 확인</p>
      </div>
      <div class="feature-item">
        <h3>실험 저장 및 공유</h3>
        <p>진행한 실험을 저장하고 다른 사용자들과 공유 가능</p>
      </div>
    </div>
  </section>

  <!-- 사용 권장 섹션 -->
  <section class="call-to-action">
    <h2>지금 바로 시작해보세요!</h2>
    <p>시뮬레이터를 직접 사용해보고 생태계의 변화를 체험해보세요.</p>
    <a href="/EcoSimulator" class="link primary" use:link>시뮬레이터 시작하기</a
    >
  </section>

  <!-- 사용자 혜택 섹션 -->
  <section class="benefits">
    <h2>누구를 위한 것인가요?</h2>
    <div class="benefit-list">
      <div class="benefit-item">
        <h3>교육자 및 학생</h3>
        <p>생태계 역학을 실험적으로 학습할 수 있는 도구 제공</p>
      </div>
      <div class="benefit-item">
        <h3>연구자</h3>
        <p>다양한 시나리오를 테스트하고 데이터 분석에 활용 가능</p>
      </div>
    </div>
  </section>

  <!-- 문의 및 참여 섹션 -->
  <section class="contact">
    <h2>문의 및 참여</h2>
    <p>프로젝트에 대한 문의나 피드백은 아래 이메일로 보내주세요.</p>
    <p>
      <strong>이메일:</strong>
      <a href="mailto:example@example.com">example@example.com</a>
    </p>
    <p>
      프로젝트에 기여하고 싶다면 <a
        href="https://github.com/CONG878/EcoDynamicsLab"
        target="_blank">GitHub 레포지토리</a
      >를 방문해주세요.
    </p>
  </section>

  <!-- 푸터 -->
  <footer>
    <p>© 2024 EcoDynamicsLab</p>
    <nav>
      <a href="/EcoSimulator" use:link>시뮬레이터</a> |
      <a href="/LabBoard" use:link>실험 목록</a> |
      <a href="https://github.com/CONG878/EcoDynamicsLab">GitHub</a>
    </nav>
  </footer>
</main>

<style>
  /* 제안된 디자인에 따른 스타일을 작성합니다. */
</style>
