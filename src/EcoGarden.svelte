<script>
  import { onMount } from "svelte";
  import { collection, getDocs, query, orderBy } from "firebase/firestore";
  import { db } from "./firebase.js";
  import { link } from "svelte-spa-router";

  let documents = [];
  let currentPage = 1;
  const itemsPerPage = 12;

  let pageInput;

  onMount(async () => {
    const q = query(
      collection(db, "ecoSimulations"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  $: paginatedDocuments = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(documents.length / itemsPerPage);

  function goToPage(page) {
    if (totalPages > 0) {
      currentPage = ((((page - 1) % totalPages) + totalPages) % totalPages) + 1;
    }
    if (pageInput) pageInput.value = currentPage;
  }
</script>

<svelte:head>
  <title>Eco Garden</title>
</svelte:head>

<header>
  <a href="/" use:link class="home">대문으로</a>
  <h1>생태계 정원</h1>
</header>
<section class="experiment-list">
  {#if paginatedDocuments.length > 0}
    {#each paginatedDocuments as doc}
      <a href="/EcoSimulator/{doc.id}" class="experiment-card" use:link>
        <article>
          <h3 class="experiment-title">{doc.experimentMetadata?.title}</h3>
          <p class="experiment-description">
            {doc.experimentMetadata?.description}
          </p>
          <time
            datetime={new Date(doc.timestamp?.seconds * 1000).toISOString()}
          >
            {new Date(doc.timestamp?.seconds * 1000).toLocaleString()}
          </time>
        </article>
      </a>
    {/each}
  {:else}
    <p class="no-experiments">첫 생태계를 만들어 주세요.</p>
  {/if}
</section>
<nav class="pagination" aria-label="페이지 네비게이션">
  <button
    on:click={() => goToPage(currentPage - 1)}
    class="btn btn-secondary"
    aria-label="이전 페이지"
  >
    이전 페이지
  </button>
  <div class="page-input">
    <input
      type="number"
      bind:this={pageInput}
      value={currentPage}
      on:change={(e) => goToPage(parseInt(e.target.value, 10))}
      aria-label="현재 페이지"
    />
    <span>&nbsp;/ {totalPages}</span>
  </div>
  <button
    on:click={() => goToPage(currentPage + 1)}
    class="btn btn-secondary"
    aria-label="다음 페이지"
  >
    다음 페이지
  </button>
  <a href="/EcoSimulator" class="btn btn-primary new-sim" use:link
    >정원 가꾸기</a
  >
</nav>

<style>
  /* 공통 헤더 스타일 */
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 2rem;
  }
  .home {
    position: absolute;
    left: 1.5rem;
    color: var(--color-primary);
    font-size: 1.25rem;
  }
  .home:hover {
    text-decoration: underline;
  }
  h1 {
    font-size: 2.5rem;
    color: var(--color-primary-dark);
    text-align: center;
  }

  /* 실험 리스트 레이아웃 */
  .experiment-list {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .experiment-card {
    text-decoration: none;
    color: inherit;
    background-color: var(--color-background-alt);
    border-radius: 0.5rem;
    overflow: hidden;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .experiment-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .experiment-card article {
    padding: 1.5rem;
  }

  .experiment-title {
    font-size: 1.25rem;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .experiment-description {
    font-size: 1rem;
    color: var(--color-text);
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  time {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .no-experiments {
    text-align: center;
    font-size: 1.25rem;
    color: var(--color-text-light);
    padding: 2rem;
    background-color: var(--color-background-alt);
    border-radius: 0.5rem;
  }

  /* 페이지 네비게이션 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    position: relative;
  }

  .btn {
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

  .page-input {
    display: flex;
    align-items: center;
  }

  .page-input input {
    width: 3rem;
    padding: 0.25rem;
    text-align: center;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
  }

  .new-sim {
    position: absolute;
    right: 0;
    margin-bottom: 0.5em;
  }

  /* 반응형 스타일 */
  @media (min-width: 640px) {
    .experiment-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 960px) {
    h1 {
      font-size: 3rem;
    }

    .experiment-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1280px) {
    .experiment-list {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* 기본 숫자 입력 스타일 제거 */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: none;
  }
</style>
