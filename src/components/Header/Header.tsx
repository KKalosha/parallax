import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'


export default function Header() {

   return (
    <header style={{position:'fixed', top:'0', left:'0', background:'transparent', zIndex:'10'}}>
      <h1>hello</h1>
      <ThemeToggle/>
    </header>
   )
}