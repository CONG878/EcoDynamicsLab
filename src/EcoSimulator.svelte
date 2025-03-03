<script>
  /* 스벨트와 외부 라이브러리 및 모듈 */
  import { onMount } from "svelte";
  import { doc, getDoc, runTransaction, setDoc } from "firebase/firestore";
  import Chart from "chart.js/auto";
  import { db } from "./firebase.js";
  import { link, push } from "svelte-spa-router";

  /* 초기 변수 및 상태 */
  export let params = {};
  const id = params.id ?? null; // URL에서 전달받은 실험 ID

  let state = {
    names: { prey: "토끼", LP: "여우", AP: "늑대" },
    stepSize: 0.23,
    duration: 24.0,
    preyTraits: { reproductionRate: 3.0, carryingCapacity: 1300.0 },
    predatorTraits: {
      reproductionRate: [0.04, 0.025],
      predationRate: [0.03, 0.025],
      efficiency: [0.4, 0.12],
      alternativeFood: [450.0, 750.0],
    },
    aggressionRateMatrix: {
      "0": [0, 0],
      "1": [0.003, 0.0025],
    },
  };

  let populations = {
    prey: 1000.0,
    LP: 25.0,
    AP: 10.0,
  };

  let experimentMetadata = {
    title: "",
    description: "",
  };

  let experimentTitle = "생태계를 창조해 주세요.";
  let ecosystemChart;
  let initialState;
  let initialPopulations;
  let initialExperimentMetadata;
  let dataLoaded = false;

  // 변수 설명을 위한 툴팁 정보
  const tooltips = {
    reproductionRate:
      "개체가 번식하는 비율입니다. 높을수록 개체밀도가 빠르게 증가합니다.",
    carryingCapacity: "환경이 지원할 수 있는 최대 개체밀도입니다.",
    predationRate:
      "포식자가 피식자를 사냥하는 효율성입니다. 높을수록 더 많은 피식자를 사냥합니다.",
    efficiency: "포식자가 피식자로부터 얻는 에너지 효율입니다.",
    alternativeFood:
      "피식자 외에 포식자가 이용할 수 있는 식량 자원의 양입니다. 예) 다른 동물, 열매, 인간 주변의 음식물 등",
    aggressionRate:
      "포식자 간의 경쟁을 나타냅니다. 늑대 → 여우는 늑대가 여우를 공격하는 수준을 뜻합니다.",
  };

  // 툴팁 표시 상태
  let showTooltips = false;

  /* 데이터 로드 및 초기화 */
  async function loadExperimentData(documentId) {
    if (documentId) {
      const docRef = doc(db, "ecoSimulations", documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        state = data.state;
        populations = data.populations;
        experimentMetadata = data.experimentMetadata;
        experimentTitle = experimentMetadata.title;
      }
    }

    initialState = JSON.parse(JSON.stringify(state));
    initialPopulations = JSON.parse(JSON.stringify(populations));
    initialExperimentMetadata = JSON.parse(JSON.stringify(experimentMetadata));

    dataLoaded = true;
  }
  loadExperimentData(id);

  /* 차트 관련 함수 */
  function initializeChart() {
    const ctx = document.getElementById("ecosystemChart").getContext("2d");
    ecosystemChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: state.names.prey,
            data: [],
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "y",
          },
          {
            label: state.names.LP,
            data: [],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "y1",
          },
          {
            label: state.names.AP,
            data: [],
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "linear",
            title: { display: true, text: "관찰 기간(개월)" },
            ticks: { stepSize: 3 },
          },
          y: {
            title: { display: true, text: "피식자 개체밀도" },
            beginAtZero: true,
            position: "left",
          },
          y1: {
            title: { display: true, text: "포식자 개체밀도" },
            beginAtZero: true,
            position: "right",
            grid: { display: false },
          },
        },
      },
    });
  }

  $: if (ecosystemChart && ecosystemChart.data) {
    ecosystemChart.data.datasets[0].label = state.names.prey;
    ecosystemChart.data.datasets[1].label = state.names.LP;
    ecosystemChart.data.datasets[2].label = state.names.AP;
    ecosystemChart.update();
  }

  onMount(() => {
    initializeChart();
  });

  /* 기능적 유틸리티 */
  function resetForm() {
    state = JSON.parse(JSON.stringify(initialState));
    populations = JSON.parse(JSON.stringify(initialPopulations));
    experimentMetadata = JSON.parse(JSON.stringify(initialExperimentMetadata));
    ecosystemChart.update();
  }

  function logGaussianRandom(mean = 0, stdDev = Math.log(1.25)) {
    let u1 = Math.random();
    while (u1 === 0) u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean * Math.exp(stdDev * z0);
  }

  function randomize() {
    populations.prey = logGaussianRandom(populations.prey, Math.log(1.25));
    populations.LP = logGaussianRandom(populations.LP, Math.log(1.25));
    populations.AP = logGaussianRandom(populations.AP, Math.log(1.25));

    state.preyTraits.reproductionRate = logGaussianRandom(
      state.preyTraits.reproductionRate,
      Math.log(1.25)
    );
    state.preyTraits.carryingCapacity = logGaussianRandom(
      state.preyTraits.carryingCapacity,
      Math.log(1.25)
    );

    state.predatorTraits.reproductionRate =
      state.predatorTraits.reproductionRate.map((rate) =>
        logGaussianRandom(rate, Math.log(1.25))
      );
    state.predatorTraits.predationRate = state.predatorTraits.predationRate.map(
      (rate) => logGaussianRandom(rate, Math.log(1.25))
    );
    state.predatorTraits.efficiency = state.predatorTraits.efficiency.map(
      (eff) => logGaussianRandom(eff, Math.log(1.25))
    );
    state.predatorTraits.alternativeFood =
      state.predatorTraits.alternativeFood.map((food) =>
        logGaussianRandom(food, Math.log(1.25))
      );

    Object.keys(state.aggressionRateMatrix).forEach((key) => {
      state.aggressionRateMatrix[key] = state.aggressionRateMatrix[key].map(
        (rate) => logGaussianRandom(rate, Math.log(1.25))
      );
    });
  }

  let yGridVisible = true;
  let y1GridVisible = false;

  function toggleGrid() {
    ecosystemChart.options.scales.y.grid.display = yGridVisible;
    ecosystemChart.options.scales.y1.grid.display = y1GridVisible;
    ecosystemChart.update();
  }

  let xTicks = 3.0;
  function ticksSize() {
    ecosystemChart.options.scales.x.ticks.stepSize = xTicks;
    ecosystemChart.update();
  }

  /* 시뮬레이션 및 데이터 저장 */
  async function updateChart(simulationResults) {
    ecosystemChart.data.labels = simulationResults.map((result) =>
      result.time.toFixed(2)
    );
    ecosystemChart.data.datasets[0].data = simulationResults.map(
      (result) => result.populations[0]
    );
    ecosystemChart.data.datasets[1].data = simulationResults.map(
      (result) => result.populations[1]
    );
    ecosystemChart.data.datasets[2].data = simulationResults.map(
      (result) => result.populations[2]
    );
    ecosystemChart.update();
  }

  async function simulate() {
    const response = await fetch(
      "https://simulateecosystem-6ctqr234bq-du.a.run.app/simulateEcosystem",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          populations: [populations.prey, populations.LP, populations.AP],
        }),
      }
    );

    if (response.ok) {
      const results = await response.json();
      console.log(populations);
      updateChart(results);
    } else {
      console.error("Simulation failed:", await response.text());
    }
  }

  async function getNextID() {
    const counterRef = doc(db, "counters", "ecoSimCounter");

    const newSimulationID = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      if (!counterDoc.exists()) {
        transaction.set(counterRef, { count: 1 });
        return 1;
      }
      const currentCount = counterDoc.data().count;
      const nextCount = currentCount + 1;
      transaction.update(counterRef, { count: nextCount });
      return nextCount;
    });

    return `ecoSim${newSimulationID}`;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    try {
      const newID = await getNextID();
      const docRef = doc(db, "ecoSimulations", newID);

      await setDoc(docRef, {
        state,
        populations,
        experimentMetadata,
        timestamp: new Date(),
      });

      alert("Experiment saved successfully!");
      push("/EcoGarden");
    } catch (error) {
      console.error("Error saving experiment:", error);
      alert("Error saving experiment. Please try again.");
    }
  }

  // 툴팁 토글 함수
  function toggleTooltips() {
    showTooltips = !showTooltips;
  }

  // 고급 설정 열림/닫힘 상태를 추적하는 변수 추가
  let isAdvancedSettingsOpen = false;
