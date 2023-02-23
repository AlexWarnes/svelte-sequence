<script>
  import './app.css';
</script>

<nav>
	<a href="/named">Named</a>
	<a href="/indexed">Indexed</a>
	<a href="/time">Time</a>
</nav>

<main>
	<slot />
</main>

<style>
  nav {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    padding: 0.875rem;
  }
  main {
    padding: 3rem 1rem 1rem;
    background-color: #fafbfc;
  }
</style>