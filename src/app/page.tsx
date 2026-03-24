"use client";

import { useState, useMemo } from "react";

interface Link {
  name: string;
  url: string;
  desc: string;
  color: string;
}

interface Category {
  title: string;
  links: Link[];
}

const categories: Category[] = [
  {
    title: "常用",
    links: [
      { name: "Google", url: "https://www.google.com", desc: "搜索引擎", color: "#EA4335" },
      { name: "GitHub", url: "https://github.com", desc: "代码托管", color: "#24292F" },
      { name: "哔哩哔哩", url: "https://www.bilibili.com", desc: "视频平台", color: "#FB7299" },
      { name: "知乎", url: "https://www.zhihu.com", desc: "问答社区", color: "#0066FF" },
    ],
  },
  {
    title: "开发",
    links: [
      { name: "Stack Overflow", url: "https://stackoverflow.com", desc: "开发者问答", color: "#F48024" },
      { name: "MDN", url: "https://developer.mozilla.org", desc: "Web 文档", color: "#000000" },
      { name: "Vercel", url: "https://vercel.com", desc: "部署平台", color: "#000000" },
      { name: "npm", url: "https://www.npmjs.com", desc: "包管理器", color: "#CB3837" },
    ],
  },
  {
    title: "设计",
    links: [
      { name: "Figma", url: "https://www.figma.com", desc: "设计工具", color: "#F24E1E" },
      { name: "Dribbble", url: "https://dribbble.com", desc: "设计灵感", color: "#EA4C89" },
      { name: "Unsplash", url: "https://unsplash.com", desc: "免费图片", color: "#000000" },
      { name: "Color Hunt", url: "https://colorhunt.co", desc: "配色方案", color: "#FF6B6B" },
    ],
  },
  {
    title: "学习",
    links: [
      { name: "Coursera", url: "https://www.coursera.org", desc: "在线课程", color: "#0056D2" },
      { name: "YouTube", url: "https://www.youtube.com", desc: "视频学习", color: "#FF0000" },
      { name: "掘金", url: "https://juejin.cn", desc: "技术社区", color: "#1E80FF" },
    ],
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;

    return categories
      .map((category) => ({
        ...category,
        links: category.links.filter((link) =>
          link.name.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((category) => category.links.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFE4D6] rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-[#E8D5C4] rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-[#F5E6D3] rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-5xl mx-auto px-8 py-20">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium text-[#1a1a1a] tracking-tight leading-none mb-3">
            Browser
          </h1>
          <p className="text-base text-[#8B7355] font-light">
            收藏常用网站，快速访问所需
          </p>
        </header>

        {/* Search */}
        <div className="mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-xl shadow-lg shadow-[#E8D5C4]/50" />
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-[#C4B5A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索网站..."
                className="w-full pl-12 pr-4 py-3.5 bg-transparent text-[#1a1a1a] placeholder-[#C4B5A5] focus:outline-none text-base"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <main className="space-y-16">
          {filteredCategories.length === 0 ? (
            <p className="text-[#8B7355] text-center py-12 text-lg">未找到匹配的网站</p>
          ) : (
            filteredCategories.map((category) => (
              <section key={category.title}>
                <div className="flex items-baseline gap-4 mb-6">
                  <h2 className="text-xs font-semibold text-[#8B7355] uppercase tracking-[0.2em]">
                    {category.title}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#E8D5C4] to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredCard(link.name)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="group relative"
                    >
                      <div className="relative bg-white rounded-2xl p-5 border border-[#F0E6DC] transition-all duration-500 ease-out hover:shadow-xl hover:shadow-[#E8D5C4]/30 hover:border-[#E8D5C4] hover:-translate-y-1">
                        {/* Color indicator */}
                        <div
                          className="absolute top-4 right-4 w-3 h-3 rounded-full transition-transform duration-500"
                          style={{
                            backgroundColor: link.color,
                            transform: hoveredCard === link.name ? 'scale(1.5)' : 'scale(1)'
                          }}
                        />

                        {/* Content */}
                        <div className="pr-8">
                          <h3 className="text-base font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#8B7355] transition-colors duration-300">
                            {link.name}
                          </h3>
                          <p className="text-sm text-[#A09080]">
                            {link.desc}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg className="w-5 h-5 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-[#F0E6DC]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#C4B5A5] tracking-wide">My Navigation</p>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8D5C4]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4C4B0]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4B5A5]" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
