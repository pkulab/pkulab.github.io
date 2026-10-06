import type {Metadata} from 'next';
import {siteConfig} from '@/lib/site-config';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(siteConfig.origin),title:{default:siteConfig.name,template:'%s | 未竟'},description:siteConfig.description,icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><head><link rel="stylesheet" href="/katex/katex.min.css"/></head><body>{children}</body></html>}
