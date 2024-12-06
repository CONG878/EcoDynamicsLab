<script>
  import { onMount } from "svelte";
  import { doc, getDoc, runTransaction, setDoc } from "firebase/firestore";
  import Chart from "chart.js/auto";
  import { db } from "./firebase.js";
  import { link, push } from "svelte-spa-router";

  export let params = {};
  const id = params.id ?? null; // URL에서 전달받은 실험 ID

  /* 변수 선언 */
  // 초기 상태 정의
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

  // 초기 개체 밀도
  let populations = {
    prey: 1000.0,
    LP: 25.0,
    AP: 10.0,
  };

  // 메타데이터
  let experimentMetadata = {
    title: "",
    description: "",
  };

  let experimentTitle = "생태계를 창조해 주세요."; // 기존 실험 제목 or 환영 멘트
  let ecosystemChart; // 차트 선언

  let initialState;
  let initialPopulations;
  let initialExperimentMetadata;
  /* 변수 선언 종료 */

  /* 변수 업데이트 */
  let dataLoaded = false;
  // 실험 데이터 불러오기 함수
  async function loadExperimentData(documentId) {
    if (documentId) {
      // 문서 참조 생성
      const docRef = doc(db, "ecoSimulations", documentId);

      // 문서 데이터 가져오기
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Firestore 데이터를 변수에 저장
        state = data.state;
        populations = data.populations;
        experimentMetadata = data.experimentMetadata;
        experimentTitle = experimentMetadata.title;
      }
    }

    // 초기 상태를 현재의 값으로 설정
    initialState = JSON.parse(JSON.stringify(state));
    initialPopulations = JSON.parse(JSON.stringify(populations));
    initialExperimentMetadata = JSON.parse(JSON.stringify(experimentMetadata));

    dataLoaded = true; // 데이터 로드 완료 표시
  }
  loadExperimentData(id);

  // 생물 이름 업데이트
  $: if (ecosystemChart && ecosystemChart.data) {
    ecosystemChart.data.datasets[0].label = state.names.prey;
    ecosystemChart.data.datasets[1].label = state.names.LP;
    ecosystemChart.data.datasets[2].label = state.names.AP;
    ecosystemChart.update();
  }
  /* 변수 업데이트 종료 */

  /* 차트 초기화 */
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
            title: { display: true, text: "피식자 개체수" },
            beginAtZero: true,
            position: "left",
          },
          y1: {
            title: { display: true, text: "포식자 개체수" },
            beginAtZero: true,
            position: "right",
            grid: { display: false },
          },
        },
      },
    });
  }

  onMount(() => {
    initializeChart();
  });
  /* 차트 초기화 종료 */

  /* 부가 기능 */
  // 리셋 이벤트
  function resetForm() {
    state = JSON.parse(JSON.stringify(initialState));
    populations = JSON.parse(JSON.stringify(initialPopulations));
    experimentMetadata = JSON.parse(JSON.stringify(initialExperimentMetadata));
    ecosystemChart.update();
  }

  // 로그-가우시안 난수를 생성하는 함수
  function logGaussianRandom(mean = 0, stdDev = Math.log(1.25)) {
    let u1 = Math.random();
    while (u1 === 0) u1 = Math.random(); // [0,1) -> (0,1)
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // 로그-가우시안 변환
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

    const keys = Object.keys(state.aggressionRateMatrix); // 모든 행의 키 가져오기
    keys.forEach((key) => {
      state.aggressionRateMatrix[key] = state.aggressionRateMatrix[key].map(
        (rate) => logGaussianRandom(rate, Math.log(1.25))
      );
    });
  }

  // 체크박스 이벤트 리스너
  let yGridVisible = true;
  let y1GridVisible = false;

  function toggleGrid() {
    ecosystemChart.options.scales.y.grid.display = yGridVisible;
    ecosystemChart.options.scales.y1.grid.display = y1GridVisible;
    ecosystemChart.update();
  }

  // 관측 단위 기간 지정
  let xTicks = 3.0;
  function ticksSize() {
    ecosystemChart.options.scales.x.ticks.stepSize = xTicks;
    ecosystemChart.update();
  }
  /* 부가 기능 종료 */

  /* 시뮬레이션 요청 및 차트 업데이트 */
  // 차트 데이터 업데이트
  function updateChart(simulationResults) {
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

  // 시뮬레이션 요청
  async function simulate() {
    const populationsArray = Object.values(populations); // 객체를 배열로 변환

    const response = await fetch(
      "https://simulateecosystem-6ctqr234bq-du.a.run.app/simulateEcosystem",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, populations: populationsArray }),
      }
    );

    if (response.ok) {
      const results = await response.json();
      updateChart(results);
    } else {
      console.error("Simulation failed:", await response.text());
    }
  }
  /* 시뮬레이션 요청 및 차트 업데이트 종료 */

  /* 매개변수 제출 요청 */
  // 자동 증가 ID 생성 함수
  async function getNextID() {
    const counterRef = doc(db, "counters", "ecoSimCounter"); // 카운터 문서 참조

    const newSimulationID = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      if (!counterDoc.exists()) {
        transaction.set(counterRef, { count: 1 }); // 초기화
        return 1; // 첫 번째 ID
      }
      const currentCount = counterDoc.data().count;
      const nextCount = currentCount + 1;
      transaction.update(counterRef, { count: nextCount }); // 증가
      return nextCount;
    });

    return `ecoSim${newSimulationID}`; // 접두사를 추가하여 ID 생성
  }

  async function handleFormSubmit(event) {
    event.preventDefault(); // 기본 동작 방지

    try {
      const newID = await getNextID(); // 새로운 ID 생성
      const docRef = doc(db, "ecoSimulations", newID); // 문자열 ID 사용

      await setDoc(docRef, {
        state,
        populations,
        experimentMetadata,
        timestamp: new Date(),
      });

      alert("Experiment saved successfully!");
      push("/LabBoard");
    } catch (error) {
      console.error("Error saving experiment:", error);
      alert("Error saving experiment. Please try again.");
    }
  }
  /* 매개변수 제출 요청 종료 */
