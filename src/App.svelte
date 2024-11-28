<script>
    import { initializeApp } from "firebase/app";
	import Router from "svelte-spa-router";
	import EcoSimulator from "./EcoSimulator.svelte";
	//export let name;
	
	const routes = {
		"/EcoSimulator": EcoSimulator,
	};

	const firebaseConfig = {
		apiKey: process.env.FIREBASE_API_KEY,
		projectId: process.env.FIREBASE_PROJECT_ID,
		appId: process.env.FIREBASE_APP_ID,
		measurementId: process.env.FIREBASE_MEASUREMENT_ID,
	};

	initializeApp(firebaseConfig);
</script>
<Router {routes} />
<!--
<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
-->