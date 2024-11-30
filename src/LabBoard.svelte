<script>
  import { onMount } from "svelte";
  import { collection, getDocs, query, orderBy } from "firebase/firestore";
  import { db } from "./firebase.js";
  import { link } from "svelte-spa-router";

  let documents = [];

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
</script>

<h1>생태계 정원</h1>
<section>
  {#if documents.length > 0}
    {#each documents as doc}
      <a href="/EcoSimulator/{doc.id}" class="viewSim" use:link>
        <article>
          <h3>{doc.experimentMetadata?.title}</h3>
          <p class="description">{doc.experimentMetadata?.description}</p>
          <time
            datetime={new Date(doc.timestamp?.seconds * 1000).toISOString()}
          >
            {new Date(doc.timestamp?.seconds * 1000).toLocaleString()}
          </time>
        </article>
      </a>
    {/each}
  {:else}
    <p>Loading...</p>
  {/if}
</section>
<a href="/EcoSimulator" class="newSim" use:link>정원 가꾸기</a>

<style>
  h1 {
    text-align: center;
  }
  article {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  h3 {
    flex: 1;
    cursor: pointer;
  }
  .description {
    flex: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 20px;
    cursor: pointer;
  }
  a.viewSim {
    text-decoration: none;
    color: inherit;
  }
  time {
    flex: 1;
    text-align: right;
    font-size: 0.9em;
    color: #666;
  }
  a.newSim {
    float: inline-end;
  }
</style>
