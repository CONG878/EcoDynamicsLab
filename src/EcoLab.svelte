<script>
  import { link } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const features = [
    {
      title: "인터랙티브 모델링",
      description:
        "피식자와 포식자의 초기 조건 및 상호작용 계수를 자유롭게 설정",
    },
    {
      title: "실시간 시뮬레이션",
      description: "미분 방정식을 통한 개체수 변화의 즉각적인 계산 및 표시",
    },
    {
      title: "데이터 시각화",
      description: "직관적인 그래프로 결과를 확인",
    },
    {
      title: "실험 저장 및 공유",
      description: "진행한 실험을 저장하고 다른 사용자들과 공유 가능",
    },
  ];

  const benefits = [
    {
      title: "교육자 및 학생",
      description: "생태계 역학을 실험적으로 학습할 수 있는 도구 제공",
    },
    {
      title: "연구자",
      description: "다양한 시나리오를 테스트하고 데이터 분석에 활용 가능",
    },
  ];
</script>

<main class="main-container">
  {#if mounted}
    <!-- 헤더 섹션 -->
    <section class="hero" transition:fade={{ duration: 300 }}>
      <h1 class="hero-title">생태계 실험실: Eco-dynamics lab</h1>
      <p class="hero-subtitle">
        포식자-피식자 상호작용을 직접 시뮬레이션하고 관찰해보세요.
      </p>
      <div class="hero-links">
        <a href="/EcoSimulator" class="btn btn-primary" use:link
          >시뮬레이터 시작하기</a
        >
        <a href="/LabBoard" class="btn btn-secondary" use:link>정원 보러가기</a>
      </div>
    </section>

    <!-- 프로젝트 소개 섹션 -->
    <section
      class="introduction"
      transition:fade={{ duration: 300, delay: 150 }}
    >
      <div class="container">
        <h2 class="section-title">프로젝트 소개</h2>
        <p class="section-text">
          생태계에서의 복잡한 상호작용을 이해하고 시각화하기 위한 웹 기반
          플랫폼입니다. 사용자들이 직접 매개변수를 조정하여 생물 종의 개체수
          변화를 관찰할 수 있습니다.
        </p>
        <p class="section-text">
          더 자세한 내용을 보려면 <a
            href="https://docs.google.com/presentation/d/15Id6BQe-RjARUtpK_n-l210SrvCA5RH2XrrL35_48Vc/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >
            프로젝트 프레젠테이션
          </a>과
          <a
            href="https://github.com/CONG878/EcoDynamicsLab"
            target="_blank"
            rel="noopener noreferrer"
            class="link">GitHub 소스 코드</a
          >를 확인하세요.
        </p>
      </div>
    </section>

    <!-- 주요 기능 섹션 -->
    <section class="features" transition:fade={{ duration: 300, delay: 300 }}>
      <div class="container">
        <h2 class="section-title">주요 기능</h2>
        <div class="feature-list">
          {#each features as feature}
            <div class="feature-item">
              <h3 class="feature-title">{feature.title}</h3>
              <p class="feature-description">{feature.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- 사용 권장 섹션 -->
    <section
      class="call-to-action"
      transition:fade={{ duration: 300, delay: 450 }}
    >
      <h2 class="cta-title">지금 바로 시작해보세요!</h2>
      <p class="cta-text">
        시뮬레이터를 직접 사용해보고 생태계의 변화를 체험해보세요.
      </p>
      <a href="/EcoSimulator" class="btn btn-primary" use:link>
        시뮬레이터 시작하기
      </a>
    </section>

    <!-- 사용자 혜택 섹션 -->
    <section class="benefits" transition:fade={{ duration: 300, delay: 600 }}>
      <div class="container">
        <h2 class="section-title">누구를 위한 것인가요?</h2>
        <div class="benefit-list">
          {#each benefits as benefit}
            <div class="benefit-item">
              <h3 class="benefit-title">{benefit.title}</h3>
              <p class="benefit-description">{benefit.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- 문의 및 참여 섹션 -->
    <section class="contact" transition:fade={{ duration: 300, delay: 750 }}>
      <div class="container">
        <h2 class="section-title">문의 및 참여</h2>
        <div class="contact-content">
          <p class="contact-text">
            프로젝트에 대한 문의나 피드백은 아래 이메일로 보내주세요.
          </p>
          <p class="contact-email">
            <strong>이메일:</strong>
            <a href="mailto:example@example.com" class="link">
              example@example.com
            </a>
          </p>
          <p class="contact-text">
            프로젝트에 기여하고 싶다면 <a
              href="https://github.com/CONG878/EcoDynamicsLab"
              target="_blank"
              rel="noopener noreferrer"
              class="link"
            >
              GitHub 레포지토리
            </a>를 방문해주세요.
          </p>
        </div>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="footer" transition:fade={{ duration: 300, delay: 900 }}>
      <div class="container">
        <p class="footer-text">© 2024 EcoDynamicsLab</p>
        <nav class="footer-nav">
          <a href="/EcoSimulator" class="footer-link" use:link>시뮬레이터</a> |
          <a href="/LabBoard" class="footer-link" use:link>실험 목록</a> |
          <a
            href="https://github.com/CONG878/EcoDynamicsLab"
            class="footer-link"
            target="_blank"
            rel="noopener noreferrer">GitHub</a
          >
        </nav>
      </div>
    </footer>
  {/if}
</main>

<style>
  /* Svelte는 스타일을 자동으로 컴포넌트에 스코프를 지정하므로, 글로벌 스타일이 필요한 경우 :global() 선택자를 사용하세요 */

  :global(:root) {
    --color-primary: #22c55e;
    --color-primary-dark: #16a34a;
    --color-secondary: #f0fdf4;
    --color-text: #333333;
    --color-text-light: #666666;
    --color-background: #ffffff;
    --color-background-alt: #f3f4f6;
    --color-border: #e5e7eb;
  }

  /* 기본 스타일 */
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    line-height: 1.5;
    color: var(--color-text);
    background-color: var(--color-background);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* 타이포그래피 */
  h1,
  h2,
  h3 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* 버튼 스타일 */
  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.2s ease-in-out;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
  }

  .btn-primary:hover {
    background-color: var(--color-primary-dark);
  }

  .btn-secondary {
    background-color: white;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }

  .btn-secondary:hover {
    background-color: var(--color-secondary);
  }

  /* 헤더 섹션 */
  .hero {
    background: linear-gradient(to bottom, #f0fdf4, #e0f2fe);
    padding: 4rem 1rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
    color: #15803d;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: #166534;
    margin-bottom: 2rem;
  }

  .hero-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  /* 섹션 스타일 */
  section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  /* 소개 섹션 */
  .introduction {
    background-color: white;
  }

  /* 기능 섹션 */
  .features {
    background-color: var(--color-secondary);
  }

  .feature-list {
    display: grid;
    gap: 2rem;
  }

  .feature-item {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }

  .feature-item:hover {
    transform: translateY(-4px);
  }

  .feature-title {
    color: var(--color-primary);
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  /* CTA 섹션 */
  .call-to-action {
    background-color: var(--color-primary);
    color: white;
    text-align: center;
    padding: 4rem 1rem;
  }

  .cta-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .cta-text {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  /* 혜택 섹션 */
  .benefits {
    background-color: white;
  }

  .benefit-list {
    display: grid;
    gap: 2rem;
  }

  .benefit-item {
    background-color: var(--color-secondary);
    padding: 1.5rem;
    border-radius: 0.5rem;
  }

  .benefit-title {
    color: var(--color-primary);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  /* 문의 섹션 */
  .contact {
    background-color: var(--color-background-alt);
  }

  .contact-content {
    text-align: center;
  }

  /* 푸터 */
  .footer {
    background-color: #1f2937;
    color: white;
    padding: 2rem 0;
    text-align: center;
  }

  .footer-text {
    margin-bottom: 1rem;
  }

  .footer-nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .footer-link {
    color: #9ca3af;
  }

  .footer-link:hover {
    color: white;
  }

  /* 반응형 디자인 */
  @media (min-width: 640px) {
    .hero-title {
      font-size: 3rem;
    }

    .hero-subtitle {
      font-size: 1.5rem;
    }

    .hero-links {
      flex-direction: row;
      justify-content: center;
    }

    .feature-list,
    .benefit-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) {
    .hero {
      padding: 6rem 1rem;
    }

    .feature-list {
      grid-template-columns: repeat(4, 1fr);
    }

    .hero-links {
      gap: 1.5rem;
    }
  }
  
  /* 애니메이션 효과 추가 */
  .feature-item,
  .benefit-item {
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .feature-item:hover,
  .benefit-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .btn {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* 접근성 개선 */
  .btn:focus,
  a:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* 다크 모드 개선 */
  @media (prefers-color-scheme: dark) {
    :global(body) {
      background-color: #121212;
    }

    .hero {
      background: linear-gradient(to bottom, #1a2e1a, #1a2a3a);
    }

    .introduction,
    .benefits {
      background-color: #1e1e1e;
    }

    .features {
      background-color: #2a2a2a;
    }

    .feature-item,
    .benefit-item {
      background-color: #2e2e2e;
    }

    .contact {
      background-color: #262626;
    }

    .btn-secondary {
      border-color: var(--color-primary);
    }
  }
</style>
