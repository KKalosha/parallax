import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import '@/components/Header/Header.scss'


export default function Header() {

   return (
    <header className='header'>
      <ThemeToggle/>
    </header>
   )
}