</script>

<svelte:head>
  <title>Eco Simulator</title>
</svelte:head>

<header>
  <a href="/" use:link class="home">대문으로</a>
  <h1>생태계 시뮬레이터</h1>
</header>
<h2>{experimentTitle}</h2>

<!-- 초보자 가이드 -->
<div class="guide-container">
  <p class="guide">
    본 페이지를 처음 들어온 사용자는 초기값이 설정된 상태로 Simulate를
    작동해보세요.
  </p>
  <button class="btn-secondary info-button" on:click={toggleTooltips}>
    {showTooltips ? "용어 설명 숨기기" : "용어 설명 보기"}
  </button>
</div>

<main class="simulator-container">
  {#if dataLoaded}
    <form
      on:reset|preventDefault={resetForm}
      on:submit={handleFormSubmit}
      novalidate
    >
      <section class="basic-info">
        <fieldset>
          <legend>생물 종 이름</legend>
          <label for="prey-name">피식자</label>
          <input id="prey-name" type="text" bind:value={state.names.prey} />
          <label for="lower-predator-name">하위 포식자</label>
          <input
            id="lower-predator-name"
            type="text"
            bind:value={state.names.LP}
          />
          <label for="apex-predator-name">상위 포식자</label>
          <input
            id="apex-predator-name"
            type="text"
            bind:value={state.names.AP}
          />
        </fieldset>

        <fieldset>
          <legend>초기 개체밀도</legend>
          <label for="x">{state.names.prey}</label>
          <input
            id="x"
            type="number"
            step="any"
            bind:value={populations.prey}
          />
          <label for="y1">{state.names.LP}</label>
          <input id="y1" type="number" step="any" bind:value={populations.LP} />
          <label for="y2">{state.names.AP}</label>
          <input id="y2" type="number" step="any" bind:value={populations.AP} />
        </fieldset>

        <fieldset>
          <legend>관측 설정</legend>
          <label for="h">관측 간격</label>
          <input id="h" type="number" step="any" bind:value={state.stepSize} />
          <label for="T">관측 기간</label>
          <input id="T" type="number" step="any" bind:value={state.duration} />
        </fieldset>

        <fieldset>
          <legend>실험 설정</legend>
          <div class="buttons">
            <button type="reset" class="btn-secondary">초기화</button>
            <button type="button" on:click={randomize} class="btn-secondary"
              >Randomize</button
            >
            <button type="button" on:click={simulate} class="btn-primary"
              >Simulate</button
            >
          </div>
          <br />
          <label for="title">실험 제목</label>
          <input id="title" bind:value={experimentMetadata.title} type="text" />
          <label for="description">실험 설명</label>
          <textarea id="description" bind:value={experimentMetadata.description}
          ></textarea>
          <div class="form-actions">
            <button type="submit" class="btn-primary">등록</button>
            <a href="/EcoGarden" use:link>다른 환경 보러 가기</a>
          </div>
        </fieldset>
      </section>

      <section class="traits">
        <fieldset>
          <legend>피식자 특성</legend>
          <div class="trait-row">
            <label for="r0">번식률</label>
            {#if showTooltips}
              <div class="tooltip">{tooltips.reproductionRate}</div>
            {/if}
            <input
              id="r0"
              bind:value={state.preyTraits.reproductionRate}
              type="number"
              step="any"
            />
          </div>
          <div class="trait-row">
            <label for="K0">포화 개체수</label>
            {#if showTooltips}
              <div class="tooltip">{tooltips.carryingCapacity}</div>
            {/if}
            <input
              id="K0"
              bind:value={state.preyTraits.carryingCapacity}
              type="number"
              step="any"
            />
          </div>
        </fieldset>

        <details class="advanced-settings" bind:open={isAdvancedSettingsOpen}>
          <summary class="summary-button">고급 설정</summary>

          <fieldset class="predator">
            <legend>포식자 특성</legend>
            <fieldset class="r">
              <legend>번식률</legend>
              {#if showTooltips}
                <div class="tooltip">{tooltips.reproductionRate}</div>
              {/if}
              <div class="input-group">
                <label for="r1">{state.names.LP}</label>
                <input
                  id="r1"
                  bind:value={state.predatorTraits.reproductionRate[0]}
                  type="number"
                  step="any"
                />
              </div>
              <div class="input-group">
                <label for="r2">{state.names.AP}</label>
                <input
                  id="r2"
                  bind:value={state.predatorTraits.reproductionRate[1]}
                  type="number"
                  step="any"
                />
              </div>
            </fieldset>
            <fieldset class="a">
              <legend>포식 강도</legend>
              {#if showTooltips}
                <div class="tooltip">{tooltips.predationRate}</div>
              {/if}
              <div class="input-group">
                <label for="a1">{state.names.LP}</label>
                <input
                  id="a1"
                  bind:value={state.predatorTraits.predationRate[0]}
                  type="number"
                  step="any"
                />
              </div>
              <div class="input-group">
                <label for="a2">{state.names.AP}</label>
                <input
                  id="a2"
                  bind:value={state.predatorTraits.predationRate[1]}
                  type="number"
                  step="any"
                />
              </div>
            </fieldset>
            <fieldset class="b">
              <legend>포식 효율</legend>
              {#if showTooltips}
                <div class="tooltip">{tooltips.efficiency}</div>
              {/if}
              <div class="input-group">
                <label for="b1">{state.names.LP}</label>
                <input
                  id="b1"
                  bind:value={state.predatorTraits.efficiency[0]}
                  type="number"
                  step="any"
                />
              </div>
              <div class="input-group">
                <label for="b2">{state.names.AP}</label>
                <input
                  id="b2"
                  bind:value={state.predatorTraits.efficiency[1]}
                  type="number"
                  step="any"
                />
              </div>
            </fieldset>
            <fieldset class="c">
              <legend>대체 식량 자원</legend>
              {#if showTooltips}
                <div class="tooltip">{tooltips.alternativeFood}</div>
              {/if}
              <div class="input-group">
                <label for="c1">{state.names.LP}</label>
                <input
                  id="c1"
                  bind:value={state.predatorTraits.alternativeFood[0]}
                  type="number"
                  step="any"
                />
              </div>
              <div class="input-group">
                <label for="c2">{state.names.AP}</label>
                <input
                  id="c2"
                  bind:value={state.predatorTraits.alternativeFood[1]}
                  type="number"
                  step="any"
                />
              </div>
            </fieldset>
            <fieldset class="A">
              <legend>포식자 간 공격성</legend>
              {#if showTooltips}
                <div class="tooltip">{tooltips.aggressionRate}</div>
              {/if}
              <div class="input-group">
                <label for="a11">{state.names.LP} → {state.names.LP}</label>
                <input
                  id="a11"
                  bind:value={state.aggressionRateMatrix["0"][0]}
                  type="number"
                  step="any"
                />
              </div>
              <div class="input-group">
                <label for="a12">{state.names.LP} → {state.names.AP}</label>
                <input
                  id="a12"
                  bind:value={state.aggressionRateMatrix["0"][1]}
                  type="number"
                  step="any"
                />
              </div>
              <div class="input-group">
                <label for="a21">{state.names.AP} → {state.names.LP}</label>
                <input
                  id="a21"
                  bind:value={state.aggressionRateMatrix["1"][0]}
                  type="number"
                  step="any"
                />
              </div>
              <div class="input-group">
                <label for="a22">{state.names.AP} → {state.names.AP}</label>
                <input
                  id="a22"
                  bind:value={state.aggressionRateMatrix["1"][1]}
                  type="number"
                  step="any"
                />
              </div>
            </fieldset>
          </fieldset>

          <button
            type="button"
            class="summary-button hide-button"
            on:click={() => (isAdvancedSettingsOpen = false)}
          >
            고급 설정
          </button>
        </details>
      </section>
    </form>
  {:else}
    <p class="loading">데이터를 로드하는 중...</p>
  {/if}

  <output>
    <canvas id="ecosystemChart"></canvas>
    <section class="chart-controlls">
      <div class="grid-mode">
        <label for="prey-axis">피식자 눈금</label>
        <input
          type="checkbox"
          id="prey-axis"
          bind:checked={yGridVisible}
          on:change={toggleGrid}
        />
        <label for="predator-axis">포식자 눈금</label>
        <input
          type="checkbox"
          id="predator-axis"
          bind:checked={y1GridVisible}
          on:change={toggleGrid}
        />
      </div>
      <div class="grid-mode">
        <label for="ticks">단위 기간(개월)</label>
        <input
          type="number"
          id="ticks"
          bind:value={xTicks}
          on:change={ticksSize}
        />
      </div>
    </section>
  </output>
</main>

<style>
  /* 공통 헤더 스타일 */
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 0.5rem;
  }
  .home {
    position: absolute;
    left: 1.5rem;
    font-size: 1.25rem;
  }
  .home:hover {
    text-decoration: underline;
  }
  h1 {
    font-size: 2.5rem;
    color: var(--color-primary-dark);
  }
  h2 {
    font-size: 1.5rem;
    color: var(--color-text-light);
    text-align: center;
  }

  /* 초보자 가이드 스타일 */
  .guide-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-secondary);
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    margin: 1rem auto;
    max-width: 1200px;
  }
  .guide {
    margin: 0;
    color: var(--color-primary-dark);
    font-weight: 500;
  }
  .info-button {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }

  /* 컨테이너 레이아웃 */
  .simulator-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  form {
    display: flex;
    gap: 2rem;
    flex-direction: column;
  }

  /* 필드셋 및 폼 요소 스타일 */
  fieldset {
    background-color: var(--color-background-alt);
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  fieldset fieldset {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    position: relative;
  }
  fieldset fieldset.A {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.4rem;
  }
  legend {
    font-size: 1.25rem;
    color: var(--color-primary);
    margin-bottom: 1rem;
  }
  label {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  input,
  textarea {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 1rem;
  }
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: none;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  /* 버튼 스타일 */
  button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
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
    background-color: var(--color-background);
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }
  .btn-secondary:hover {
    background-color: var(--color-secondary);
  }

  /* 고급 설정 details/summary 스타일 */
  .advanced-settings {
    width: 100%;
    margin: 1rem 0;
  }

  .summary-button {
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: var(--color-secondary);
    color: var(--color-primary-dark);
    border: 1px solid var(--color-primary);
    border-radius: 0.25rem;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    list-style: none;
  }

  .summary-button:hover {
    background-color: var(--color-background);
  }

  .summary-button::-webkit-details-marker {
    display: none;
  }

  /* details가 열렸을 때 summary 스타일 변경 */
  details[open] .summary-button::after {
    content: " 숨기기 ▲";
  }

  details:not([open]) .summary-button::after {
    content: " 보기 ▼";
  }

  /* 링크 스타일 */
  a {
    color: var(--color-primary);
  }
  a:hover {
    text-decoration: underline;
  }

  /* 세부 레이아웃 */
  .form-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    width: 303px;
  }
  .basic-info {
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
  }
  #title,
  #description {
    width: 303px;
  }
  .predator input {
    width: 100%;
  }

  /* 툴팁 스타일 */
  .trait-row {
    position: relative;
    margin-bottom: 0.5rem;
  }
  .tooltip {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 0.5rem;
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #495057;
  }

  /* 출력 섹션 및 차트 */
  output {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-grow: 1;
    flex-shrink: 1;
  }
  canvas {
    width: 100%;
  }
  .chart-controlls {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;
  }
  .grid-mode {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  /* 로딩 메시지 */
  .loading {
    text-align: center;
    font-size: 1.25rem;
    color: var(--color-text-light);
  }

  /* 반응형 스타일 */
  @media (min-width: 640px) {
    form {
      flex-direction: row;
      justify-content: center;
    }
    .guide-container {
      flex-direction: row;
    }
    /* 기본 설정 영역의 높이를 고정하지 않음 */
    .basic-info {
      align-self: flex-start;
    }
  }
  @media (min-width: 768px) {
    h1 {
      font-size: 3rem;
    }
    h2 {
      font-size: 1.75rem;
    }
    fieldset {
      padding: 2rem;
    }
  }
  @media (min-width: 1600px) {
    .simulator-container {
      flex-direction: row;
    }
    output {
      width: calc(100% - 854px);
      height: fit-content;
      position: sticky;
      top: 0;
      padding: 1rem;
    }
    #ticks {
      width: 87px;
    }
  }

  fieldset fieldset {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    position: relative;
  }

  .input-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .tooltip {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #495057;
    width: 100%;
    box-sizing: border-box;
    word-wrap: break-word;
  }

  .predator input {
    width: 50%;
  }

  @media (min-width: 640px) {
    fieldset fieldset {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .tooltip {
      flex-basis: 100%;
    }

    .input-group {
      flex-basis: calc(50% - 0.2rem);
    }
  }

  /* 포식자 간 공격성 필드셋 스타일 수정 */
  fieldset.A {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.4rem;
  }

  fieldset.A .tooltip {
    grid-column: 1 / -1; /* 툴팁이 전체 너비를 차지하도록 설정 */
    margin-bottom: 0.5rem;
  }

  fieldset.A .input-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  fieldset.A label {
    margin-bottom: 0.25rem;
  }

  fieldset.A input {
    width: 100%;
  }

  @media (max-width: 639px) {
    fieldset.A {
      grid-template-columns: 1fr;
    }
  }

  /* 닫기 버튼 스타일 */
  .hide-button {
    margin-top: 1rem;
  }
</style>
