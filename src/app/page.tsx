'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bookmark, BookOpen, Search, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: 'Organized Notes',
      description: 'Create and manage your notes with ease using our intuitive interface.'
    },
    {
      icon: <Bookmark className="h-6 w-6 text-primary" />,
      title: 'Smart Bookmarks',
      description: 'Save and categorize your favorite web pages for quick access.'
    },
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: 'Powerful Search',
      description: 'Find exactly what you need with our lightning-fast search functionality.'
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: 'Beautiful UI',
      description: 'Enjoy a clean, modern interface that makes managing your content a pleasure.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-primary/5 to-background" />
        <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Now with enhanced security
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Organize. Access. Succeed.
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            The all-in-one platform for managing your notes and bookmarks with speed and security.
            Everything you need, all in one place.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started - It&apos;s Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/login')}
              className="rounded-full px-8 py-6 text-base font-medium"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A better way to organize your digital life
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our platform is designed to help you stay organized and productive with a beautiful, 
              intuitive interface that works the way you do.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join thousands of users who are already organizing their digital lives with our platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                size="lg"
                onClick={() => router.push('/signup')}
                className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create your free account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
