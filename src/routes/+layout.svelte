<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from 'svelte-clerk';

  const { children }: { children: Snippet } = $props();
</script>

<ClerkProvider>
  <header class="site-header">
    <nav>
      <Show when="signed-in">
        <a href="/applications">My Applications</a>
        <UserButton />
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </Show>
    </nav>
  </header>

  <main>
    {@render children()}
  </main>
</ClerkProvider>
