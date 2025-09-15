"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Agent from "@/app/api/agent";

export default function HomePage() {

  return (
    <main>
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl md:text-5xl">
                Agentic Customer Service
                <span className="block text-indigo-500">
                  for WhatsApp & Instagram
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Automate your customer support with intelligent AI agents that
                handle order queries, refund requests, and more across WhatsApp
                and Instagram messaging platforms.
              </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://x.com/joel_th_10">
                    <Button
                    size="lg"
                    className="text-lg rounded-full bg-black hover:bg-white text-white hover:text-black"
                    >
                    Contact Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                    <a href="/huncy_brochure_v1.pdf" download="huncy_brochure_v1.pdf">
                    <Button
                      size="lg"
                      className="text-lg rounded-full bg-black hover:bg-white text-white hover:text-black"
                    >
                      Download Brochure
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </div>
                </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-start">
              <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden" style={{ height: '650px' }}>
                <Agent />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
