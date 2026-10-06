import {Header,Footer} from '@/app/ui/shell';
import {SearchResults} from '@/app/ui/search-results';
import {listPosts} from '@/lib/content';
export const metadata={title:'搜索'};
export default function SearchPage(){return <><Header active="search"/><main id="main" className="site-width paper"><SearchResults posts={listPosts()}/></main><Footer/></>}
