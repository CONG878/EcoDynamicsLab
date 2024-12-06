<script>
  import Router from "svelte-spa-router";
  import EcoLab from "./EcoLab.svelte";
  import EcoSimulator from "./EcoSimulator.svelte";
  import LabBoard from "./LabBoard.svelte";

  const routes = {
    "/": EcoLab,
    "/EcoSimulator": EcoSimulator,
    "/EcoSimulator/:id": EcoSimulator,
    "/LabBoard": LabBoard,
  };
</script>

<Router {routes} />
