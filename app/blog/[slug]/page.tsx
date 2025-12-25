import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PillarBadge } from '@/components/article/PillarBadge';
import { SocialShareButtons } from '@/components/article/SocialShareButtons';
import { getArticleBySlug, getAllArticles } from '@/lib/data-service';
import { notFound } from 'next/navigation';

interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
    // Await params in Next.js 15
    const { slug } = await params;

    // Find the article by slug
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            {/* Article Header */}
            <section className="bg-white border-b border-gray-100">
                <Container maxWidth="lg">
                    <div className="py-12 md:py-16">
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                            <Link href="/" className="hover:text-[#49648C] transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/blog" className="hover:text-[#49648C] transition-colors">
                                Blog
                            </Link>
                            <span>/</span>
                            <span className="text-[#0B1F3B]">{article.pillar}</span>
                        </div>

                        {/* Pillar Badge */}
                        <PillarBadge pillar={article.pillar} className="mb-6" />

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#0B1F3B] leading-tight mb-6">
                            {article.title}
                        </h1>

                        {/* Subtitle */}
                        {article.subtitle && (
                            <p className="text-xl md:text-2xl text-gray-600 font-light mb-8">
                                {article.subtitle}
                            </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center justify-between border-t border-b border-gray-200 py-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#49648C]">
                                    <Image
                                        src={article.author.photo}
                                        alt={article.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#0B1F3B]">{article.author.name}</p>
                                    <p className="text-xs text-gray-500">{article.author.title}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                <span>•</span>
                                <span>{article.readTime} min read</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Featured Image */}
            <section className="bg-white">
                <Container maxWidth="lg">
                    <div className="relative w-full aspect-[21/9] bg-gray-100">
                        <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </Container>
            </section>

            {/* Article Content */}
            <section className="bg-white">
                <Container maxWidth="md">
                    <article className="py-16 md:py-20">
                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none">
                            {/* Mock content - replace with actual content from CMS */}
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                {article.excerpt}
                            </p>

                            <h2 className="text-3xl font-light text-[#0B1F3B] mt-12 mb-6">Understanding the Landscape</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>

                            <h2 className="text-3xl font-light text-[#0B1F3B] mt-12 mb-6">Key Considerations</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>

                            <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                                <li>Comprehensive regulatory compliance framework</li>
                                <li>Technology integration and automation strategies</li>
                                <li>Risk management and audit preparation</li>
                                <li>Scalable operational infrastructure</li>
                            </ul>

                            <h2 className="text-3xl font-light text-[#0B1F3B] mt-12 mb-6">Implementation Strategy</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                            </p>
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
                            </p>

                            <h2 className="text-3xl font-light text-[#0B1F3B] mt-12 mb-6">Conclusion</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-500 mb-3">Topics:</p>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/blog?tag=${tag.slug}`}
                                        className="px-3 py-1 text-xs font-medium text-[#0B1F3B] border border-gray-200 hover:border-[#49648C] hover:text-[#49648C] transition-colors"
                                        style={{ borderRadius: '2px' }}
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Share */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-500 mb-4">Share this article:</p>
                            <SocialShareButtons
                                title={article.title}
                                url={`https://regulatethis.com/blog/${article.slug}`}
                            />
                        </div>
                    </article>
                </Container>
            </section>

            {/* Author Bio */}
            <section className="bg-[#F5F2EA]">
                <Container maxWidth="md">
                    <div className="py-12 md:py-16">
                        <div className="flex items-start space-x-6">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#49648C] flex-shrink-0">
                                <Image
                                    src={article.author.photo}
                                    alt={article.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-semibold tracking-wide uppercase text-[#49648C] mb-2">About the Author</p>
                                <h3 className="text-2xl font-medium text-[#0B1F3B] mb-2">{article.author.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{article.author.title}</p>
                                <p className="text-base text-gray-700 leading-relaxed">{article.author.bio}</p>

                                {article.author.linkedin && (
                                    <a
                                        href={article.author.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-sm font-medium text-[#49648C] hover:text-[#0B1F3B] transition-colors mt-4"
                                    >
                                        <span>Connect on LinkedIn</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </section >
        </>
    );
}