// 약어 정의
// LP: 하위 포식자(Lower Predator), AP: 상위 포식자(Apex Predator)

// 초기 상태 정의
const state = {
    names: { prey: "토끼", LP: "여우", AP: "늑대" },
    stepSize: 0.23,
    tRange: 24,
    preyTraits: { reproductionRate: 3.0, carryingCapacity: 1300 },
    predatorTraits: {
        reproductionRate: [0.04, 0.025],
        predationRate: [0.03, 0.025],
        efficiency: [0.4, 0.12],
        alternativeFood: [450, 750],
    },
    aggressionRateMatrix: [
        [0, 0],
        [0.003, 0.0025]
    ]
};
/* 입력 처리 */
// 라벨 업데이트 함수
function updateLabels(speciesKey, newValue) {
    document.querySelectorAll(`[data-species="${speciesKey}"]`).forEach(label => {
        label.textContent = newValue;
    });
    if (speciesKey === 'LP' || speciesKey === 'AP') {
        document.querySelectorAll(`[data-species="LP-AP"]`).forEach(label => {
            label.textContent = `${state.names.LP} → ${state.names.AP}`;
        });
        document.querySelectorAll(`[data-species="AP-LP"]`).forEach(label => {
            label.textContent = `${state.names.AP} → ${state.names.LP}`;
        });
        document.querySelectorAll(`[data-species="LP-LP"]`).forEach(label => {
            label.textContent = `${state.names.LP} → ${state.names.LP}`;
        });
        document.querySelectorAll(`[data-species="AP-AP"]`).forEach(label => {
            label.textContent = `${state.names.AP} → ${state.names.AP}`;
        });
    }
}

// 상태 업데이트 이벤트
document.querySelectorAll("[data-param]").forEach((input) => {
    input.addEventListener("change", () => {
        const paramPath = input.dataset.param;
        const value = input.type === "number" ? parseFloat(input.value) : input.value;

        // 중첩 객체 갱신
        const keys = paramPath.split(".");
        let current = state;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        // 이름 변경 시 라벨 업데이트
        if (keys[0] === "names") {
            updateLabels(keys[1], value);

            // 차트 데이터셋의 라벨 업데이트
            const datasetIndex = {
                prey: 0, // 피식자 데이터셋의 인덱스
                LP: 1,   // 하위 포식자 데이터셋의 인덱스
                AP: 2,   // 상위 포식자 데이터셋의 인덱스
            }[keys[1]];

            if (datasetIndex !== undefined) {
                ecosystemChart.data.datasets[datasetIndex].label = value;
                ecosystemChart.update();
            }
        }
    });
});
/* 입력 처리 종료 */

/* 차트 생성 */
let ecosystemChart = null; // Chart 객체를 저장할 변수
// 초기 차트 생성 함수
function initializeChart() {
    const ctx = document.getElementById("ecosystemChart").getContext("2d");

    // 초기 데이터 생성 (빈 데이터로 차트 생성)
    const initialLabels = []; // 빈 레이블
    const initialData = []; // 빈 데이터

    ecosystemChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: initialLabels,
            datasets: [
                {
                    label: state.names.prey, // 피식자 이름
                    data: initialData,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y',
                },
                {
                    label: state.names.LP, // 하위 포식자 이름
                    data: initialData,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y1',
                },
                {
                    label: state.names.AP, // 상위 포식자 이름
                    data: initialData,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y1',
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: "관찰 기간(개월)",
                    },
                    ticks: {
                        stepSize: 3,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "피식자 개체수",
                    },
                    beginAtZero: true,
                    position: 'left',
                },
                y1: {
                    title: {
                        display: true,
                        text: "포식자 개체수",
                    },
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        color: 'rgba(100, 150, 255, 0.5)',
                        display: false,
                    }
                },
            },
        },
    });
}
initializeChart();
/* 차트 생성 종료 */

/* 부가 기능 */
// 로그-가우시안 난수를 생성하는 함수
function logGaussianRandom(mean = 0, stdDev = Math.log(1.25)) {
    let u1 = Math.random();
    while (u1 === 0) u1 = Math.random(); // [0,1) -> (0,1)
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // 로그-가우시안 변환
    return mean * Math.exp(stdDev * z0);
}

// 난수화 이벤트 핸들러
document.getElementById('randomizeButton').addEventListener('click', () => {
    // type="number"인 모든 input 요소 선택
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        const currentValue = parseFloat(input.value);

        // 가우시안 난수를 생성하여 입력 필드 값을 업데이트
        input.value = logGaussianRandom(currentValue, Math.log(1.25));
    });
});

document.querySelector('button[type="reset"]').addEventListener("click", () => {
    state.names = { prey: "토끼", LP: "여우", AP: "늑대" };
    updateLabels('prey', state.names.prey);
    updateLabels('LP', state.names.LP);
    updateLabels('AP', state.names.AP);
    ecosystemChart.data.datasets[0].label = state.names.prey;
    ecosystemChart.data.datasets[1].label = state.names.LP;
    ecosystemChart.data.datasets[2].label = state.names.AP;
    ecosystemChart.update();
})

// 체크박스 이벤트 리스너
document.getElementById('prey-axis').addEventListener('change', (e) => {
    ecosystemChart.options.scales.y.grid.display = e.target.checked;
    ecosystemChart.update();
});

document.getElementById('predator-axis').addEventListener('change', (e) => {
    ecosystemChart.options.scales.y1.grid.display = e.target.checked;
    ecosystemChart.update();
});
/* 부가 기능 종료 */

/* 방정식 계산 요청, 수행 및 차트 업데이트 */
function updateChart(simulationResults) {
    // 시뮬레이션 결과에서 데이터 변환
    const labels = simulationResults.map((result) => result.time.toFixed(2)); // 시간 값
    const preyData = simulationResults.map((result) => result.populations[0]); // 피식자 개체수
    const lowerPredatorData = simulationResults.map((result) => result.populations[1]); // 하위 포식자 개체수
    const apexPredatorData = simulationResults.map((result) => result.populations[2]); // 상위 포식자 개체수

    // 차트 데이터 갱신
    ecosystemChart.data.labels = labels;
    ecosystemChart.data.datasets[0].data = preyData;
    ecosystemChart.data.datasets[1].data = lowerPredatorData;
    ecosystemChart.data.datasets[2].data = apexPredatorData;
    ecosystemChart.update();
}

// 계산 요청 이벤트
document.getElementById("calculateBtn").addEventListener("click", async () => {
    // 초기 개체수 가져오기
    const preyPop = parseFloat(document.getElementById("x").value);
    const LPPop = parseFloat(document.getElementById("y1").value);
    const APPop = parseFloat(document.getElementById("y2").value);

    const populations = [preyPop, LPPop, APPop];
    // 서버에 요청
    const response = await fetch("https://simulateecosystem-6ctqr234bq-du.a.run.app/simulateEcosystem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, populations }),
    });

    if (response.ok) {
        const results = await response.json();
        updateChart(results);
    } else {
        console.error("Simulation failed:", await response.text());
    }
});
/* 방정식 계산 요청 및 수행 종료 */