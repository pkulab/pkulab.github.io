import {Header,Footer} from './ui/shell';
import {HomeIndex} from './ui/home-index';
import {Masthead} from './ui/masthead';
import {listPosts} from '@/lib/content';
export default function Home(){return <><Header active="notes"/><main id="main" className="site-width paper"><Masthead/><HomeIndex initialPosts={listPosts()}/></main><Footer/></>}
