<script>
import Error from './Error.svelte'
import Progress from './progress/Progress.svelte'
import { url, isActive } from '@roxi/routify'

const rng = () => Math.floor(Math.random() * 1000) + 1
</script>

<style>
header {
  background-color: orange;
  min-height: 4rem;
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
a {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0.25rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  color: whitesmoke;
  text-decoration: none;

  font-size: x-large;
}
a:hover, .active {
  background-color: whitesmoke;
  color: black;

  border-radius: 1rem;
}
</style>

<header>
  <a href={$url('/')} class:active={$isActive('/index')}>/</a>
  <a href={$url('/login')} class:active={$isActive('/login')}>login</a>
  <a href={$url('/home')} class:active={$isActive('/home')}>home</a>
  <a href={$url('/non-existent')} class:active={$isActive('/non-existent')}>non-existent</a>
  <a href={$url(`/param/${rng()}`)} class:active={$isActive('/param')}>param</a>
  <a href={$url('/qs?a=1&b=2&c=3&d=4&d=5')} class:active={$isActive('/qs')}>qs</a>
  <a href={$url('/env')} class:active={$isActive('/env')}>env</a>
  <a href={$url('/sass')} class:active={$isActive('/sass')}>sass</a>
  <a href={$url('/backend')} class:active={$isActive('/backend')}>backend</a>
  <a href={$url('/errorhandling')} class:active={$isActive('/errorhandling')}>errorhandling</a>
  <a href={$url('/progress')} class:active={$isActive('/progress')}>progress</a>
  <a href={$url('/mdc')} class:active={$isActive('/mdc')}>mdc</a>
</header>

<Progress />

<Error />