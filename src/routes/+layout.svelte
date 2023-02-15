<nav>
	<a href="/named">Named</a>
	<a href="/indexed">Indexed</a>
</nav>

<main>
	<slot />
</main>

<style>
  :global(body){
    font-family: sans-serif;
  }
  :global(*){
    box-sizing: border-box;
  }
  :global(section){
    margin: 1rem auto;
  }
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
    color: white;
  }
</style>