</script>

<svelte:head>
  <title>Eco Simulator</title>
</svelte:head>

<h1>생태계 시뮬레이터</h1>
<h2>{experimentTitle}</h2>
<section class="simulator-container">
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

        <!-- 실험 메타데이터 -->
        <fieldset class="metadata">
          <div class="buttons">
            <button type="reset" class="btn-secondary">초기화</button>
            <button type="button" on:click={randomize} class="btn-secondary"
              >Randomize</button
            >
            <button type="button" on:click={simulate} class="btn-primary"
              >Simulate</button
            >
          </div>
          <a href="/LabBoard" use:link>다른 환경 보러 가기</a>

          <label for="title">실험 제목</label>
          <input id="title" bind:value={experimentMetadata.title} type="text" />
          <label for="description">실험 설명</label>
          <textarea id="description" bind:value={experimentMetadata.description}
          ></textarea>
          <button type="submit" class="btn-primary">등록</button>
        </fieldset>
      </section>

      <section class="traits">
        <fieldset>
          <legend>피식자 특성</legend>
          <label for="r0">번식률</label>
          <input
            id="r0"
            bind:value={state.preyTraits.reproductionRate}
            type="number"
            step="any"
          />
          <label for="K0">포화 개체수</label>
          <input
            id="K0"
            bind:value={state.preyTraits.carryingCapacity}
            type="number"
            step="any"
          />
        </fieldset>

        <fieldset class="predator">
          <legend>포식자 특성</legend>
          <fieldset class="r">
            <legend>번식률</legend>
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
</section>

<style>
  h1 {
    font-size: 2.5rem;
    color: var(--color-primary-dark);
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
    color: var(--color-text-light);
    margin-bottom: 2rem;
  }

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

  fieldset {
    background-color: var(--color-background-alt);
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  a {
    color: var(--color-primary);
  }

  a:hover {
    text-decoration: underline;
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
    justify-content: space-between;
  }

  #title,
  #description {
    width: 100%;
  }

  button[type="submit"] {
    display: block;
  }

  fieldset fieldset {
    display: flex;
    gap: 0.4rem;
  }

  fieldset fieldset.A {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.4rem;
  }

  .predator input {
    width: 100%;
  }

  output {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  .loading {
    text-align: center;
    font-size: 1.25rem;
    color: var(--color-text-light);
  }

  /* Responsive styles */
  @media (min-width: 640px) {
    form {
      flex-direction: row;
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

  /* Remove default number input styling */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: none;
  }
</style>
