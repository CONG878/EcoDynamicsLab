<script>
  import Router from "svelte-spa-router";
  import EcoLab from "./EcoLab.svelte";
  import EcoSimulator from "./EcoSimulator.svelte";
  import EcoGarden from "./EcoGarden.svelte";

  const routes = {
    "/": EcoLab,
    "/EcoSimulator": EcoSimulator,
    "/EcoSimulator/:id": EcoSimulator,
    "/EcoGarden": EcoGarden,
  };
</script>

<Router {routes} />
