<script>
  import Router from "svelte-spa-router";
  import EcoSimulator from "./EcoSimulator.svelte";
  import LabBoard from "./LabBoard.svelte";

  const routes = {
    "/EcoSimulator": EcoSimulator,
    "/EcoSimulator/:id": EcoSimulator,
    "/LabBoard": LabBoard,
  };
</script>

<Router {routes} />